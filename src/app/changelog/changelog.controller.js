/**
 * Created by decipher on 8.6.16.
 */
export class ChangeLogController {
  constructor ($scope, $rootScope, LocalAccessService, documentsService, $state) {
    'ngInject';
    this.localAccesService = LocalAccessService;
    this.documentsService = documentsService;
    let self = this;
    $scope.clearLocalData = function() {
      self.localAccesService.clearLocalData();
      $rootScope.loggedOut = true;
      self.documentsService.allCollections = null;
      $state.go('login');
    }
  }
}
