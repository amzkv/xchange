/**
 * Created by decipher on 17.2.16.
 */
export class DocumentsService {
  constructor($http, $log, ConfigService, LocalAccessService, $window) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.configService = ConfigService;
    this.initPagerValues();
    this.localAccessService = LocalAccessService;
  }

  initPagerValues() {
    this.configService = this.configService || ConfigService;
    this.startValue = this.configService.getDocumentStartValue();
    this.offset = this.configService.getDocumentOffsetValue();
    this.endValue = this.offset;
    this.busy = false;
  }

  callDocumentsCore() {

    this.busy = true;
    this.coreItems = null;
    let cachedPromise = this.getCache('core');
    if (cachedPromise) {
      this.busy = false;
      return cachedPromise;
    }
    let credentials = this.localAccessService.getCredentails();
    if (!credentials) {
      return;
    }
    let info =
    {
      "auth" : {
        "user" : { "username" : credentials.userId, "password" : credentials.passWord }
      },
      "collection" : {
        "method" : "core"
      }
    };
    let self = this;
    let promise =  this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      collection: info.collection,
      contentType: 'application/json',
      datatype: 'json'
    });

    promise.then(function(response) {
      self.storeCache('core', response);
      self.coreItems = response.data.collections;
      self.busy = false;
    });
    this.setCache(promise, 'core');
    return promise;

  }

  callDocumentRelated(value) {

    this.busy = true;
    this.collectionItems = null;

    let cachedPromise = this.getCache('collections', value);
    if (cachedPromise) {
      //console.log(cachedPromise);
      this.busy = false;
      return cachedPromise;
    }

    let credentials = this.localAccessService.getCredentails();
    let info =
    {
      "auth" : {
        "user" : { "username" : credentials.userId, "password" : credentials.passWord }
      },
      "collection": {
        "method": "related by ID",
        "group": { "value": value }
      }
    };

    let self = this;
    let promise = this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      collection: info.collection,
      contentType: 'application/json',
      datatype: 'json'
    });

    promise.then(function(response) {
      self.storeCache('collections', response);
      self.collectionItems = response.data.collections;
      self.busy = false;
    });

    this.setCache(promise, 'collections', value);
    return promise;

  }

  callDocumentByOneCollection(id, start, end) {

    this.busy = true;

    let credentials = this.localAccessService.getCredentails();
    let offset_value = this.offset;
    this.startValue = start ? start : this.configService.getDocumentStartValue();
    this.endValue = end ? end : this.configService.getDocumentOffsetValue();

    let document = {
      "method" : "by collection",
      "collection" : id,
      "offset" : { "start" : this.startValue, "end" : this.endValue }
    };

    if (this.filter) {
      document.filter = this.filter;
    }

    let info =
    {
      "auth" : {
        "user" : { "username" : credentials.userId, "password" : credentials.passWord }
      },
      "document": document
    };

    let self = this;
    let promise = this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      document: info.document,
      contentType: 'application/json',
      datatype: 'json'
    });

    promise.then(function(response) {
      self.busy = false;
    });

    return promise;
  }

  callDocumentById(id) {

    this.busy = true;

    let credentials = this.localAccessService.getCredentails();
    let info =
    {
      "auth" : {
        "user" : { "username" : credentials.userId, "password" : credentials.passWord }
      },
      "document": {
        "method" : "by ID",
        "id" : id,
      }
    };

    let self = this;
    let promise = this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      document: info.document,
      contentType: 'application/json',
      datatype: 'json'
    });

    promise.then(function(response) {
      self.busy = false;
    });

    return promise;
  }

  setCache(promise, scope, cacheId) {
    /*used for caching for 1 and 2 level(core and collections)*/
    if (scope && promise) {
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
    return false;
  }

  getCache(scope, cacheId) {
    if (scope && this.dataCache && this.dataCache[scope]) {
      if (cacheId) {
        if (this.dataCache[scope] && this.dataCache[scope][cacheId]) {
          return this.dataCache[scope][cacheId];
        }
        return null;
      }
      return this.dataCache[scope];
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
