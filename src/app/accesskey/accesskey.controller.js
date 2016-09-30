export class AccesskeyController {
    constructor ($scope, docs, storedAccessKey, category, locale, baseUrl, $stateParams, ViewModeService, documentsService, ConfigService, $rootScope, $mdDialog, $mdSidenav, $filter, $controller, LocalAccessService, FileSaver, Blob, toastr, UploadService, StorageService, CheckAuthService, $timeout, $location, $state) {
      'ngInject';
      $scope.accessKey = storedAccessKey ? LocalAccessService.decryptCredentials(storedAccessKey) : null;
      $scope.akCoreItems = [];
      if (docs.data && docs.data.avail_filter) {
        documentsService.akCollections = documentsService.filterToCollections(docs.data.avail_filter, $stateParams.collectionId);
        $scope.akCoreItems = docs.data.avail_filter;
      }
      $controller('CustomerController', {$scope: $scope, storedAccessKey: storedAccessKey, docs: docs, category: category, locale: locale, baseUrl: baseUrl, $stateParams: $stateParams, ViewModeService: ViewModeService, documentsService: documentsService, ConfigService: ConfigService, $rootScope: $rootScope, $mdDialog: $mdDialog, $mdSidenav: $mdSidenav, $filter: $filter, FileSaver: FileSaver, Blob: Blob, toastr: toastr, UploadService: UploadService, StorageService: StorageService, CheckAuthService: CheckAuthService, $timeout: $timeout, $location: $location, $state: $state});
    }
  }

