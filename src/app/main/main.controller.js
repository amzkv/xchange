export class MainController {
  constructor(categories, themeProvider) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    this.docs = categories.data.collections;

  }
}
