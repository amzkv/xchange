/**
 * Created by decipher on 18.2.16.
 */
export class CustomerController {
  constructor ($scope, docs, category, themeProvider) {
    'ngInject';

    themeProvider.setDefaultTheme('365red');

    $scope.category = category;

    $scope.docs = docs.data.documents;

    //$scope.theme = '365red';

    $scope.showDetails = function (card) {
      card.details = card.details ? false : true;
    };
  }
}
