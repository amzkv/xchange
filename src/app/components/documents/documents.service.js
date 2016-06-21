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
    /*this.coreItems = null;*/

    if (options['cacheName'] && !skipCache) {
      //TODO: use indexedDB cache instead
      //console.log('cache case')
      if (!value) {
        //todo:test2
        value = options['cacheName'];
      }
      let cachedPromise;
      if (options['start'] && options['end']) {
        let modValue = self.getPageIdHashByValueAndRange(value, self.startValue, self.endValue);
        cachedPromise = this.getCache(options['cacheName'], modValue);//no subkey = whole
      } else {
        cachedPromise = this.getCache(options['cacheName'], value, options['dataKey']);
      }

      //console.log('cachedPromise', cachedPromise);
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

              /*if (response.data.control) {
                response.start = self.startValue;
              }*/

              deferred.resolve(response);
            });
            //TODO: use indexedDB cache instead
            if (options['cacheName']) {
              if (!value) {
                //todo:test
                value = options['cacheName'];
              }
              if (options['start'] && options['end']) {
                //todo??
                //options['start'] and options['end']??
                value = self.getPageIdHashByValueAndRange(value, options['start'], options['end']);
                //value = self.getPageIdHashByValueAndRange(value, self.startValue, self.endValue);
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

      //console.log("cache:",cachedPromise);
      /*if (cachedPromise) {
        this.busy = false;
        return cachedPromise;
      }*/
    }

    let credentialsPromise = self.localAccessService.getCredentails();

    credentialsPromise.then(function(credentials) {
      if (!credentials) {
        //credentialsPromise.reject();
        //?
        return;
      }
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

    //console.log('callDocumentByOneCollection', start, end);

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

  setCache(promise, scope, cacheId, dataKey, useAllData) {
    /*used for caching for 1 and 2 level(core and collections)*/
    let self = this;

    promise.then(function(response) {
      /*console.log('setCache:store, response:', response, 'response.data.collections:',response.data.collections );
      let dataSource = response.data.collections || response.data.documents;//TODO

      if (!cacheId) {
        self.storageService.clearStorage(scope);
        self.storageService.insertRecord(scope, dataSource);
      } else {
        let timeOffset = self.configService.getCacheExpirationPeriod()*24*60*60*1000;//right
        //let timeOffset = 60*1000;//test
        let expireDate = new Date().getTime() + timeOffset;
        let data = {
          'id': cacheId,
          'collections': dataSource,
          'expireDate': expireDate
        };

        if (response.data.documents) {
          /!*angular.extend(data, response.data)*!/
          data.avail_filter = response.data.avail_filter;
          data.control = {};
          data.control.total_documents = response.data.control ? response.data.control.total_documents : self.endValue;
          data.start = response.start;
        }

        self.storageService.upsertRecord(scope, data);
      }*/

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

    //return;

    /*if (scope && promise) {
      if (!this.dataCache) {
        this.dataCache = {};
      }
      if (cacheId) {
        if (!this.dataCache[scope]) {
          this.dataCache[scope] = {};
        }
        this.dataCache[scope][cacheId] = promise;
      } else {
        this.dataCache[scope] = promise;
      }
      return true;
    }
    return false;*/
  }

  getCache(scope, cacheId, dataKey) {

    if (!cacheId) {
      //console.log('gC:1');
      return this.storageService.getAllRecords(scope);
    } else {
      //same for now
      //console.log('gC:2');
      return this.storageService.getSingleRecordPromise(scope, cacheId, dataKey);
      /*if (cache) {
        console.log(cache);
      }
      return cache;*/
    }


    /*if (scope && this.dataCache && this.dataCache[scope]) {
      if (cacheId) {
        if (this.dataCache[scope] && this.dataCache[scope][cacheId]) {
          return this.dataCache[scope][cacheId];
        }
        return null;
      }
      return this.dataCache[scope];
    }*/

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
