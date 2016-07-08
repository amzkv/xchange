export class AccesskeyController {
    constructor ($scope, docs, category, locale, baseUrl, $stateParams, ViewModeService, documentsService, ConfigService, $rootScope, $mdDialog, $mdSidenav, $filter, $controller) {
      'ngInject';
      $controller('CustomerController', {$scope: $scope, docs: docs, category: category, locale: locale, baseUrl: baseUrl, $stateParams: $stateParams, ViewModeService: ViewModeService, documentsService: documentsService, ConfigService: ConfigService, $rootScope: $rootScope, $mdDialog: $mdDialog, $mdSidenav: $mdSidenav, $filter: $filter});
    }
  }

