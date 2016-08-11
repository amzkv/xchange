/**
 * Created by decipher on 18.2.16.
 */
export class CustomerController {
  constructor ($scope, docs, storedAccessKey, category, locale, baseUrl, $stateParams, ViewModeService, documentsService, LocalAccessService, ConfigService, $rootScope, $mdDialog, $mdSidenav, $filter, FileSaver, Blob, toastr) {
    'ngInject';

    //$scope.filterData = {};

    //$scope.groupFilters = [];
    $scope.shownGroup = 0;
    $scope.mdClosing = false;
    //documentsService.filter = null;
    $scope.documentsService = documentsService;
    $scope.documentsService.searchFilter = '';

    $scope.category = $stateParams.collectionId;//category
    $scope.locale = locale;
    //console.log('docs',docs);
    $scope.docs = docs.data.documents || docs.data.collections;//todo
    $scope.docsError = docs.error;

    $rootScope.filters = docs.data.avail_filter;

    $scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;
    $scope.accessKey = $scope.accessKey || $stateParams.accessKey;
    if ($scope.accessKey && docs.data && docs.data.accesskey_user) {
      LocalAccessService.accessKeyUser = docs.data.accesskey_user;
    }

    documentsService.startValue = ConfigService.getDocumentStartValue();
    documentsService.endValue = ConfigService.getDocumentOffsetValue();

    if ($scope.totalDocCount < documentsService.endValue) {
      documentsService.endValue = $scope.totalDocCount;
    }

    $scope.pageSize = documentsService.endValue;

    $scope.cacheStart = docs.start;

    $scope.baseUrl = baseUrl;

    $scope.groupFilter = function (collection) {
      return collection.group.value !== 'Monat' && collection.group.value !== 'NEW' && collection.group.value !== 'INBOX' && collection.group.value !== 'Type' && collection.group.value !== 'WORKFLOW';
    };


    $scope.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
    $scope.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));

    $scope.customerStateChangedListener = $rootScope.$on('customerStateChanged', function (event, data) {
        $scope.toggleMode = {
          thisState: data.thisState,
          alterState:  data.alterState
        };
        //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
      $scope.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));
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

    $scope.$watch('documentsService.filter', function (newValue, oldValue, scope) {
      if (newValue && newValue != oldValue) {
        if (documentsService.filterCustomerId || documentsService.filterAccessKey) {
          //todo
          let docsPromise;
          if (documentsService.filterCustomerId) {
            docsPromise = documentsService.callDocumentByOneCollection(documentsService.filterCustomerId);
          }
          if (documentsService.filterAccessKey) {
            docsPromise = documentsService.callDocumentByAccessKey(documentsService.filterAccessKey);
          }
          docsPromise.then(function (resp) {
            if (resp.data.response.success) {
              //console.log('response');
              scope.docs = resp.data.documents;
              //scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;
              if (resp.data.control && resp.data.control.filtered_documents) {
                scope.totalDocCount = resp.data.control.filtered_documents;
              } else {
                scope.totalDocCount = resp.data.control ? resp.data.control.total_documents : 0;
              }
              if (scope.totalDocCount < documentsService.endValue) {
                documentsService.endValue = scope.totalDocCount;
              }
              //console.log(resp.data.control, resp.data.control.filtered_documents ,scope.totalDocCount, documentsService.endValue);
            }
          });
        }
      }
    });

    $scope.more = function() {

      //console.log('more', documentsService.busy,  documentsService.startValue, documentsService.endValue, $scope.totalDocCount, $scope.cacheStart);

      if (documentsService.busy) return;

      var startValue = documentsService.startValue;
      var endValue = documentsService.endValue;
      var offset = documentsService.offset;

      if ($scope.totalDocCount > documentsService.endValue) {
        startValue = documentsService.endValue + 1;
        endValue = endValue + offset;
        endValue = (endValue > $scope.totalDocCount) ? $scope.totalDocCount : endValue;
        //console.log(startValue, endValue);
        var newdocs;
        if ($scope.accessKey) {
          newdocs = documentsService.callDocumentByAccessKey($scope.accessKey, startValue, endValue);
        } else {
          newdocs = documentsService.callDocumentByOneCollection($stateParams.customerId, startValue, endValue);
        }
        newdocs.then(function(resp) {
          //console.log('newdocs:', resp);
          if (resp.data.response && resp.data.response.success) {
            //request
            let source = resp.data.documents || resp.data.collections;
            $scope.addMoreItems(source);
            //$scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;
            //fix
            if (resp.data.control && resp.data.control.filtered_documents) {
              $scope.totalDocCount = resp.data.control.filtered_documents;
            } else {
              $scope.totalDocCount = resp.data.control ? resp.data.control.total_documents : 0;
            }

            if ($scope.totalDocCount < documentsService.endValue) {
              documentsService.endValue = $scope.totalDocCount;
            }
            //end fix

          } else if (resp.data.control) {
            //cache
            $scope.addMoreItems(resp.data.collections);
            $scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;
          }
        });
      }
    };

    $scope.$on('$destroy', function() {
      $scope.customerStateChangedListener();
    });

    /*$scope.typeList = [];
    $scope.$watch('typeList', function (newValue, oldValue, scope) {
      console.log($scope.typeList);
    });*/

    $scope.editForm = {};

    $scope.editDocument = function (event, documentId) {

      let key = null;
      if ($stateParams.accessKey) {
        key = $stateParams.accessKey;
        //return;
      }
      event.stopPropagation();
      $scope.etc = function() {
        return !$scope.formChanged;
      };

      let parentScope = $scope;

      $mdDialog.show({
          controller: 'EditDocumentController' ,
          templateUrl: 'app/customer/edit.html',
          preserveScope: true,
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose:true,
          /*escapeToClose: false,*/
          /*fullscreen: true,*/
          locals: {
            thatScope: parentScope,
            documentId: documentId,
            key: key
          },
          hasBackdrop: true,
          /*scope: $scope,*/
          onRemoving: function(element, promise) {
            //console.log('removing', $mdDialog);
            $scope.mdClosing = true;
            //promise.resolve($mdDialog.hide());
            thatScope.mdClosing = true;
          },
          transformTemplate: function(template) {
            return '<div class="md-dialog-container edit-doc">' + template + '</div>';
          }
        })
        .then(function() {
          //$scope.mdClosing = true;
        }, function() {
          //$scope.mdClosing = true;
          //console.log('close2');
        });
    };
  }
}
