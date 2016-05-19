export class MainController {
  constructor(categories, themeProvider, $scope, $rootScope) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    this.docs = categories.data.collections;

  }
}
