/**
 * Created by decipher on 22.4.16.
 */
export class CheckAuthService {
  constructor($http, $log, $window) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
  }

  checkAuth(){
    "use strict";
  }

  setUser(user){
    "use strict";
    return this.$window.localStorage.setItem('user', user);
  }

  getUser(){
    "use strict";
    let user = this.$window.localStorage.getItem('user');
    return JSON.parse(user);
  }

}
