export class MainController {
  constructor(categories, themeProvider, $scope, $rootScope) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    this.docs = categories.data.collections;

    $scope.$on('$destroy', function(e) {
      $rootScope.$$destroyed = true;//tmp solution, deckgrid's new bug
    });

  }
}
