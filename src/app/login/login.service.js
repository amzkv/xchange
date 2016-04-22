/**
 * Created by decipher on 22.4.16.
 */
export class LoginService {
  constructor($http, $log, $q, ConfigService) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$q = $q;
    this.ConfigService = ConfigService;
  }

  getLoginModel() {
    //return {
    //    userId: 'mm@365my.biz',
    //    passWord: 'mm2014'
    //}
    return {
      userId: '',
      passWord: ''
    }
  }

  getRegistrationModel() {
    return {
      firstName: '',
      lastName: '',
      companyName: '',
      eMailName: '',
      passWord: '',
      confirmPassWord: '',
      iagreewith: false,
    };
  }

;
  getForgetPasswordModel() {
    return {
      email: ''
    };
  }

  authenticateUser(userInfo) {
    let defer = this.$q.defer();
    let dataInfo =
    {
      "auth": {
        "user": {"username": userInfo.userId, "password": userInfo.passWord}
      },
      "user": {
        "method": "by id"
      }
    };
    dataInfo = JSON.stringify(dataInfo);
    return this.$http.post(this.ConfigService.userServiceURL(), dataInfo)
      .success(function (data) {
        defer.resolve(data);
      }).error(function (data) {
        defer.reject(data);
      });
    return defer.promise;
  }


}