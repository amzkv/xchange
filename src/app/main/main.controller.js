export class MainController {
  constructor(categories, themeProvider, $scope, $rootScope, ViewModeService) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    this.docs = categories.data.collections;


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
