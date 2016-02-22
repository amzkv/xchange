/**
 * Created by decipher on 18.2.16.
 */
export class CustomerController {
  constructor ($scope, docs, category, $log) {
    'ngInject';

    $scope.category = category;
    $log.log($scope.category);

    $scope.docs = docs.data.documents;
    $log.log($scope.docs);
  }
}
