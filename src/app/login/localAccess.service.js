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

  getPartnerIds() {
    let ids = [];
    //console.log('partners',this.accessKeyUser);
    if (this.accessKeyUser && this.accessKeyUser.partners) {
      //console.log(this.accessKeyUser.partners);

      angular.forEach(this.accessKeyUser.partners, function (partner) {
        if (partner.uuid) {
          ids.push(partner.uuid);
        }
      });
    }

    //TODO: remove this
    //ids = ['a0dd085d-a8a1-4380-9085-fadf969ff384'];//for test only

    return ids;
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


/*
    this.storageService.clearStorage('core');
    this.storageService.clearStorage('collections');
    this.storageService.clearStorage('documents');
    this.storageService.clearStorage('document_detail');
*/

    //this.$window.localStorage.clear();
  }

  setAccessKeyUserData(ak) {
    //console.log('set ak', ak);
    var encrypted = this.encryptCredentials(ak);
    this.storageService.upsertRecord('user',{"user_key": "accesskey", "data": encrypted});
  }

  getAccessKeyUserDataEncodedPromise() {
    //console.log('set ak', ak);
    return this.storageService.getSingleRecordPromise('user','accesskey', 'data')
  }

  clearLocalData () {
    //localStorage
    this.$window.localStorage.clear();

    //indexedDB
    this.storageService.clearStorage('user');
    this.storageService.clearStorage('core');
    this.storageService.clearStorage('collections');
    this.storageService.clearStorage('documents');
    this.storageService.clearStorage('document_detail');
    this.storageService.clearStorage('document_detail');
  }

  setViewSettings(settings) {
    this.$window.localStorage.setItem('viewSetting', settings);
  }

  getViewSettings() {
    return this.$window.localStorage.getItem('viewSetting');
  }

  setUserSetting(name, value, setOnly) {
    try {
      let userSettings = JSON.parse(this.$window.localStorage.getItem('settings')) || {};
      if (setOnly && userSettings[name]) {
        return false;
      }
      userSettings[name] = value;
      let settings = JSON.stringify(userSettings);
      this.$window.localStorage.setItem('settings', settings);
      return true;

    } catch (e) {
      console.log('failed to save settings: ', e);
      return false;
    }
  }

  getUserSetting(name) {
    try {
      let userSettings = JSON.parse(this.$window.localStorage.getItem('settings')) || {};
      if (userSettings[name]) {
        return userSettings[name];
      }
    } catch (e) {
      //console.log('failed to get settings');
    }
  }


}
