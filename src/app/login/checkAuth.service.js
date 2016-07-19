/**
 * Created by decipher on 22.4.16.
 */
export class CheckAuthService {
  constructor($http, $log, $window, $indexedDB, $q, StorageService, LocalAccessService, $cookies) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.$indexedDB = $indexedDB;
    this.$q = $q;
    this.storageService = StorageService;
    this.localAccess = LocalAccessService;
    this.cookies = $cookies;
  }

  checkAuth(){
    "use strict";
    /*if (this.$window.localStorage.getItem("userinfo") === null) {
     return false;
     } else {
     return true;
     }*/

    return this.storageService.getSingleRecordPromise('user','info', 'data')

  }

  setUser(user){
    "use strict";
    this.userid = user.userid;
    if (user.locale) {
      this.localAccess.setUserSetting('locale', user.locale.value);
      let lang = JSON.stringify(user.locale.value);
      this.cookies.put('COOKIE_LOCALE_LANG', lang);
    }
    return this.storageService.upsertRecord('user',{"user_key": "user", "user": user});

    /*this.$indexedDB.openStore('user', function(store){
      store.delete(user.accountid).then(function(){

      });
    });*/

    //return this.$window.localStorage.setItem('user', user);
  }

  getUser(){
    "use strict";
    let deferred = this.$q.defer();

    this.$indexedDB.openStore('user', function(user){
      user.find('user').then(function(e){
        //return e['user'];
        deferred.resolve(e['user']);
      });
    });

    return deferred.promise;
    /*let user = this.$window.localStorage.getItem('user');
    return JSON.parse(user);*/

  }

}
