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

  getCKey() {
    return 'xC3r6y5ptK';//todo
  }

  encryptCredentials(UserInfo) {
    return CryptoJS.AES.encrypt(JSON.stringify(UserInfo), this.getCKey()).toString();
  }

  decryptCredentials(credentials) {
    let decrypted = CryptoJS.AES.decrypt(credentials, this.getCKey()).toString(CryptoJS.enc.Latin1);
    return JSON.parse(decrypted);
  }

  getCredentails() {
    return this.storageService.getSingleRecordPromise('user','info', 'data')
  }

  setCredentails(UserInfo) {
    var encrypted = this.encryptCredentials(UserInfo);
    this.storageService.upsertRecord('user',{"user_key": "info", "data": encrypted});
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
