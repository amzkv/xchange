/**
 * Created by decipher on 8.6.16.
 */
export class ChangeLogController {
  constructor ($scope, LocalAccessService, $state) {
    'ngInject';
    this.localAccesService = LocalAccessService;
    let self = this;
    $scope.clearLocalData = function() {
      self.localAccesService.clearLocalData();
      $state.go('login');
    }
  }
}
