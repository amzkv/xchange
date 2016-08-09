export class AccesskeyController {
    constructor ($scope, docs, storedAccessKey, category, locale, baseUrl, $stateParams, ViewModeService, documentsService, ConfigService, $rootScope, $mdDialog, $mdSidenav, $filter, $controller, LocalAccessService) {
      'ngInject';
      $scope.accessKey = storedAccessKey ? LocalAccessService.decryptCredentials(storedAccessKey) : null;
      $controller('CustomerController', {$scope: $scope, storedAccessKey: storedAccessKey, docs: docs, category: category, locale: locale, baseUrl: baseUrl, $stateParams: $stateParams, ViewModeService: ViewModeService, documentsService: documentsService, ConfigService: ConfigService, $rootScope: $rootScope, $mdDialog: $mdDialog, $mdSidenav: $mdSidenav, $filter: $filter});
    }
  }

