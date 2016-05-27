/**
 * Created by decipher on 18.2.16.
 */
export class CustomerController {
  constructor ($scope, docs, category, locale, baseUrl, $stateParams, ViewModeService, documentsService, ConfigService, Deckgrid, DeckgridDescriptor, $rootScope, $mdDialog, $mdSidenav) {
    'ngInject';

    $scope.filterData = {};

    $scope.category = $stateParams.collectionId;//category
    $scope.locale = locale;

    $scope.docs = docs.data.documents;

    $scope.filters = docs.data.avail_filter;

    $scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;

    $scope.baseUrl = baseUrl;


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

    //$scope.theme = '365red';

    $scope.showDetails = function (card) {
      card.details = card.details ? false : true;
      card.baseUrl = baseUrl;
    };

    $scope.addMoreItems = function(items) {
      $scope.docs = $scope.docs.concat(items);
      //angular.extend($scope.docs, items);
    };

    $scope.closeFilter = function () {
      $mdSidenav('right').close();
    };

    $scope.resetFilter = function() {
      $scope.collectionFilter = [];
      documentsService.filter = null;
    };

    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };

    $scope.isGroupShown = function(group) {
      if (group == 0 && $scope.shownGroup == null) return true;
      return $scope.shownGroup === group;
    };

    $scope.applyFilter = function () {

      $scope.collectionFilter = [];
      $scope.collectionFilterGroupTitles = [];

      /*if (typeof $scope.groupKey != 'undefined' && $scope.filters[$scope.groupKey]) {
        $scope.collectionFilterGroup = $scope.filters[$scope.groupKey].group.locale;//test it
        angular.forEach($scope.filters[$scope.groupKey].title, function (item) {
          $scope.collectionFilter.push({collection: item.id});
          $scope.collectionFilterGroupTitles[item.id] = item.locale || item.value;
        });
      }

      if (typeof $scope.titleId != 'undefined') {
        $scope.collectionFilter = [];
        $scope.collectionFilter.push({collection: $scope.titleId});
        $scope.collectionFilterTitle = $scope.collectionFilterGroupTitles[$scope.titleId];
      }*/

      if (typeof $scope.filterData.titleIds != 'undefined') {
        $scope.shownGroup = $scope.shownGroup ? $scope.shownGroup : 0;
        angular.forEach($scope.filterData.titleIds, function (item, k) {
          if (item) {
            if ($scope.shownGroup == k) {
              angular.forEach( item, function (val, id) {
                if (val) {
                  $scope.collectionFilter.push({collection: id});
                }
              });
            } else {
              $scope.filterData.titleIds[k] = false;
            }
          }
        });
      }

      //console.log('collectionFilter', $scope.collectionFilter);
      documentsService.filter = $scope.collectionFilter;
      documentsService.callDocumentByOneCollection($stateParams.customerId)
        .then(function(resp) {
        if (resp.data.response.success) {
          $scope.docs = resp.data.documents;
        }
      });

      //$mdSidenav('right').close();
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

    /*$scope.$on('$destroy', function(e) {
      $rootScope.$$destroyed = true;//tmp solution, deckgrid's new bug
    });*/

    $scope.editDocument = function (event, documentId) {

      event.stopPropagation();
      $mdDialog.show({
          controller: function ($scope, documentsService, $timeout, $mdDialog, ConfigService) {
            (function () {
              documentsService.callDocumentById(documentId).then(function(resp) {
                if (resp.data.response.success) {
                  $scope.basepath = ConfigService.getBaseUrl() + 'file';
                  $scope.setVisibilityForImage = false;
                  var res = resp.data;
                  $scope.rowDocument = res.document;
                  $scope.documentTitle = resp.data.document.title;
                  $scope.selectedItem = $scope.rowDocument;
                  $scope.searchText = "";

                  var currentDate = new Date(res.document.date)
                  $scope.documentDate = currentDate;
                  $scope.currentDate = currentDate;//(languageCode == "de" ? moment(currentDate).format(configService.DateFormatInGerman) : moment(currentDate).format(configService.DateFormatInEnglish));
                  var updatedDate = res.document.updated;//(languageCode == "de" ? moment(res.document.updated).format(configService.DateFormatInGerman) : moment(res.document.updated).format(configService.DateFormatInEnglish));
                  $scope.documentName = res.document.filename;
                  $scope.payDate = new Date();
                  if (res.document.hasOwnProperty('workflow')) {

                    $scope.workflow = (res.document.workflow.startable.length == 0 ? "" : res.document.workflow.startable[0].process);
                    //console.log('wf', $scope.workflow, res.document.workflow);
                    $scope.workflowTips = (res.document.workflow.startable.length == 0 ? "" : res.document.workflow.startable[0].desc);
                  } else {
                    $scope.workflow = "";
                    $scope.workflowTips = "";
                  }

                  $scope.userinfo = res.document.creator_name + "/" + $scope.rowDocument.date + " - " + updatedDate
                  $scope.largeFilePath = $scope.basepath + '/large/' + res.document.uuid;
                  $scope.documentUrl = $scope.basepath + '/original/' + res.document.uuid;
                  $scope.setVisibilityForImage = true;
                  $scope.visibilityOfViewer = false;
                  $scope.fileType = res.document.type.locale;
                  if ($scope.documentName.indexOf('pdf') != -1) {
                    $scope.visibilityOfViewer = true;
                  } else {
                    $scope.visibilityOfViewer = false;
                  }

                  if (res.document.hasOwnProperty('types_available')) {
                    var firstType = res.document.types_available[0]
                    $scope.userType = firstType.locale;
                    $scope.typesavailable = res.document.types_available;
                  }
                  $scope.typeList = res.document.collections;


                  $timeout(function () {
                    $scope.querySearch = function (query) {
                      $scope.typesavailable;
                    }
                  }, 400);

                  /*function createFilterFor(query) {
                    var lowercaseQuery = query;
                    var gd = _.filter($scope.typesavailable, function (item) {
                      return (item.locale.indexOf(lowercaseQuery) != -1);
                    });
                    return gd;
                  }*/

                  $timeout(function () {
                    $scope.querySearch = function (query) {
                      return $scope.typesavailable;
                    }
                  }, 400);

                }
              });
            })();

            $scope.cancel = function () {
              $mdDialog.hide();
            }
            $scope.save = function () {
              console.log('save');
              //$mdDialog.hide();
            }
          },
          templateUrl: 'app/customer/edit.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose:true,
          fullscreen: true
        })
        .then(function() {
        }, function() {
        });
    };
  }
}
