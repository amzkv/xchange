/**
 * Created by decipher on 18.2.16.
 */
export class CollectionController {
  constructor (collection, themeProvider, ViewModeService, LocalAccessService, $scope, $rootScope, documentsService, $stateParams, $q, $mdDialog) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    $scope.documentsService = documentsService;
    $scope.documentsService.searchFilter = '';

    this.docs = collection.data.collections;
    this.$q = $q;
    let deferred = this.$q.defer();
    $scope.parentClass = $stateParams.collectionId;
    let self = this;

    $scope.params = {};
    $scope.params.currentClass = collection.data.collections.length ? collection.data.collections[0].group.locale : $scope.parentClass;

    $scope.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
    $scope.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));

    $scope.emptyCollectionFilter = function (collection) {
      if (ViewModeService.showEmptyCollections) {
        return true;
      } else {
        return collection.count > 0;
      }
    };

    $scope.editTitle = function(event) {
      event.stopPropagation();
      event.preventDefault();
    };

    self.editDialog = function($event, item) {
      // Show the dialog
      $mdDialog.show({
        clickOutsideToClose: true,
        controller: function($mdDialog) {
          // Save the clicked item
          //this.item = item;
          // Setup some handlers
          //console.log(item);

          if (!item || !item.title) {
            return;
          }

          this.close = function() {
            $mdDialog.cancel();
          };
          //draft
          this.errorMessages = {
            '5001' : 'Collection already exists',
            '5002' : 'Cannot add collection to given class'
          };

          this.errors = [];

          let dialog = this;
          dialog.value = item.title.value;
          dialog.locale = item.title.locale;

          this.submit = function() {
            this.errors = [];
            this.formErrors = [];
            if (dialog.editForm.$valid) {

              //let res = $rootScope.$emit("CallEditMethod", {'form': this.addForm, item: item});
              dialog.editForm.resultPromise = $scope.editCollection({'form': dialog.editForm, item: item});
              if (dialog.editForm.resultPromise) {
                dialog.editForm.resultPromise.then(function(dResp) {
                  if (dialog.editForm.customErrors && dialog.editForm.customErrors.length > 0) {
                    let errorMessages = dialog.errorMessages;
                    angular.forEach(dialog.editForm.customErrors, function (item, key) {
                      dialog.errors.push(errorMessages[item['errorCode']]);
                      dialog.formErrors['customError'] = errorMessages[item['errorCode']];
                    });
                  } else {
                    $mdDialog.hide();
                  }
                });
              }

            } else {
              //invalid
            }
          };
        },
        controllerAs: 'dialog',
        templateUrl: 'app/collection/editDialog.html',
        targetEvent: $event
      });

      $event.stopPropagation();
      $event.preventDefault();

    };

    $scope.customerStateChangedListener = $rootScope.$on('customerStateChanged', function (event, data) {
      $scope.toggleMode = {
        thisState: data.thisState,
        alterState:  data.alterState
      };
      //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
      $scope.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));
    });

    $scope.addListener = $rootScope.$on("CallAddMethod", function(scope, formData){
      $scope.addItem(scope, formData);
    });

    $scope.checkNewItem = function(value) {
      //self.docs.each
      let unique = true;
      angular.forEach(self.docs, function (item, key) {
        if (item.title.value == value) {
          unique = false;
          return;
        }
      });
      return unique;
    };

    $scope.addItem = function(scope, formData) {

      if (formData) {
        formData.resultPromise = true;
        formData.customErrors = [];
        //console.log(formData.value.$modelValue);
        let value = formData.value.$modelValue;
        /*let localeDE = formData.locale_DE.$modelValue;
        let localeEN = formData.locale_EN.$modelValue;*/

        formData.resultPromise = deferred.promise;

        let dataId = $stateParams.collectionId;
        //return;
        formData.resultPromise = documentsService.callDocumentRelated(dataId, true);
        formData.resultPromise.then(function (updatedResponse) {
          //get
          if (updatedResponse) {
            self.docs = updatedResponse.data.collections;
            let isUnique = $scope.checkNewItem(value);
            if (isUnique) {
              let excludedCollections = ['Monat', 'NEW'];//TODO
              if (excludedCollections.indexOf($scope.parentClass) == -1) {
                let item = {
                  'value': value/*,
                  'locale_DE': localeDE,
                  'locale_EN': localeEN*/
                };
                documentsService.callAddCollectionItem(dataId, item).then(function(addResponse) {
                  //add
                  if (addResponse) {
                    documentsService.callDocumentRelated(dataId, true).then(function (getResponse) {
                      //get
                      if (getResponse) {
                        self.docs = getResponse.data.collections;
                        deferred.resolve(addResponse);
                      }
                    });
                  }
                });
              } else {
                formData.customErrors.push(
                  {'errorCode': '5002',
                    'location': 'value',
                    'value': value
                  }
                );
                deferred.resolve(null);
              }

            } else {
              //draft
              formData.customErrors.push(
                {'errorCode': '5001',
                  'location': 'value',
                  'value': value
                }
              );
              deferred.resolve(null);
            }
          }
        });

        //return true;
      }
      return deferred.promise;
    };

    $scope.editCollection = function(data) {

      deferred = self.$q.defer();

      let formData = data.form;
      let itemData = data.item;

      /*if (dialog.addForm.resultPromise) {
        dialog.addForm.resultPromise.then(function (dResp) {
          if (dialog.addForm.customErrors && dialog.addForm.customErrors.length > 0) {
            let errorMessages = dialog.errorMessages;
            angular.forEach(dialog.addForm.customErrors, function (item, key) {
              dialog.errors.push(errorMessages[item['errorCode']]);
              dialog.formErrors['customError'] = errorMessages[item['errorCode']];
            });

          } else {
            $mdDialog.hide();
          }
        });
      }*/

      if (formData) {
        formData.resultPromise = true;
        formData.customErrors = [];
        //console.log(formData.value.$modelValue);
        let value = formData.value.$modelValue;
        let locale = formData.locale.$modelValue;
        //let localeEN = formData.locale_EN.$modelValue;

        formData.resultPromise = deferred.promise;

        let dataId = $stateParams.collectionId;
        //return;
        formData.resultPromise = documentsService.callDocumentRelated(dataId, true);
        formData.resultPromise.then(function (updatedResponse) {
          //get
          if (updatedResponse) {
            self.docs = updatedResponse.data.collections;
            let isUnique = $scope.checkNewItem(value);
            if (isUnique) {
              let excludedCollections = ['Monat', 'Type', 'NEW', 'WORKFLOW'];//TODO
              if (excludedCollections.indexOf($scope.parentClass) == -1) {
                let item = {
                  'value': value,
                  'locale': locale
                };
                //itemData = old item
                documentsService.callEditCollectionItem(dataId, item, itemData).then(function(editResponse) {
                  //edit
                  if (editResponse) {
                    documentsService.callDocumentRelated(dataId, true).then(function (getResponse) {
                      //get
                      if (getResponse) {
                        self.docs = getResponse.data.collections;
                        deferred.resolve(editResponse);
                      }
                    });
                  }
                });
              } else {
                //move to service
                formData.customErrors.push(
                  {'errorCode': '5002',
                    'location': 'value',
                    'value': value
                  }
                );
                deferred.resolve(null);
              }

            } else {
              //draft
              //move to service
              formData.customErrors.push(
                {'errorCode': '5001',
                  'location': 'value',
                  'value': value
                }
              );
              deferred.resolve(null);
            }
          }
        });

        //return true;
      }
      return deferred.promise;

    };

    $scope.$on('$destroy', function() {
      $scope.addListener();
      $scope.customerStateChangedListener();
    });

  }
}
