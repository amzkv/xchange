/**
 * Created by decipher on 22.4.16.
 */
export class LoginController {
  constructor ($state, LoginService, LocalAccessService, CheckAuthService, $scope, toastr, $rootScope, $location, $filter) {
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
          LocalAccessService.setCredentails(self.userInfo);
          toastr.success('Logged in successfully', 'Success');
          CheckAuthService.setUser(response.data.user);

          if ($rootScope.previousPage && !$rootScope.loggedOut && $rootScope.previousPage!='/login' && $rootScope.previousPage!='/register') {
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
