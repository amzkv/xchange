/**
 * Created by decipher on 18.2.16.
 */
export class CustomerController {
  constructor ($scope, docs, storedAccessKey, category, locale, baseUrl, $stateParams, ViewModeService, documentsService, LocalAccessService, ConfigService, $rootScope, $mdDialog, $mdSidenav, $filter, FileSaver, Blob, toastr, UploadService, StorageService, CheckAuthService, $timeout, $location, $state) {
    'ngInject';

    //$scope.filterData = {};

    //$scope.groupFilters = [];

    let acceptH = function (file, done, dropzone) {
      UploadService.dropzone = $scope.dzMethods.getDropzone();
      let currentCollection = $stateParams.currentCollection;// || documentsService.currentCollection;
      if ($stateParams.collectionId == 'Type' && currentCollection) {
        UploadService.uploadType = currentCollection.value;
      }
      return UploadService.localAcceptHandler(file, done);
    };

    $scope.dzOptions = {
      url : '/',
      paramName : 'files',
      maxFilesize : '30',
      /*acceptedFiles : 'image/jpeg, images/jpg, image/png',*/
      addRemoveLinks : true,
      dictInvalidFileType: 'Invalid file',
      /* autoProcessQueue:false,*/
      accept: acceptH,
      dictDefaultMessage: '<span class="dz-drop-file"><strong>Drop file</strong> or click to upload</span>',
      previewTemplate: UploadService.template/*,
       dictDefaultMessage: '<img src="assets/images/dropzone.png" />'*/
    };

    $scope.dzCallbacks = {
      'addedfile' : function(file){
        //console.log(file);
        //$scope.newFile = file;
      },
      'success' : function(file, xhr){
        //console.log(file, xhr);
        //console.log(CheckAuthService.userid);
        if (CheckAuthService.userid) {
          //console.log('documents', $stateParams.customerId, CheckAuthService.userid);
          StorageService.cleanSelectedRecordsByCollectionForUser('documents', $stateParams.customerId, CheckAuthService.userid);

          //todo: use notifications

          /*documentsService.filter = null;
          documentsService.callDocumentByOneCollection($stateParams.customerId, null, null, true).then(function(ndocs) {
            $scope.docs = ndocs.data.documents || ndocs.data.collections;//todo
          });*/

        }
        //StorageService.cleanSelectedRecordsByCollectionForUser('documents', notification.id, userId);
      },
    };

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
      if ($rootScope.infinicast) {
        //$rootScope.infinicast.listen();
        //console.log('infinicast', LocalAccessService.getPartnerIds());

        let partners = LocalAccessService.getPartnerIds();
        //dynamically inject ids to subscribe
        $rootScope.infinicast.updatePathConfig('userChat', 'ids', partners);
        $rootScope.infinicast.updatePathConfig('userOnline', 'ids', partners);
        $rootScope.infinicast.isAccessKeyUser = true;
        $rootScope.infinicast.listen();
        //console.log($rootScope.infinicast);
      }
    }

    documentsService.startValue = ConfigService.getDocumentStartValue();
    documentsService.endValue = ConfigService.getDocumentOffsetValue();

    if ($scope.totalDocCount < documentsService.endValue) {
      documentsService.endValue = $scope.totalDocCount;
    }

    $scope.pageSize = documentsService.endValue;

    $scope.cacheStart = docs.start;

    $scope.baseUrl = baseUrl;

    $scope.applySearchFilter = function() {
      $scope.filteredDocs = $filter('filter')($scope.docs, $scope.searchService.searchCriteria(documentsService.searchFilter));
    };

    $scope.$watch('documentsService.searchFilter', function (newValue, oldValue) {
      //$scope.searchField = newValue;

      if (newValue == '') {
        $scope.filteredDocs = null;
      }
      if (newValue === oldValue) {
        return;
      }
      $scope.applySearchFilter();

    });

    $scope.excludeCollections = ['Monat', 'NEW', 'INBOX', 'Type', 'WORKFLOW'];

    /*$scope.groupFilter = function (collection) {
      return collection.group.value !== 'Monat' && collection.group.value !== 'NEW' && collection.group.value !== 'INBOX' && collection.group.value !== 'Type' && collection.group.value !== 'WORKFLOW';
    };*/


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
      //$scope.applySearchFilter();
      //angular.extend($scope.docs, items);
    };

    $scope.$watch('documentsService.filter', function (newValue, oldValue, scope) {
      if (newValue && newValue != oldValue) {
        if (documentsService.filterCustomerId || documentsService.filterAccessKey) {
          //todo
          let docsPromise;
          if (!documentsService.filterAccessKey && documentsService.filterCustomerId) {
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
      //console.log('more');

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
            if (documentsService.searchFilter) {
              $scope.applySearchFilter();
            }
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

    $scope.goToDocument = function(event, documentId) {
      //$state.go($state.current, {documentId: documentId}, {reload: false, notify: false});
      $scope.editDocument(event, documentId);
      //console.log($state.current);
      //if ($stateParams)
      $stateParams.documentId = documentId;
      let state = 'document';
      if ($stateParams.accessKey) {
        if ($stateParams.collectionId && $stateParams.customerId) {
          state = 'accesskeyDocumentViewLong';
        } else {
          state = 'accesskeyDocumentView';
        }
      }
      $state.go(state, $stateParams, {reload: false, notify: false});
    };

    $scope.editDocument = function (event, documentId, skipChangeState) {

      let key = null;
      if ($stateParams.accessKey) {
        key = $stateParams.accessKey;
        //return;
      }
      if (event) {
        event.stopPropagation();
      }
      $scope.etc = function() {
        return !$scope.formChanged;
      };

      let parentScope = $scope;
      $scope.returnPath = function () {
        let stateName = 'customer';
        if ($stateParams.accessKey) {
          if ($stateParams.collectionId && $stateParams.customerId) {
            stateName = 'accesskeyDocumentFromCollection';
          } else {
            stateName = 'accesskeyDocument';
          }
        }
        $state.go(stateName, $stateParams, {reload: false, notify: false});
      };

      $mdDialog.show({
          controller: 'EditDocumentController' ,
          templateUrl: 'app/customer/edit.html',
          preserveScope: true,
          parent: angular.element(document.body),
          targetEvent: event,
          disableParentScroll: true,
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
          //$scope.returnPath();
        }, function() {
          $scope.returnPath();
          //$scope.mdClosing = true;
          //console.log('close2');
        });
    };

    if ($stateParams.documentId) {
      $timeout(
        function() {
          $scope.editDocument(null, $stateParams.documentId, true);
        },
        100
      );
    }
  }
}
