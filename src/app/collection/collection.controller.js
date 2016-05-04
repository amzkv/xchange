/**
 * Created by decipher on 18.2.16.
 */
export class CollectionController {
  constructor (collection, themeProvider) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    this.docs = collection.data.collections;

  }
}
