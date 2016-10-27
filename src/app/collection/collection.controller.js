/**
 * Created by decipher on 18.2.16.
 */
export class CollectionController {
  constructor (collection, themeProvider, $window, $location, $timeout, $anchorScroll, ViewModeService, LocalAccessService, $scope, $rootScope, documentsService, $stateParams, $q, $mdDialog, $filter, UploadService, $state) {
    'ngInject';

    //themeProvider.setDefaultTheme('365violet');
    //$scope.isDirectState = ($state.current.name == 'home.collection');
    //$rootScope.globalState = $state.current.name;
    $rootScope.globalState = 'home.collection';
    $rootScope.currentCollectionId = $stateParams.collectionId;

    $scope.ak = $stateParams.accessKey;
    $scope.params = {};

    let acceptH = function (file, done, dropzone) {
      UploadService.dropzone = $scope.dzMethods.getDropzone();
      return UploadService.localAcceptHandler(file, done);
    };

    $scope.dzOptions = {
      url : '/',
      paramName : 'files',
      maxFilesize : '30',
      /*acceptedFiles : 'image/jpeg, images/jpg, image/png',*/
      addRemoveLinks : true,
      dictInvalidFileType: 'Invalid file',
      /* autoProcessQueue:false,*/
      accept: acceptH,
      dictDefaultMessage: '<span class="dz-drop-file"><strong>Drop file</strong> or click to upload</span>',
      previewTemplate: UploadService.template/*,
       dictDefaultMessage: '<img src="assets/images/dropzone.png" />'*/
    };

    $scope.documentsService = documentsService;
    $scope.viewModeService = ViewModeService;
    $scope.documentsService.searchFilter = '';

    if (collection.data && collection.data.collections) {
      this.docs = collection.data.collections;
      $scope.params.currentClass = $scope.parentClass;
      if (collection.data.collections.length) {
        $scope.params.currentClass = collection.data.collections[0].group.locale;
        documentsService.currentClass = collection.data.collections[0].group;
      }
    } else {
      //console.log(documentsService.akCollections);
      //ak
      this.docs = [];
      if (collection.data && collection.data.avail_filter) {
        this.docs = documentsService.filterToCollections(collection.data.avail_filter, $stateParams.collectionId);
        documentsService.akCollections = this.docs;
        $scope.params.currentClass = $scope.parentClass;
        if (this.docs.length) {
          $scope.params.currentClass = this.docs[0].group.locale;
          documentsService.currentClass = this.docs[0].group;
        }
      }
    }

    if (documentsService.currentClass) {
      if (!$rootScope.stateInfo) {
        $rootScope.stateInfo = {};
      }
      $rootScope.stateInfo.currentClass = documentsService.currentClass;
      $rootScope.stateInfo.currentCollection = {};
      documentsService.currentCollection = {};
    }

    this.$q = $q;
    let deferred = this.$q.defer();
    $scope.parentClass = $stateParams.collectionId;
    $scope.editAvailable = !{'Type': true, 'WORKFLOW': true, 'Monat': true, 'NEW': true, '' : false}[$scope.parentClass];
    $scope.useEditPartner = {'CUSTOMER': true, 'LEAD': true, 'VENDOR': true, '' : false}[$scope.parentClass];
    let self = this;

    $scope.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    $scope.applySearchFilter = function() {
      self.filteredDocs = $filter('filter')(self.docs, $scope.searchService.searchCriteria(documentsService.searchFilter, !$scope.viewModeService.showEmptyCollections));
    };

    $scope.$watch('documentsService.searchFilter', function (newValue, oldValue) {
      //$scope.searchField = newValue;

      /*if (newValue == '') {
        $scope.filteredDocs = null;
      }
      if (newValue === oldValue) {
        return;
      }*/
      $scope.applySearchFilter();
    });

    $scope.emptyCollectionFilter = function () {
      return function(item) {
        if ($scope.viewModeService.showEmptyCollections) {
          return true;
        } else {
          return item.count > 0;
        }
      }
    };

    $scope.$watch('viewModeService.showEmptyCollections', function (newValue, oldValue) {
      if (newValue != oldValue) {
        $scope.applySearchFilter();
      }
      //self.filteredDocs = $filter('filter')(self.docs, $scope.emptyCollectionFilter());
    });

    //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
    $scope.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));

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
        hasBackdrop: false,
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

    $scope.editPartner = function (event, collectionId, cardGroup, skipChangeState) {

      let key = null;
      if ($stateParams.accessKey) {
        key = $stateParams.accessKey;
        //return;
      }

      let parentScope = $scope;
      $scope.cardGroup = cardGroup;

      $mdDialog.show({
        controller: 'PartnerController' ,
        templateUrl: 'app/partner/partner.html',
        preserveScope: true,
        parent: angular.element(document.body),
        targetEvent: event,
        disableParentScroll: true,
        clickOutsideToClose:true,
        escapeToClose: false,
        /*fullscreen: true,*/
        locals: {
          thatScope: parentScope,
          collectionId: collectionId,
          group: $scope.cardGroup,
          key: key
        },
        hasBackdrop: true,
        /*scope: $scope,*/
        onRemoving: function(element, promise) {
          //console.log('removing', $mdDialog);
          $scope.mdClosing = true;
          //promise.resolve($mdDialog.hide());
          thatScope.mdClosing = true;
        },
        transformTemplate: function(template) {
          return '<div class="md-dialog-container edit-doc">' + template + '</div>';
        }
      })
        .then(function() {

        }, function() {
          /*$scope.returnPath();*/
        });

      event.stopPropagation();
      event.preventDefault();

    };

    $scope.$on('$destroy', function() {
      $scope.addListener();
      $scope.customerStateChangedListener();
    });

  }
}
