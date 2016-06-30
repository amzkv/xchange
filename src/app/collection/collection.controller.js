/**
 * Created by decipher on 18.2.16.
 */
export class CollectionController {
  constructor (collection, themeProvider, ViewModeService, $scope, $rootScope, documentsService, $stateParams, $q) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    $scope.documentsService = documentsService;

    this.docs = collection.data.collections;
    this.$q = $q;
    let deferred = this.$q.defer();
    $scope.parentClass = $stateParams.collectionId;
    let self = this;

    $scope.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    $scope.cardMode = ($scope.toggleMode.thisState === 'Card');

    $scope.emptyCollectionFilter = function (collection) {
      if (ViewModeService.showEmptyCollections) {
        return true;
      } else {
        return collection.count > 0;
      }
    };

    $rootScope.$on('customerStateChanged', function (event, data) {
      $scope.toggleMode = {
        thisState: data.thisState,
        alterState:  data.alterState
      };
      $scope.cardMode = ($scope.toggleMode.thisState === 'Card');
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
        let localeDE = formData.locale_DE.$modelValue;
        let localeEN = formData.locale_EN.$modelValue;

        formData.resultPromise = deferred.promise;

        let dataId = $stateParams.collectionId;
        //return;
        formData.resultPromise = documentsService.callDocumentRelated(dataId, true)
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
                  'locale_DE': localeDE,
                  'locale_EN': localeEN
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

    $scope.$on('$destroy', function() {
      $scope.addListener();
    });

  }
}
