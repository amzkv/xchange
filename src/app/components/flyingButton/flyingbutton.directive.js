export function FlyingButtonDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/flyingButton/flyingbutton.html',
    scope: {
      creationDate: '=',
      template: '=template',
      params: '='
    },
    controller: FlyingButtonController,
    controllerAs: 'flyB',
    bindToController: true,
    link: function ($scope, $element, $attrs) {
      //?
      $scope.addDialogTemplate = 'app/' + $attrs.scope + '/' + $attrs.template + '.html';
      $scope.params = $attrs.params;
    }
  };

  return directive;
}

class FlyingButtonController {
  constructor ($rootScope, $scope, $state, $mdDialog, ConfigService, LocalAccessService, documentsService, ViewModeService) {
    'ngInject';
    let self = this;
    self.hidden = false;
    self.isOpen = false;
    self.hover = false;

    //console.log($scope);

    self.openDialog = function($event, item) {
      // Show the dialog
      $mdDialog.show({
        clickOutsideToClose: true,
        controller: function($mdDialog, $scope, $timeout, $filter) {
          // Save the clicked item
          //this.item = item;
          // Setup some handlers
          //console.log('dialog');

          this.close = function() {
            $mdDialog.cancel();
          };
          //draft
          //console.log(this, self);

          this.params = self.params;

          this.errorMessages = {};
          this.errorMessages['5001'] = $filter('i18n')('error.5001');
          this.errorMessages['5002'] = $filter('i18n')('error.5002');

          this.errors = [];

          let dialog = this;

          this.delayedSubmit = function() {
            $timeout(function() {
              //angular.element(this.addForm).triggerHandler('submit');
              dialog.submit();
            }, 100);
          };

          this.submit = function() {
            documentsService.busy = false;
            this.errors = [];
            this.formErrors = [];
            if (this.addForm.$valid) {
              //console.log('add');

              //$scope.addmethod = function() {
                let addres = $rootScope.$emit("CallAddMethod", this.addForm);
                //console.log('add res:', this.addForm);
                if (dialog.addForm.resultPromise) {
                  dialog.addForm.resultPromise.then(function(dResp) {
                    if (dialog.addForm.customErrors && dialog.addForm.customErrors.length > 0) {
                      let errorMessages = dialog.errorMessages;
                      angular.forEach(dialog.addForm.customErrors, function (item, key) {
                        //console.log(errorMessages);
                        //console.log(errorMessages[item['errorCode']],':::');

                        dialog.errors.push(errorMessages[item['errorCode']]);
                        dialog.formErrors['customError'] = errorMessages[item['errorCode']];
                      });

                      //dialog.addForm.value.$setValidity('customError',false);

                    } else {
                      $mdDialog.hide();
                    }
                  });
                  //console.log('res p');
                }
              //}
            }
          };
        },
        controllerAs: 'dialog',
        templateUrl: $scope.addDialogTemplate,
        hasBackdrop: false,
        targetEvent: $event
      });
    }
  }
}
