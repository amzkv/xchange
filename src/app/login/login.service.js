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

  registerUser(registerUserInfo) {
    var defer = this.$q.defer();
    var dataInfo =
    {
      "account": {
        "method": "register",
        "name": registerUserInfo.companyName,
        "firstname": registerUserInfo.firstName,
        "lastname": registerUserInfo.lastName,
        "email": registerUserInfo.eMailName,
        "password": registerUserInfo.passWord,
        "channelcode": "7b3112b0"
      }
    };
    dataInfo = JSON.stringify(dataInfo);
    return this.$http.post(this.ConfigService.accountServiceURL(), dataInfo)
      .success(function (data) {
        defer.resolve(data);
      }).error(function (data) {
      defer.reject(data);
    });
    return defer.promise;
  }
  registerInformation(confirmationCode) {
    var defer = this.$q.defer();
    var dataInfo =
    {
      "account": {
        "method": "register info",
        "confirmcode": confirmationCode
      }
    };
    dataInfo = JSON.stringify(dataInfo);
    this.$http.post(this.ConfigService.accountServiceURL(), dataInfo)
      .success(function (data) {
        defer.resolve(data);
      }).error(function (data) {
      defer.reject(data);
    });
    return defer.promise;
  }

  confirm(confirmObject) {
    var defer = this.$q.defer();
    var dataInfo =
    {
      "account": {
        "method": "confirm",
        "email": confirmObject.eMailName,
        "confirmcode": confirmObject.confirmCode,
      }
    };
    dataInfo = JSON.stringify(dataInfo);
    this.$http.post(this.ConfigService.accountServiceURL(), dataInfo)
      .success(function (data) {
        defer.resolve(data);
      }).error(function (data) {
      defer.reject(data);
    });
    return defer.promise;
  }

}
