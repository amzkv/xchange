/**
 * Created by decipher on 18.2.16.
 */
export class CustomerController {
  constructor ($scope, docs, category, locale, baseUrl, $stateParams, ViewModeService, documentsService, LocalAccessService, ConfigService, $rootScope, $mdDialog, $mdSidenav, $filter, FileSaver, Blob, toastr) {
    'ngInject';

    //$scope.filterData = {};

    //$scope.groupFilters = [];
    $scope.shownGroup = 0;
    //documentsService.filter = null;
    $scope.documentsService = documentsService;

    $scope.category = $stateParams.collectionId;//category
    $scope.locale = locale;
    //console.log('docs',docs);
    $scope.docs = docs.data.documents || docs.data.collections;//todo
    $scope.docsError = docs.error;

    $rootScope.filters = docs.data.avail_filter;

    $scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;

    documentsService.startValue = ConfigService.getDocumentStartValue();
    documentsService.endValue = ConfigService.getDocumentOffsetValue();

    if ($scope.totalDocCount < documentsService.endValue) {
      documentsService.endValue = $scope.totalDocCount;
    }

    $scope.pageSize = documentsService.endValue;

    $scope.cacheStart = docs.start;

    $scope.baseUrl = baseUrl;

    $scope.groupFilter = function (collection) {
      return collection.group.value !== 'Monat' && collection.group.value !== 'NEW' && collection.group.value !== 'INBOX' && collection.group.value !== 'Type';
    };


    $scope.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    //$scope.cardMode = ($scope.toggleMode.thisState === 'Card');
    $scope.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));

    $rootScope.$on('customerStateChanged', function (event, data) {
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
        if (documentsService.filterCustomerId) {
          documentsService.callDocumentByOneCollection(documentsService.filterCustomerId)
            .then(function (resp) {
              if (resp.data.response.success) {
                //console.log('response');
                scope.docs = resp.data.documents;
                scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;

                if (scope.totalDocCount < documentsService.endValue) {
                  documentsService.endValue = scope.totalDocCount;
                }
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
        var newdocs = documentsService.callDocumentByOneCollection($stateParams.customerId, startValue, endValue);
        newdocs.then(function(resp) {
          //console.log('newdocs:', resp);
          if (resp.data.response && resp.data.response.success) {
            //request
            let source = resp.data.documents || resp.data.collections;
            $scope.addMoreItems(source);
            $scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;
          } else if (resp.data.control) {
            //cache
            $scope.addMoreItems(resp.data.collections);
            $scope.totalDocCount = docs.data.control ? docs.data.control.total_documents : 0;
          }
        });
      }
    };

    /*$scope.$on('$destroy', function(e) {
      $rootScope.$$destroyed = true;//tmp solution, deckgrid's new bug
    });*/

    $scope.editDocument = function (event, documentId) {
      let key = null;
      if ($stateParams.accessKey) {
        key = $stateParams.accessKey;//this doesn't work yet, therefore return
        return;
      }
      event.stopPropagation();
      $mdDialog.show({
          controller: function ($scope, documentsService, $timeout, $mdDialog, ConfigService) {
            (function () {
              documentsService.callDocumentById(documentId, key).then(function(resp) {
                //resp.data.response.success
                if (resp.data.document) {
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

                    $scope.workflow = (res.document.workflow.startable && res.document.workflow.startable.length != 0 ? res.document.workflow.startable[0].process : "");
                    //console.log('wf', $scope.workflow, res.document.workflow);
                    $scope.workflowTips = (res.document.workflow.startable && res.document.workflow.startable.length != 0 ? res.document.workflow.startable[0].desc: "");
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
            };

            //TODO: move
            $scope.base64toBlob = function(base64Data, contentType) {
              contentType = contentType || '';
              var sliceSize = 1024;
              var byteCharacters = atob(base64Data);
              var bytesLength = byteCharacters.length;
              var slicesCount = Math.ceil(bytesLength / sliceSize);
              var byteArrays = new Array(slicesCount);

              for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                  bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
              }
              return new Blob(byteArrays, { type: contentType });
            };

            $scope.save = function () {
              documentsService.callFileById(documentId).then(function(resp) {
                if (resp && resp.data.file) {
                  let fileContents = resp.data.file.file;
                  let fileName = resp.data.file.filename;
                  if (fileContents && fileName) {
                    fileContents = $scope.base64toBlob(fileContents);
                    var data = new Blob([fileContents]);
                    FileSaver.saveAs(data, fileName);
                  } else {
                    toastr.error('Unable to save file.', 'Error');
                  }
                } else {
                  toastr.error('Unable to fetch file data.', 'Error');
                }
              });
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
