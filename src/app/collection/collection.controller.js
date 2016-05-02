/**
 * Created by decipher on 18.2.16.
 */
export class CollectionController {
  constructor (collection, themeProvider, $log) {
    'ngInject';

    themeProvider.setDefaultTheme('365violet');

    this.docs = collection.data.collections;
    $log.log(collection.data.collections);

  }
}
