/**
 * Created by decipher on 19.5.16.
 */
export class RegisterController {
  constructor ($state, LoginService, LocalAccessService, CheckAuthService, $scope, toastr, $filter) {
    'ngInject';

    $scope.submitToServer = function () {
      if (this.registration.registrationForm.$valid) {
        //console.log('validate');
        if (this.registration.person.iagreewith) {
          registerUser(this.registration);
        } else {
          let error = $filter('i18n')('error.5010');
          toastr.error(error, 'Error');
        }
      } else {
        //console.log('invalid');
        let error = $filter('i18n')('error.5004');
        toastr.error(error, 'Error');
      }
    };

    function registerUser(data) {
      LoginService.registerUser(data.person).then(function (response) {
        if (response.data.response.errorcode == "200") {
          toastr.success('Thank You! Please, check your e-mail!', 'Success');
          $state.go('confirm');//TODO
        } else {
          toastr.error(response.data.response.errormessage, 'Error');//TODO
        }
      });
    }
  }
}
