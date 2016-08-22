/**
 * Created by decipher on 22.4.16.
 */
export class LoginController {
  constructor ($state, LoginService, LocalAccessService, CheckAuthService, StorageService, $scope, toastr, $rootScope, $location, $filter) {
    'ngInject';
    this.onClickForRegistration = function () {
      $state.go('register');
    };

    /*this.onClickForForgetPassword = function () {
      $state.go('forgetPassword');
    };*/

    this.onLogin = function () {
      if (this.loginForm.$valid) {
        validateUserData();
      } else {
        //$scope.showErrorToast("Data is not valid");
      }
    };

    let self = this;

    function validateUserData() {
      LoginService.authenticateUser(self.userInfo).then(function (response) {
        //$log.log(response);
        if (response.data.response.errorcode == "200") {
          StorageService.clearStorage('user');
          LocalAccessService.accessKeyUser = null;
          LocalAccessService.setCredentails(self.userInfo);
          toastr.success($filter('i18n')('user.loggedIn'), 'Success');
          CheckAuthService.setUser(response.data.user);
          //todo??
          if ($rootScope.infinicast) {
            $rootScope.infinicast.setUser(response.data.user);
            $rootScope.infinicast.listen();
          }
          if ($rootScope.previousPage && !$rootScope.loggedOut && $rootScope.previousPage!='/login' && $rootScope.previousPage!='/register' && $rootScope.previousPage.indexOf('/ak/') == -1) {
            $location.path($rootScope.previousPage);
          } else {
            $state.go('home');
          }
        } else {
          let error = $filter('i18n')('error.5009');
          toastr.error(error);
          //$scope.login.loginForm.passWord.$error.server = response.data.response.errormessage;
          $scope.login.loginForm.passWord.$error.server = error;

          //$scope.login.loginForm.serviceErrorMessage = error;
          $scope.login.loginForm.serviceErrorMessage = response.data.response.errormessage;
          $scope.login.loginForm.serviceErrorCode = response.data.response.errorcode;
        }
      });
    }


  }
}
