/**
 * Created by decipher on 17.2.16.
 */
export class DocumentsService {
  constructor($http, $log, ConfigService, LocalAccessService, StorageService, $window, $q) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$q = $q;
    this.$window = $window;
    this.configService = ConfigService;
    this.initPagerValues();
    this.localAccessService = LocalAccessService;
    this.storageService = StorageService;
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

    return this.baseCall(configExtension, options, null, skipCache);
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
    return this.baseCall(configExtension, options, null, true);
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

    return this.baseCall(configExtension, options);
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

    return this.baseCall(configExtension, options, value, skipCache);
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
    return this.baseCall(configExtension, options, null, true);
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
    return this.baseCall(configExtension, options, null, true);
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

    return this.baseCall(configExtension, options, id, skipCache);//id??
  }

  callDocumentByAccessKey(accessKey, start, end, skipCache) {


    skipCache = true;//for now

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

  callDocumentById(id, accessKey) {

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

    return this.baseCall(configExtension, options, id);//id??
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

    return this.baseCall(configExtension, options, value, true);
  }

  callFileById(id, type) {
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

    let options = {
      "itemKey": "fileItems",
      "dataKey": "file",
      "useAllData": true
    };

    return this.baseCall(configExtension, options, id, true);
  }


  setCache(promise, scope, cacheId, dataKey, useAllData) {

    if (this.filter && this.filter.length) {
      return;//test
    }

    let self = this;

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
