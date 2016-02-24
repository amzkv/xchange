/**
 * Created by decipher on 18.2.16.
 */
export class CustomerController {
  constructor ($scope, docs, category) {
    'ngInject';

    $scope.category = category;

    $scope.docs = docs.data.documents;

    $scope.showDetails = function (card) {
      card.details = card.details ? false : true;
    }
  }
}
