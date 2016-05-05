/**
 * Created by decipher on 18.2.16.
 */
export class CustomerController {
  constructor ($scope, docs, category, themeProvider, baseUrl, $stateParams, $state, documentsService, ConfigService, Deckgrid, DeckgridDescriptor, $rootScope) {
    'ngInject';

    $scope.category = category;

    $scope.docs = docs.data.documents;
    $scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;

    $scope.baseUrl = baseUrl;

    //$scope.theme = '365red';

    $scope.showDetails = function (card) {
      card.details = card.details ? false : true;
      card.baseUrl = baseUrl;
    };

    $scope.addMoreItems = function(items) {
      $scope.docs = $scope.docs.concat(items);
      //angular.extend($scope.docs, items);
    };

    $scope.more = function() {

      if (documentsService.busy) return;

      var startValue = documentsService.startValue;
      var endValue = documentsService.endValue;
      var offset = documentsService.offset;

      if ($scope.totalDocCount > documentsService.endValue) {
        startValue = documentsService.endValue + 1;
        endValue = endValue + offset;
        endValue = (endValue > $scope.totalDocCount) ? $scope.totalDocCount : endValue;

        var newdocs = documentsService.callDocumentByOneCollection($stateParams.customerId, startValue, endValue);
        newdocs.then(function(resp) {
          if (resp.data.response.success) {
            $scope.addMoreItems(resp.data.documents);
          }
        });
      }
    };

    $scope.$on('$destroy', function(e) {
      $rootScope.$$destroyed = true;//tmp solution, deckgrid's new bug
    });
  }
}
