/**
 * Created by decipher on 18.2.16.
 */
export class CollectionController {
  constructor (collection, themeProvider, ViewModeService, $scope, $rootScope, documentsService) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    $scope.documentsService = documentsService;

    this.docs = collection.data.collections;

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

  }
}
