/**
 * Created by decipher on 17.2.16.
 */
export class DocumentsService {
  constructor($http, $log, ConfigService, LocalAccessService, CheckAuthService, StorageService, $window, $q) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$q = $q;
    this.$window = $window;
    this.configService = ConfigService;
    this.initPagerValues();
    this.localAccessService = LocalAccessService;
    this.storageService = StorageService;
    this.CheckAuthService = CheckAuthService;
  }

  initPagerValues() {
    this.configService = this.configService || ConfigService;
    this.startValue = this.configService.getDocumentStartValue();
    this.offset = this.configService.getDocumentOffsetValue();
    this.endValue = this.offset;
    this.busy = false;
  }

  getBasePath(apiName) {
    let api = apiName ? apiName : 'document'
    return this.configService.getBaseUrl() + api;
  }

  getPageIdHashByValueAndRange(value, start, end) {
    return value + '_' + start + '_' + end;
  }

  getUserCacheId(value) {
    return value + '/' + this.CheckAuthService.userid;
  }

  baseAuthCall(configExtension, options, value, skipCache) {
    let self = this;
    let deferred = this.$q.defer();
    let accesskey = configExtension.auth ? configExtension.auth.accesskey : null;
    if (accesskey) {
      return self.baseCall(configExtension, options, value, skipCache);
    }

    if (!self.CheckAuthService.userid) {
      self.CheckAuthService.getUser().then(function(userResponse) {
        self.CheckAuthService.userid = userResponse.userid;
        if (userResponse && userResponse.userid) {
          deferred.resolve(self.baseCall(configExtension, options, value, skipCache));
        } else {
          console.log('what?');
          deferred.resolve(null);
        }
      });
    } else {
      return self.baseCall(configExtension, options, value, skipCache);
    }

    return deferred.promise;
  }

  baseCall(configExtension, options, value, skipCache) {

    let self = this;
    let promise;
    this.busy = true;

    let deferred = this.$q.defer();

    if (configExtension.document) {
      if (this.filter) {
        //test it
        configExtension.document.filter = this.filter;
      }
      //with paging support
      if (options['start'] && options['end']) {
        this.startValue = options['start'] ? options['start'] : this.configService.getDocumentStartValue();
        this.endValue = options['end'] ? options['end'] : this.configService.getDocumentOffsetValue();

        configExtension.document.offset = {
          "start": this.startValue,
          "end": this.endValue
        };
      }
    }

    if (options['itemKey']) {
      this[options['itemKey']] = null;
    }

    if (options['cacheName'] && !skipCache && !options['set']) {
      if (!value) {
        value = options['cacheName'];
      }
      let cachedPromise;
      if (options['start'] && options['end']) {
        let modValue = self.getPageIdHashByValueAndRange(value, self.startValue, self.endValue);
        cachedPromise = this.getCache(options['cacheName'], modValue);//no subkey = whole
      } else {
        cachedPromise = this.getCache(options['cacheName'], value, options['dataKey']);
      }

      cachedPromise.then(function(response) {
        self.busy = false;
        let dataContainer = {
          "data": {}
        };

        if (options['useAllData']) {
          dataContainer.data = response;
        } else {
          dataContainer.data[options['dataKey']] = response;
        }

        if (dataContainer.data && dataContainer.data[options['dataKey']] && (dataContainer.data[options['dataKey']].length || angular.isObject(dataContainer.data[options['dataKey']]))) {
          deferred.resolve(dataContainer);
        } else {
          //set case
          let credentialsPromise = self.localAccessService.getCredentails();

          credentialsPromise.then(function(credentials) {
            if (!credentials && !configExtension.auth) {
              //credentialsPromise.reject();
              //?
              return;
            }

            let baseConfig = {
              contentType: 'application/json',
              datatype: 'json'
            };
            if (credentials && !configExtension.auth) {
              credentials = self.localAccessService.decryptCredentials(credentials);
              baseConfig.auth = {
                "user" : { "username" : credentials.userId, "password" : credentials.passWord }
              }
            }

            let finalConfig = angular.merge(baseConfig, configExtension);

            promise =  self.$http.post(self.getBasePath(options['apiName']), finalConfig);

            promise.then(function(response) {
              if (options['cacheName']) {
                self.storeCache(options['cacheName'], response);
              }
              self[options['itemKey']] = response.data[options['dataKey']];
              self.busy = false;
              deferred.resolve(response);
              if (options['dataKey'] && response.data[options['dataKey']]) {
                deferred.resolve(response);
              } else {
                //no data
                let dataResponse = {"data": {}};
                if (response.data.response && !response.data.response.success) {
                  dataResponse.error = response.data.response.errormessage;
                }
                deferred.resolve(dataResponse);
              }
            });
            if (options['cacheName']) {

              if (!value) {
                value = options['cacheName'];
              }
              if (options['start'] && options['end']) {
                value = self.getPageIdHashByValueAndRange(value, options['start'], options['end']);
              }
              if (options['useAllData']) {
                self.setCache(promise, options['cacheName'], value, options['dataKey'], true);
              } else {
                self.setCache(promise, options['cacheName'], value, options['dataKey']);

              }
            }
          });
        }
      });

      return deferred.promise;
    }

    let credentialsPromise = self.localAccessService.getCredentails();

    credentialsPromise.then(function(credentials) {
      if (!credentials && !configExtension.auth) {
        //credentialsPromise.reject();
        //?
          return;
      }

      let baseConfig = {
        contentType: 'application/json',
        datatype: 'json'
      };

      if (credentials && !configExtension.auth) {
        credentials = self.localAccessService.decryptCredentials(credentials);
        baseConfig.auth = {
          "user" : { "username" : credentials.userId, "password" : credentials.passWord }
        }
      }

      let finalConfig = angular.merge(baseConfig, configExtension);

      promise =  self.$http.post(self.getBasePath(options['apiName']), finalConfig);

      promise.then(function(response) {
        if (options['cacheName'] && !options['set']) {
          self.storeCache(options['cacheName'], response);
        }
        self[options['itemKey']] = response.data[options['dataKey']];
        self.busy = false;

        if (options['dataKey'] && response.data[options['dataKey']]) {
          deferred.resolve(response);
        } else {
          let dataResponse = {"data": {}};
          if (response.data.response && !response.data.response.success) {
            dataResponse.error = response.data.response.errormessage;
          }
          deferred.resolve(dataResponse);
        }
      });

      if (options['cacheName']) {

       // self.setCache(promise, options['cacheName'], value, options['dataKey']);

        if (!value) {
          value = options['cacheName'];
        }

        if (options['useAllData']) {
          self.setCache(promise, options['cacheName'], value, options['dataKey'], true);
        } else {
          self.setCache(promise, options['cacheName'], value, options['dataKey']);
        }

      }
    });
    return deferred.promise;
  }

  callDocumentsCore(skipCache) {

    skipCache = skipCache || false;

    let configExtension = {
      "collection" : {
        "method" : "core"
      }
    };
    let options = {
      "cacheName": "core",
      "itemKey": "coreItems",
      "dataKey": "collections"
    };

    return this.baseAuthCall(configExtension, options, null, skipCache);
  }

  callAddCoreItem(data) {
    //TODO: when ready
    let configExtension = {
      "collection" : {
        "method" : "add core",//?
        "data" : data
      }
    };
    let options = {
      /*"itemKey": "addCoreItems",*/
      "set": true,
      "dataKey": "collections"
    };
    //different base method for adding?
    //will it return new collection set?
    return this.baseAuthCall(configExtension, options, null, true);
  }

  searchDocumentsCore(searchPhrase) {

    let configExtension = {
      "collection" : {
        "method" : "by name",
        "name" : searchPhrase
      }
    };
    let options = {
      "itemKey": "searchCoreItems",
      "dataKey": "collections"
    };

    return this.baseAuthCall(configExtension, options);
  }

  callDocumentRelated(value, skipCache) {

    skipCache = skipCache || false;

    let configExtension = {
      "collection": {
        "method": "related by ID",
        "group": { "value": value }
      }
    };
    let options = {
      "cacheName": "collections",
      "itemKey": "collectionItems",
      "dataKey": "collections"
    };

    return this.baseAuthCall(configExtension, options, value, skipCache);
  }

  callDocumentAllCollections(value, skipCache) {

    skipCache = skipCache || false;
    value = value || '<all>';

    let configExtension = {
      "collection": {
        "method": "all"
      }
    };
    let options = {
      "fillBy" : "value",
      "cacheName": "collections",
      "itemKey": "collectionItems",
      "dataKey": "collections"
    };

    return this.baseAuthCall(configExtension, options, value, skipCache);

  }

  callAddCollectionItem(value, data) {
    //TODO: when ready
    let configExtension = {
      "collection" : {
        "method" : "add collection",//?
        "group": { "value": value },//?
        "data" : data //?
      }
    };
    let options = {
      /*"itemKey": "addCoreItems",*/
      "set": true,
      "dataKey": "collections"
    };
    //different base method for adding?
    //will it return new collection set?
    return this.baseAuthCall(configExtension, options, null, true);
  }

  callEditCollectionItem(value, data, oldItem) {
    //TODO: when ready
    let configExtension = {
      "collection" : {
        "method" : "edit collection",//?
        "group": { "value": value, "oldValue": oldItem.title.value },//?
        "data" : data //?
      }
    };
    let options = {
      /*"itemKey": "addCoreItems",*/
      "set": true,
      "dataKey": "collections"
    };
    return this.baseAuthCall(configExtension, options, null, true);
  }


  callDocumentByOneCollection(id, start, end, skipCache) {

    let configExtension =
    {
      "document": {
        "method" : "by collection",
        "collection" : id
      }
    };

    if (this.filter && this.filter.length) {
      skipCache = true;
    }

    start = start ? start : this.configService.getDocumentStartValue();
    end = end ? end : this.configService.getDocumentOffsetValue();

    let options = {
      "cacheName": "documents",
      "itemKey": "documentsItems",
      "dataKey": "documents",
      "useAllData": true,
      "start": start,
      "end": end
    };

    return this.baseAuthCall(configExtension, options, id, skipCache);//id??
  }

  callDocumentByAccessKey(accessKey, start, end, skipCache) {


    //skipCache = true;//for now

    let configExtension =
    {
      "auth": {
        "accesskey": { "longkey": accessKey }
      },
      "document": {
        "method" : "by accesskey"
      }
    };

    if (this.filter && this.filter.length) {
      skipCache = true;
    }

    start = start ? start : this.configService.getDocumentStartValue();
    end = end ? end : this.configService.getDocumentOffsetValue();

    let options = {
      "apiName" : "accesskey",
      "cacheName": "documents",
      "itemKey": "documentsItems",
      "dataKey": "documents",
      "useAllData": true,
      "start": start,
      "end": end
    };

    return this.baseCall(configExtension, options, accessKey, skipCache);//id??
  }

  callDocumentById(id, accessKey, skipCache) {

    skipCache = skipCache || false;

    let configExtension =
    {
      "document": {
        "method" : "by ID",
        "id" : id
      }
    };

    if (accessKey) {
      configExtension.auth = {
        "accesskey": { "longkey": accessKey }
      }
    }

    let options = {
      "cacheName": "document_detail",
      "itemKey": "documentItem",
      "dataKey": "document"/*,
      "useAllData": true,*/
    };

    return this.baseAuthCall(configExtension, options, id, skipCache);//id??
  }

  callSaveDocumentById(id, data) {

    let configExtension =
    {
      "document": {
        "method" : "change",//TODO rename to change
        "id" : id
      }
    };

    if (data) {
      if (data.persist) {
        configExtension.document.persist = data.persist;// "lasting" is default. If "long-lasting" it can not be deleted or modified to a different "persist" type.
      }
      if (data.no) {
        configExtension.document.no = data.no; // a running number for all documents of type receipt+invoice
      }
      if (data.title) {
        configExtension.document.title = data.title; // optional title, if null we use the filename without extention
      }
      if (data.type && data.type.value) {
        configExtension.document.type = data.type; //{ "value":"INVOICE" }, optional document type
      }
      if (data.date) {
        configExtension.document.date = data.date; // "2014-01-01", optional document date, if null system_date or recognized document date is used
      }
      if (angular.isDefined(data.text)) {
        configExtension.document.text = data.text;// optional free text
      }
      //receipt_status dropped
      if (data.netvaluegoods) {
        configExtension.document.netvaluegoods = data.netvaluegoods; //0.0, optional net in money
      }
      if (data.totalamount) {
        configExtension.document.totalamount = data.totalamount;//0.0, optional gross in money
      }
      if (data.totaltax) {
        configExtension.document.totaltax = data.totaltax; //0.0, optional tax in money
      }
      if (data.payment_days) {
        configExtension.document.payment_days = data.payment_days;//14, an optional number of days payment terms on invoices
      }
      if (data.payment_date) {
        configExtension.document.payment_date = data.payment_date;//"2014-01-15", an optional payment term date on invoices (=date+payment_days=payment_date)
      }
      if (data.discount_factor) {
        configExtension.document.discount_factor = data.discount_factor; //0.3, optional for 3% discount on payment before payment_date
      }
      if (data.post_date) {
        configExtension.document.post_date = data.post_date; //"2014-01-15", optional date when money transfer hit account
      }
      if (data.deleted) {
        configExtension.document.deleted = data.deleted; // "timestamp", if this is set this document moves to the trash. From trash it can be deleted or recovered
      }
      /*collections sample:*/

      /*
        "collections" : [
            // collection tagging part is optional.
            // If not avail -> no change on collections.
            // if empty, all collections other then "Monat", "Type" and "NEW" are removed
        {
              "group" : {
                  "value" : „INBOX“
              },
              "title" : {
                  "value" : „LETTERBOX“
              }
        },
          // any new or existing collection. service manage Insert/Delete
          {
            "id" : 4
          }, // ids only since collection must be avail on doc change
          {
            "id" : 13
          }, {
            "id" : 7
          }, {
            "id" : 9
          }
        ]
      */

      if (data.collections && angular.isArray(data.collections)) {
        configExtension.document.collections = data.collections; // see above
      }

      /*"workflow" : { } // see wiki/WorkflowNotes*/
      if (data.workflow) {
        configExtension.document.workflow = data.workflow; // {}??? // see wiki/WorkflowNotes
      }
    }

    /*if (accessKey) {
      configExtension.auth = {
        "accesskey": { "longkey": accessKey }
      }
    }*/

    //???
    let options = {
      "itemKey": "documentItem",
      "dataKey": "document"/*,
       "useAllData": true,*/
    };

    //console.log(configExtension, options, id, true);
    //return;

    return this.baseAuthCall(configExtension, options, id, true);
  }

  cleanupRelatedLists(storeName, documentId) {
    /*let subSetName = 'documents';//??
    let innerId = 'id';*/
    let cleanupOptions = {
      'subSetName': 'documents',
      'innerIdName' : 'id',
      'innerIdValue' : documentId
    };
    this.storageService.cleanSelectedRecords(storeName, cleanupOptions);
  }

  updateRelatedRelatedDocumentCache(storeName, documentId, data) {
    let options = {
      'subSetName': 'documents',
      'innerIdName' : 'id',
      'innerIdValue' : documentId,
      'data' : data
    };
    this.storageService.updateSelectedRecords(storeName, options);
  }

  searchDocument(value, start, end, skipCache) {
    /*Do not use. not implemented yet.*/
    let configExtension =
    {
      "document": {
        "method" : "by collection",
        "search" : value
      }
    };

    start = start ? start : this.configService.getDocumentStartValue();
    end = end ? end : this.configService.getDocumentOffsetValue();

    let options = {
      /*"cacheName": "documents",*/
      "itemKey": "documentsItems",
      "dataKey": "documents",
      "useAllData": true,
      "start": start,
      "end": end
    };

    return this.baseAuthCall(configExtension, options, value, true);
  }

  callFileById(id, type, accessKey) {
    /*
    * types:
    *  "ORIGINAL", "THUMBNAIL", "SIGNATURE", "SIGNEDPDF", "REPORT", "OPENTRANS2"
    * */

    type = type || 'ORIGINAL';

    let configExtension = {
      "file" : {
        "method" : "file by ID",
          "id" : id,
          "filetype" :  type
      }
    };

    if (accessKey) {
      configExtension.auth = {
        "accesskey": { "longkey": accessKey }
      }
    }

    let options = {
      "itemKey": "fileItems",
      "dataKey": "file",
      "useAllData": true
    };

    return this.baseAuthCall(configExtension, options, id, true);
  }


  setCache(promise, scope, cacheId, dataKey, useAllData) {

    if (this.filter && this.filter.length) {
      return;//test
    }

    let self = this;

    if (self.CheckAuthService.userid) {
      cacheId = this.getUserCacheId(cacheId)
    }

    promise.then(function(response) {

      //console.log('setCache:store, response:', response, 'response.data.collections:',response.data.collections );

      let dataSource = response.data[dataKey];

      if (!dataSource) {
        return;
      }

      if (!cacheId) {

        //we always should have it, actually

        /*self.storageService.clearStorage(scope).then(function(rsp){
          console.log(scope, dataSource);
          self.storageService.upsertRecord(scope, dataSource);
        });*/

      } else {
        let timeOffset = self.configService.getCacheExpirationPeriod() * 24 * 60 * 60 * 1000;//right
        //let timeOffset = 60*1000;//test
        let expireDate = new Date().getTime() + timeOffset;
        let data = {
          'id': cacheId,
          'expireDate': expireDate
        };
        if (useAllData) {
          data = angular.merge(data, response.data);
        } else {
          data[dataKey] = dataSource;
        }
        self.storageService.upsertRecord(scope, data);
      }
    });
  }

  getCache(scope, cacheId, dataKey) {
    if (!cacheId) {
      return this.storageService.getAllRecords(scope);
    } else {
      if (this.CheckAuthService.userid) {
        cacheId = this.getUserCacheId(cacheId);
      }
      return this.storageService.getSingleRecordPromise(scope, cacheId, dataKey);
    }
  }

  storeCache(cacheName, response) {
    /*this one is used for navigation caching*/
    let data = {};
    if (response.data && response.data['collections']) {
      angular.forEach(response.data['collections'], function (item, key) {
        //console.log(item, key);
        if (item.id && item.title) {
          //collection case and higher
          data[item.id] = item.title;
        } else if (item.group && item.group.value) {
          //basic case
          data[item.group.value] = item.group;
        }
      });
    }

    if (Object.keys(data).length) {
      try {
        let prevData = JSON.parse(this.$window.localStorage.getItem(cacheName));
        data = angular.extend(data, prevData);
        this.$window.localStorage.setItem(cacheName, JSON.stringify(data));
      } catch (e) {
        //console.log('error:', e)
      }
    }
  }

  clearCache() {
    //for redirect case
    /*try {
      this.$window.localStorage.removeItem('core');
      this.$window.localStorage.removeItem('collections');
    } catch (e) {
      //failed to clear storage
      this.$log.log('failed to clear storage')
    }*/

    //clear Data Cache only
    this.dataCache = null;
  }

}
