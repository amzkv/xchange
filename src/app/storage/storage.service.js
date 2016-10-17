export class StorageService {
  constructor($http, $log, $window, $q, $indexedDB) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.$indexedDB = $indexedDB;
    this.$q = $q;
  }

  getAllRecords(storeName) {
    if (!storeName) {
      return;
    }

    let deferred = this.$q.defer();

    this.$indexedDB.openStore(storeName, function(store){
      store.getAll().then(function(topics) {
        deferred.resolve(topics);
      });
    });

    return deferred.promise;
  }

  cleanSelectedRecords(storeName, options) {
    if (!storeName) {
      return;
    }
    let recordIds = [];
    let self = this;
    this.getAllRecords(storeName).then(function(topics) {
      angular.forEach(topics, function(item) {
        if (item[options.subSetName]) {
          angular.forEach(item[options.subSetName], function(subitem) {
            if (subitem[options.innerIdName] == options.innerIdValue) {
              if (recordIds.indexOf(item.id) == -1) {
                recordIds.push(item.id);
              }
            }
          });
        }
      });

      if (recordIds.length>0) {
        angular.forEach(recordIds, function(recordId) {
          self.deleteSingleRecord(storeName, recordId);
        });
      }
    });
  }

  cleanSelectedRecordsByCollectionForUser(storeName, entityIdOrArray, userId) {
    if (!storeName) {
      return;
    }
    let recordIds = [];
    let self = this;

    let filterFunc = function(entityIdOrArray, userId, strId) {
      let re;
      if (storeName == 'documents') {
        re = /^(\w+)_\d+_\d+\/(\d+)$/gmi;
        //hash ak
        //todo
        //$re = "/^(.+)_\\d+_\\d+$/mi"; //example: 4f8b8a53-8a6_11_20
      } else {
        re = /^([\/<all\/>|\w]+)\/(\d+)$/gmi;
      }
      let match = re.exec(strId);
      //console.log('match', match, entityIdOrArray, userId, strId);
      let condition;
      if (match && match.length) {
        condition = angular.isArray(entityIdOrArray) ? (entityIdOrArray.indexOf(match[1]) !== -1) : (match[1] == entityIdOrArray);
        if (condition && (match[2] == userId)) {
          return true;
        }
      }

      return false;
    };

    this.getAllRecords(storeName).then(function(topics) {
      if (topics.length) {
        topics.filter(function(item){
          if (filterFunc(entityIdOrArray, userId, item.id)) {
            recordIds.push(item.id);
          }
          return true;
        });
      }

      if (recordIds.length>0) {
        angular.forEach(recordIds, function(recordId) {
          self.deleteSingleRecord(storeName, recordId);
        });
      }
    });
  }

  updateSelectedRecords(storeName, options) {

    if (!storeName) {
      return;
    }
    let recordIds = [];
    let self = this;

    function applyRecordMod(subitem, data) {
      angular.forEach(data, function(dataItem, dataKey) {
        if (subitem[dataKey]) {
          subitem[dataKey] = data[dataKey];
        }
      });
      return subitem;
    }
    self.getAllRecords(storeName).then(function(topics) {
      angular.forEach(topics, function(item) {
        if (item[options.subSetName]) {
          angular.forEach(item[options.subSetName], function(subitem, subItemKey) {
            if (subitem[options.innerIdName] == options.innerIdValue) {
              if (recordIds.indexOf(item.id) == -1) {
                let record = item;
                record[options.subSetName][subItemKey] = applyRecordMod(subitem, options.data);
                self.upsertRecord(storeName, record);//??
                recordIds.push(item.id);
              }
            }
          });
        }
      });
    });
  }

  /*this.$indexedDB.openStore('people', function(store){
    store.getAllKeys().then(function(e){
      $scope.primaryKeys = e;
    });
  });*/



  getSingleRecordPromise(storeName, name, subKey) {
    if (!storeName || !name) {
      return;
    }

    let deferred = this.$q.defer();
    this.$indexedDB.openStore(storeName, function(store){
      store.find(name).then(function(response){

        let expireDate = response['expireDate'];
        let resolvedValue = (subKey && response[subKey]) ? response[subKey] : response;
        if (expireDate) {
          if (new Date().getTime() >= expireDate) {
            deferred.resolve(null);
          } else {
            deferred.resolve(resolvedValue);
          }
        } else {
          deferred.resolve(resolvedValue);
        }

        /*let resolvedValue = (subKey && response[subKey]) ? response[subKey] : response;
        if (resolvedValue['collections'] && resolvedValue['expireDate']) {
          //let currentDate = new Date().getTime();
          if (new Date().getTime() < resolvedValue['expireDate']) {
            if (resolvedValue['control']) {
              deferred.resolve(resolvedValue);
            } else {
              deferred.resolve(resolvedValue['collections']);
            }

          } else {
            deferred.resolve(null);
          }
        } else {
          deferred.resolve(resolvedValue);
        }*/

      }, function(response) {
        deferred.resolve(null);
      });
    });
    return deferred.promise;
  }

  upsertRecord(storeName, dataObject) {
    if (!storeName || !dataObject) {
      return;
    }

    let deferred = this.$q.defer();
    this.$indexedDB.openStore(storeName, function(store){
      store.upsert(dataObject).then(function (response) {
        deferred.resolve(response);
      });
    });
    return deferred.promise;
  }

  insertRecord(storeName, dataObject) {
    if (!storeName || !dataObject) {
      return;
    }

    let deferred = this.$q.defer();
    this.$indexedDB.openStore(storeName, function(store){
      store.insert(dataObject).then(function (response) {
        deferred.resolve(response);
      });
    });
    return deferred.promise;
  }

  clearStorage(storeName) {
    if (!storeName) {
      return;
    }
    let deferred = this.$q.defer();
    this.$indexedDB.openStore(storeName, function(store){
      store.clear().then(function(response) {
        deferred.resolve(response);
      });
    });
    return deferred.promise;
  }

  deleteSingleRecord(storeName, recordId) {
    if (!storeName || !recordId) {
      return;
    }
    let deferred = this.$q.defer();
    this.$indexedDB.openStore(storeName, function(store){
      store.delete(recordId).then(function(response){
        deferred.resolve(response);
      });
    });
    return deferred.promise;
  }
}
