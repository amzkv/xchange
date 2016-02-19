export class MainController {
  constructor (categories) {
    'ngInject';

    this.docs = categories.data.collections;

  }
}
