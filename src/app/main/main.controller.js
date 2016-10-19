export class MainController {
  constructor(categories, themeProvider, $scope, $rootScope, ViewModeService, documentsService, LocalAccessService, $q, $filter, UploadService, $state, $stateParams) {
    'ngInject';

    //themeProvider.setDefaultTheme('365violet');
    //$rootScope.globalState = $state.current.name;
    $rootScope.globalState = 'home';

    $scope.documentsService = documentsService;

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
      previewTemplate: UploadService.template,
      dictCancelUpload: 'Cancel upload',
      dictRemoveFile: 'Remove file'
    };

    $scope.dzMethods = {};
    $scope.removeNewFile = function(){
      $scope.dzMethods.removeFile($scope.newFile); //We got $scope.newFile from 'addedfile' event callback
    };

    $scope.resetDropzone = function() {
      $scope.dzMethods.removeAllFiles();
    };

    $scope.documentsService.searchFilter = '';

    this.docs = categories.data.collections;
    this.$q = $q;
    let deferred = this.$q.defer();
    let self = this;

    $scope.creatableClasses = [
      {
        value : 'CUSTOMER',
        locale: 'Kunden'
      },
      {
        value : 'LEAD',
        locale: 'Lead'
      },
      {
        value : 'VENDOR',
        locale: 'Lieferanten'
      },
      {
        value : 'PROJECT',
        locale: 'Projekt'
      }
    ];


    this.filterClasses = function(classesToAdd, currentClasses) {

      /*function filterFn(item, value) {
        return (item.indexOf(value) !== -1);
      }*/
      currentClasses = currentClasses || self.docs;

      let newClasses = [];
      angular.forEach(classesToAdd, function (item) {
        let found = false;
        angular.forEach(currentClasses, function (citem) {
          if (citem.group.value == item.value) {
            found = true;
          }
        });
        if (!found) {
          newClasses.push(item);
        }
      });
      return newClasses;
    };

    $scope.applySearchFilter = function() {
      self.filteredDocs = $filter('filter')(self.docs, $scope.searchService.searchCriteria(documentsService.searchFilter));
    };

    $scope.$watch('documentsService.searchFilter', function (newValue, oldValue) {
      //$scope.searchField = newValue;
      if (newValue == '') {
        $scope.filteredDocs = null;
      }
      if (newValue === oldValue) {
        return;
      }
      $scope.applySearchFilter();

    });

    $scope.fbParams = {};
    $scope.fbParams.creatableClasses = this.filterClasses($scope.creatableClasses);



    $scope.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
    $scope.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));

    $scope.customerStateChangedListener = $rootScope.$on('customerStateChanged', function (event, data) {
      $scope.toggleMode = {
        thisState: data.thisState,
        alterState:  data.alterState
      };
      //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
      $scope.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));
    });

    /*$scope.globalStateChangedListener = $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
      //console.log(event, toState, toParams, fromState, fromParams, options);
      $rootScope.globalState = toState.name;//???
      //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
    });*/

    $scope.addListener = $rootScope.$on("CallAddMethod", function(scope, formData){
      $scope.addItem(scope, formData);
    });

    $scope.checkNewCoreItem = function(value) {
      //self.docs.each
      let unique = true;
      angular.forEach(self.docs, function (item, key) {
        if (item.group.value == value) {
          unique = false;
          return;
        }
      });
      return unique;
    };

    $scope.addItem = function(scope, formData) {
      let deferred = self.$q.defer();
      if (formData) {
        //formData.resultPromise = null;
        formData.customErrors = [];
        let value = formData.value;
        /*let localeDE = formData.locale_DE.$modelValue;
        let localeEN = formData.locale_EN.$modelValue;*/
        formData.resultPromise = deferred.promise;

        documentsService.callDocumentsCore(true).then(function (updatedResponse) {
          //get
          if (updatedResponse) {
            self.docs = updatedResponse.data.collections;
            let isUnique = $scope.checkNewCoreItem(value);
            //console.log(isUnique);
            if (isUnique) {
              /*let coreItem = {
                'value': value,
                'locale_DE': localeDE,
                'locale_EN': localeEN
              };*/

              let coreItem = {
                'value': value
              };

              formData.resultPromise = documentsService.callAddCoreItem(coreItem);
              formData.resultPromise.then(function(addResponse) {
                //add
                if (addResponse) {
                  documentsService.callDocumentsCore(true).then(function (getResponse) {
                    //get
                    if (getResponse) {
                      self.docs = getResponse.data.collections;
                      deferred.resolve(addResponse);
                    }
                  });
                }
              });
            } else {
              //draft
              //console.log();
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
      //$scope.globalStateChangedListener();
    });

  }
}
