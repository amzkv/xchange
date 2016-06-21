/**
 * Created by decipher on 22.4.16.
 */
export class LocalAccessService {
  constructor($http, $log, $window, $q, $indexedDB, StorageService) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.$indexedDB = $indexedDB;
    this.storageService = StorageService;
    this.$q = $q;
  }

  checkCredentails() {
    if (localStorage.getItem('userinfo') == null) {
      return false;
    } else {
      return true;
    }
  }

  getCredentails() {
    //var decrypted = CryptoJS.AES.decrypt(localStorage.getItem('userinfo'), "temp").toString(CryptoJS.enc.Latin1);
    //return JSON.parse(decrypted);

    /*let credentials = this.$window.localStorage.getItem('userinfo');
    return JSON.parse(credentials);*/

    /*let deferred = this.$q.defer();

    this.$indexedDB.openStore('user', function(user){
      user.find('info').then(function(e){
        //$scope.user = e['user'];
        //return e['data'];
        deferred.resolve(e['data']);
      });
    });

    return deferred.promise;*/
    return this.storageService.getSingleRecordPromise('user','info', 'data')

  }

  setCredentails(UserInfo) {
    //var encrypted = CryptoJS.AES.encrypt(JSON.stringify(UserInfo), "temp").toString();

    /*
    var encrypted = JSON.stringify(UserInfo);
    this.$window.localStorage.setItem('userinfo', encrypted);
    */

    var encrypted = UserInfo;
    /*this.$indexedDB.openStore('user', function(store){
      store.upsert({"user_id": "info", "data": UserInfo}).then(function (e) {

      });
    });*/
    this.storageService.upsertRecord('user',{"user_key": "info", "data": UserInfo});
  }

  removeCredentails () {
    this.$window.localStorage.removeItem('userinfo');//todo: revise
    this.$window.localStorage.removeItem('user');//todo: revise

    /*this.$indexedDB.openStore('user', function(store){
      store.clear().then(function(){});
    });*/
    this.storageService.clearStorage('user');
    //

    this.storageService.clearStorage('core');
    this.storageService.clearStorage('collections');
    this.storageService.clearStorage('documents');
    this.storageService.clearStorage('document_detail');

    //this.$window.localStorage.clear();
  }

  setViewSettings(settings) {
    this.$window.localStorage.setItem('viewSetting', settings);
  }

  getViewSettings() {
    return this.$window.localStorage.getItem('viewSetting');
  }


}
