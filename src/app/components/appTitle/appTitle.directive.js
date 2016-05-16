/**
 * Created by decipher on 13.5.16.
 */
export function AppTitle () {
  'ngInject';

  let directive = {
    require: 'ngModel',
    restrict: 'AE',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };

  return directive;
}
