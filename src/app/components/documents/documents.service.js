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

  getBasePath() {
    return this.configService.getBaseUrl() + 'document'
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

    if (options['cacheName'] && !skipCache) {
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
          //console.log('collections-from cache:', dataContainer);
          deferred.resolve(dataContainer);
        } else {
          //set case
          let credentialsPromise = self.localAccessService.getCredentails();

          credentialsPromise.then(function(credentials) {
            if (!credentials) {
              //credentialsPromise.reject();
              //?
              return;
            }
            credentials = self.localAccessService.decryptCredentials(credentials);
            let baseConfig = {
              auth: {
                "user" : { "username" : credentials.userId, "password" : credentials.passWord }
              },
              contentType: 'application/json',
              datatype: 'json'
            };

            let finalConfig = angular.merge(baseConfig, configExtension);

            promise =  self.$http.post(self.getBasePath(), finalConfig);

            promise.then(function(response) {
              if (options['cacheName']) {
                self.storeCache(options['cacheName'], response);
              }
              self[options['itemKey']] = response.data[options['dataKey']];
              self.busy = false;

              deferred.resolve(response);
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
      if (!credentials) {
        //credentialsPromise.reject();
        //?
        return;
      }

      credentials = self.localAccessService.decryptCredentials(credentials);

      let baseConfig = {
        auth: {
          "user" : { "username" : credentials.userId, "password" : credentials.passWord }
        },
        contentType: 'application/json',
        datatype: 'json'
      };

      let finalConfig = angular.merge(baseConfig, configExtension);

      promise =  self.$http.post(self.getBasePath(), finalConfig);

      promise.then(function(response) {
        if (options['cacheName']) {
          self.storeCache(options['cacheName'], response);
        }
        self[options['itemKey']] = response.data[options['dataKey']];
        self.busy = false;
        deferred.resolve(response);
      });
      //TODO: use indexedDB cache instead
      if (options['cacheName']) {
        //console.log('set2');

       // self.setCache(promise, options['cacheName'], value, options['dataKey']);

        if (options['useAllData']) {
          self.setCache(promise, options['cacheName'], value, options['dataKey'], true);
        } else {
          self.setCache(promise, options['cacheName'], value, options['dataKey']);
        }

      }
    });
    return deferred.promise;
  }

  callDocumentsCore() {

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

    return this.baseCall(configExtension, options);
  }

  callDocumentRelated(value) {

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

    return this.baseCall(configExtension, options, value);
  }

  callDocumentByOneCollection(id, start, end, skipCache) {

    let configExtension =
    {
      "document": {
        "method" : "by collection",
        "collection" : id
      }
    };

    //console.log('filter:',this.filter);
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

  callDocumentById(id) {

    let configExtension =
    {
      "document": {
        "method" : "by ID",
        "id" : id
      }
    };

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

  quickFilter(collection) {
    /*if ($scope.searchFilter) {
      if (collection.title) {
        return collection.title.indexOf(this.searchFilter) == -1;
      }
    }*/
    return true;
  }

  setCache(promise, scope, cacheId, dataKey, useAllData) {

    if (this.filter && this.filter.length) {
      return;//test
    }

    let self = this;

    promise.then(function(response) {

      //console.log('setCache:store, response:', response, 'response.data.collections:',response.data.collections );

      let dataSource = response.data[dataKey];

      if (!cacheId) {
        self.storageService.clearStorage(scope);
        self.storageService.insertRecord(scope, dataSource);
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
