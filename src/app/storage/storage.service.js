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
