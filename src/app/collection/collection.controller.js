/**
 * Created by decipher on 18.2.16.
 */
export class CollectionController {
  constructor (collection) {
    'ngInject';

    console.log(collection);

    this.docs = collection.data.collections;
  }
}
