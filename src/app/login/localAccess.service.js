/**
 * Created by decipher on 22.4.16.
 */
export class LocalAccessService {
  constructor($http, $log, $window) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
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
    return this.$window.localStorage.getItem('userinfo');
  }

  setCredentails(UserInfo) {
    //var encrypted = CryptoJS.AES.encrypt(JSON.stringify(UserInfo), "temp").toString();
    var encrypted = JSON.stringify(UserInfo);
    this.$window.localStorage.setItem('userinfo', encrypted);
  }

  removeCredentails () {
    this.$window.localStorage.removeItem('userinfo');
  }

  setViewSettings(settings) {
    this.$window.localStorage.setItem('viewSetting', settings);
  }

  getViewSettings() {
    return this.$window.localStorage.getItem('viewSetting');
  }


}
