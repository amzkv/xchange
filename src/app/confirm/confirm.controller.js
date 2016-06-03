export class ConfirmController {
  constructor ($state, LoginService, LocalAccessService, CheckAuthService, $scope, toastr) {
    'ngInject';

    $scope.submitToServer = function () {
      if (this.registration.confirmForm.$valid) {
        //console.log('validate');
        confirmUserRegistration(this.registration);
      } else {
        //console.log('invalid');
        toastr.error('Invalid data submitted', 'Error');//TODO
      }
    };

    function confirmUserRegistration(confirmation) {
      //console.log(confirmation);
      //return;
      LoginService.registerInformation(confirmation.confirmCode).then(function (response) {
        if (response.response.errorcode == "200") {
          confirmation.eMailName = response.data.response.eMailName//??? TODO
          confirm(confirmation);
        } else {
          toastr.error(response.response.errormessage, 'Error');//TODO
        }
      });
    }

    function confirm(confirmation) {
      LoginService.confirm(confirmation).then(function (resp) {
        if (resp.response.errorcode == "200") {
          //TODO
          toastr.success('Thank You! Your account has been confirmed! You can log in now.', 'Success');
          $state.go('login');
        } else {
          toastr.error(resp.response.errormessage, 'Error');//TODO
        }
      });
    }
  }
}
