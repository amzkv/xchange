/**
 * Created by decipher on 18.2.16.
 */
export class CollectionController {
  constructor (collection, themeProvider, ViewModeService, $scope, $rootScope) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    this.docs = collection.data.collections;

    $scope.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    $scope.cardMode = ($scope.toggleMode.thisState === 'Card');

    $rootScope.$on('customerStateChanged', function (event, data) {
      $scope.toggleMode = {
        thisState: data.thisState,
        alterState:  data.alterState
      };
      $scope.cardMode = ($scope.toggleMode.thisState === 'Card');
    });

  }
}
