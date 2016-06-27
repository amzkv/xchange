export class MainController {
  constructor(categories, themeProvider, $scope, $rootScope, ViewModeService, documentsService) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    $scope.documentsService = documentsService;

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
