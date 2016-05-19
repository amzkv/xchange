/**
 * Created by decipher on 22.4.16.
 */
export class LoginController {
  constructor ($state, LoginService, LocalAccessService, CheckAuthService, $scope, toastr) {
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
          $state.go('home');
        } else {
          toastr.error('email or password is wrong / eMail oder Passswort ist falsch', 'Error');
          $scope.login.loginForm.passWord.$error.server = response.data.response.errormessage;

          $scope.login.loginForm.serviceErrorMessage = response.data.response.errormessage;
          $scope.login.loginForm.serviceErrorCode = response.data.response.errorcode;
        }
      });
    }


  }
}
