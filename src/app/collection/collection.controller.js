/**
 * Created by decipher on 18.2.16.
 */
export class CollectionController {
  constructor (collection, $log) {
    'ngInject';

    $log.log(collection);

    this.docs = collection.data.collections;
  }
}
