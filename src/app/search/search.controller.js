/**
 * Created by decipher on 18.2.16.
 */
export class SearchController {
  constructor ($scope, core_docs, collections, docs, baseUrl, $stateParams, ViewModeService, documentsService, ConfigService, $rootScope, $mdSidenav) {
    'ngInject';

    //TODO:REDO, when API is ready

    $scope.excludeCollections = ['Monat', 'NEW', 'INBOX', 'Type', 'WORKFLOW'];

    this.coreDocs = core_docs.data.collections;
    this.collections = collections.data.collections;
    $scope.docs = docs.data.documents;


    $scope.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    $scope.cardMode = ($scope.toggleMode.thisState === 'Card');

    $rootScope.$on('customerStateChanged', function (event, data) {
      $scope.toggleMode = {
        thisState: data.thisState,
        alterState:  data.alterState
      };
      $scope.cardMode = ($scope.toggleMode.thisState === 'Card');
    });

    //console.log(core_docs);
  }
}
