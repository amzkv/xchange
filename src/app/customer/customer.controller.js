/**
 * Created by decipher on 18.2.16.
 */
export class CustomerController {
  constructor (docs) {
    'ngInject';

    console.log(docs);

    this.docs = docs.data.collections;
  }
}
