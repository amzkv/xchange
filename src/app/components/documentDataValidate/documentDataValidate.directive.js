export function DocumentDataValidate() {
  'ngInject';
  let directive = {
    restrict: "A",
    require: "ngModel",
    replace: false,
    link: function(scope, element, attributes, ngModel) {

      let validationType = attributes.documentDataValidate;

      ngModel.$validators.documentDataValidate = function(modelValue) {

        //prevent empty check
        //console.log(modelValue);
        if (!ngModel.$dirty) {
          return true;
        }

        if (validationType) {
          switch (validationType) {
            case 'documentTitle':
              let isValid = modelValue && modelValue.length > 0 && modelValue.length < 256;
              return !!isValid;
            case 'documentDate':
                  let date = new Date(modelValue);
                  return modelValue!=null && !isNaN(Date.parse(date));
            case 'documentAmount':
              let amount = (+modelValue).toFixed(2);
              //console.log(modelValue, modelValue!='', !isNaN(+modelValue), angular.isNumber(+modelValue));
              return modelValue!=='' && !isNaN(+modelValue) && angular.isNumber(+modelValue);
            default:
                  return true;
          }
        }
        return true;
      };

      /*scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });*/
    }
  };
  return directive;
}
