export class MainController {
  constructor(categories, themeProvider, $scope, $rootScope, ViewModeService, documentsService, LocalAccessService, $q) {
    'ngInject';

    //themeProvider.setDefaultTheme('365violet');

    $scope.documentsService = documentsService;

    this.docs = categories.data.collections;
    this.$q = $q;
    let deferred = this.$q.defer();
    let self = this;

    $scope.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
    $scope.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));

    $rootScope.$on('customerStateChanged', function (event, data) {
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
        //console.log(formData.value.$modelValue);
        let value = formData.value.$modelValue;
        let localeDE = formData.locale_DE.$modelValue;
        let localeEN = formData.locale_EN.$modelValue;
        formData.resultPromise = deferred.promise;

        documentsService.callDocumentsCore(true).then(function (updatedResponse) {
          //get
          if (updatedResponse) {
            self.docs = updatedResponse.data.collections;
            let isUnique = $scope.checkNewCoreItem(value);
            //console.log(isUnique);
            if (isUnique) {
              let coreItem = {
                'value': value,
                'locale_DE': localeDE,
                'locale_EN': localeEN
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
    });

  }
}
