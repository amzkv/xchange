/**
 * Created by decipher on 22.4.16.
 */
export class LoginController {
  constructor ($state, LoginService, $log, LocalAccessService, CheckAuthService) {
    'ngInject';
    this.onClickForRegistration = function () {
      $state.go('registration');
    };

    this.onClickForForgetPassword = function () {
      $state.go('forgetPassword');
    };

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
        $log.log(response);
        if (response.data.response.errorcode == "200") {
          LocalAccessService.setCredentails(self.userInfo);
          //$scope.showSuccessToast($translate.instant('LOGIN_SUCCESSFULLY'));
          CheckAuthService.setUser(response.data.user);
          $state.go('home');
        } else {
         // $scope.showErrorToast(data.response.errormessage);
        }
      });
    }


  }
}