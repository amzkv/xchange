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
    $scope.documentsService.searchFilter = '';

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
        key = $stateParams.accessKey;//this doesn't work yet, therefore return
        return;
      }
      event.stopPropagation();
      $mdDialog.show({
          controller: function ($scope, documentsService, $timeout, $mdDialog, ConfigService, pdfDelegate, $location, $anchorScroll) {
          let self = this;
          $scope.pdfState = {'page': 1};

          //(function () {
              documentsService.callDocumentById(documentId, key).then(function(resp) {
                //resp.data.response.success
                if (resp.data.document) {
                  $scope.basepath = ConfigService.getBaseUrl() + 'file';
                  //$scope.setVisibilityForImage = false;
                  var res = resp.data;
                  $scope.rowDocument = res.document;
                  $scope.documentTitle = resp.data.document.title;//*
                  $scope.selectedItem = {};//$scope.rowDocument;
                  $scope.searchText = "";

                  var currentDate = new Date(res.document.date);
                  $scope.documentDate = currentDate;//*
                  $scope.currentDate = currentDate;//(languageCode == "de" ? moment(currentDate).format(configService.DateFormatInGerman) : moment(currentDate).format(configService.DateFormatInEnglish));
                  var updatedDate = res.document.updated;//(languageCode == "de" ? moment(res.document.updated).format(configService.DateFormatInGerman) : moment(res.document.updated).format(configService.DateFormatInEnglish));
                  $scope.documentName = res.document.filename;
                  $scope.payDate = new Date();//?
                  if (res.document.hasOwnProperty('workflow')) {

                    $scope.workflow = (res.document.workflow.startable && res.document.workflow.startable.length != 0 ? res.document.workflow.startable[0].process : "");
                    //console.log('wf', $scope.workflow, res.document.workflow);
                    $scope.workflowTips = (res.document.workflow.startable && res.document.workflow.startable.length != 0 ? res.document.workflow.startable[0].desc: "");
                  } else {
                    $scope.workflow = "";
                    $scope.workflowTips = "";
                  }

                  $scope.userinfo = res.document.creator_name + "/" + $scope.rowDocument.date + " - " + updatedDate;
                  $scope.changedDate = new Date(updatedDate);
                  $scope.largeFilePath = $scope.basepath + '/large/' + res.document.uuid;
                  $scope.documentUrl = $scope.basepath + '/original/' + res.document.uuid;

                  /*$scope.setVisibilityForImage = true;
                  $scope.visibilityOfViewer = false;
                  $scope.fileType = res.document.type.locale;
                  if ($scope.documentName.indexOf('pdf') != -1) {
                    $scope.visibilityOfViewer = true;
                  } else {
                    $scope.visibilityOfViewer = false;
                  }*/

                  if (res.document.hasOwnProperty('types_available')) {
                    var firstType = res.document.types_available[0]
                    $scope.userType = firstType.locale;
                    $scope.typesavailable = res.document.types_available;
                  }
                  $scope.typeList = res.document.collections;

                  //
                  $scope.editForm = res.document;
                  $scope.editForm.documentTitle = resp.data.document.title;
                  $scope.editForm.documentDate = currentDate;
                  $scope.editForm.currentDate = currentDate;
                  $scope.editForm.documentName = res.document.filename;
                  $scope.editForm.payDate = new Date();
                  $scope.editForm.changedDate = new Date(updatedDate);
                  $scope.editForm.workflow = resp.data.document.workflow;//
                  $scope.editForm.workflowTips = resp.data.document.workflowTips;//
                  $scope.editForm.userType = $scope.userType;//
                  $scope.editForm.typesavailable = $scope.typesavailable;//
                  $scope.editForm.typeList = res.document.collections;
                  //angular.copy($scope.editForm, $scope.initialFormData);

                  $scope.$watch("editForm", function(newVal, oldVal){
                    if (newVal && newVal!=oldVal) {
                      $scope.formChanged = true;
                    }
                  }, true);

                  //console.log($scope.editForm.workflow, $scope.editForm.workflowTips, res);

                  $timeout(function () {
                    $scope.querySearch = function (query) {
                      return query ? createFilterFor(query) : $scope.typesavailable;
                    };
                  }, 400);

                  $scope.transformChip = function (chip) {
                      if (angular.isObject(chip)) {
                        //return chip;
                        return { group: {}, title: { locale: chip.locale} };
                      }
                      //return { name: chip, type: 'new' }

                      return { group: { locale: chip.value}, title: { locale: chip.locale} };
                  };

                  function createFilterFor(query) {

                    let lowercaseQuery = angular.lowercase(query);
                    let filteredItems = [];

                    function filterFn(item) {
                      return (angular.lowercase(item.locale).indexOf(lowercaseQuery) !== -1);
                    };

                    angular.forEach($scope.typesavailable, function (item) {
                      if (filterFn(item)) {
                        filteredItems.push(item);
                      }
                    });

                    return filteredItems;
                  }

                  //}, 400);

                }

              });
            //})();

            $scope.goTo =function(hash) {
              let oldHash = $location.hash();
              $location.hash(hash);
              $anchorScroll();
              $location.hash(oldHash);
            };

            $scope.toggleSideMenu = function() {
              $scope.sideMenu = !$scope.sideMenu;
            };

            $scope.cancel = function () {
              $mdDialog.hide();
            };

            $scope.zoomIn = function() {
              pdfDelegate.$getByHandle('pdf-container').zoomIn();
            };

            $scope.zoomOut = function() {
              pdfDelegate.$getByHandle('pdf-container').zoomOut();
            };

            $scope.pagePrev = function() {
              if ($scope.getPdfCurrentPage() > 1) {
                $scope.pdfGoToPage($scope.getPdfCurrentPage() - 1);
              }
            };

            $scope.pageNext = function() {
              if ($scope.getPdfCurrentPage() < $scope.pdfTotalPages) {
                $scope.pdfGoToPage($scope.getPdfCurrentPage() + 1);
              }
            };

            $scope.getPdfCurrentPage = function() {
              return pdfDelegate.$getByHandle('pdf-container').getCurrentPage();
            };

            $scope.pdfGoToPage = function(page) {
              let value = +page;
              if (page == '') {
                return;
              }

              if (!angular.isNumber(value) || isNaN(value)) {
                //let lastPageUsed = $scope.getPdfCurrentPage();
                //$scope.pdfState = {page : lastPageUsed};
                return;
              }

              value = (value > $scope.pdfTotalPages) ? $scope.pdfTotalPages : (value>0 ? value : 1);
              pdfDelegate.$getByHandle('pdf-container').goToPage(value);
              $scope.pdfState = {page:value};
            };

            $scope.unlockToggle = function() {
              $scope.unlockZoom = !$scope.unlockZoom;
            };

            $scope.viewFile = function() {

              function isPdfFile(filename) {
                return (filename.length > 4)  ? (filename.indexOf('.pdf') === (filename.length - 4)) : false;
              }

              function isImage(filename) {
                let extensions = ['.png', '.jpg', '.jpeg', '.gif' ];
                return extensions.some(function(element, index) {
                  return (filename.length > element.length)  ? (filename.indexOf(element) === (filename.length - element.length)) : false;
                });
              }

              function isPlainText(filename) {
                let extensions = ['.text', '.log', '.md', '.readme' ];
                return extensions.some(function(element, index) {
                  return (filename.length > element.length)  ? (filename.indexOf(element) === (filename.length - element.length)) : false;
                });
              }

              if ($scope.fileURL) {
                //TODO: this is pdf case
                /*$scope.documentLoading = true;
                pdfDelegate
                  .$getByHandle('pdf-container')
                  .load($scope.fileURL).then(function(item) {
                  $scope.documentLoading = false;
                });
                */
                return;
              }
              $scope.documentLoading = true;
              let docType = null;
              if ($scope.editForm.hassignature > 0) {
                docType = 'SIGNEDPDF';//TODO?
                //console.log('signed');
              }

              documentsService.callFileById(documentId, docType).then(function(resp) {
                if (resp && resp.data.file) {

                  let fileContents = resp.data.file.file;
                  let fileName = resp.data.file.filename;

                  /*fake text test*/
                  //fileContents = $scope.toBase64('Hello, guys! \n\r How are you?');
                  //fileName = 'test.txt';

                    if (isPdfFile(fileName)) {
                      if (fileContents && fileName) {
                        fileContents = $scope.base64toBlob(fileContents);
                        var data = new Blob([fileContents]);
                        $scope.fileURL = URL.createObjectURL(data);
                        $scope.documentLoading = true;
                        pdfDelegate
                          .$getByHandle('pdf-container')
                          .load($scope.fileURL)
                          .then(function(item) {
                            $scope.pdfTotalPages = pdfDelegate.$getByHandle('pdf-container').getPageCount();
                            $scope.documentLoading = false;
                            $scope.fileType = 'PDF';
                            $scope.pdfCurrentPage = $scope.getPdfCurrentPage();
                        });

                        //FileSaver.saveAs(data, fileName);
                      } else {
                        toastr.error('Unable to view file.', 'Error');
                      }
                    } else if (isImage(fileName)) {
                      if (fileContents) {
                        /*canvas*/
                        /*
                        fileContents = $scope.base64toBlob(fileContents);
                        var data = new Blob([fileContents]);
                        $scope.fileURL = URL.createObjectURL(data);
                        $scope.documentLoading = true;
                        $scope.fileType = 'IMG';
                        var cnvs = document.getElementById('image_canvas');
                        var ctx = cnvs.getContext('2d');
                        var img = new Image;
                        img.onload = function() {

                          let iW = this.width;
                          let iH = this.height;

                          let cW =  cnvs.width;
                          let cH =  cnvs.height;
                          let coef;
                          console.log('img:', iW, iH, 'canv:',cW, cH);
                          if (iW > cW) {
                            coef = iW / iH;
                            cW = cH*coef;
                            ctx.drawImage(img, 0, 0, cW, cH);
                          } else {
                            coef = iW / iH;
                            cH = cW/coef;
                            ctx.drawImage(img, 0, 0, cW, cH);
                          }
                          $scope.documentLoading = false;
                        };
                        img.src = $scope.fileURL;
*/
                        /*simple*/
                        $scope.documentLoading = true;
                        $scope.fileType = 'IMG';
                        $scope.fileURL = '/';//todo
                        var img = document.getElementById('view_img');
                        img.src = $scope.documentUrl;
                        img.onload = function() {
                          $scope.documentLoading = false;

                        };

                        //FileSaver.saveAs(data, fileName);
                      }
                    } else if (isPlainText(fileName)) {
                      $scope.fileType = 'TXT';
                      try {
                        fileContents = atob(fileContents);
                        $scope.textData = fileContents;
                      } catch (e) {
                        $scope.fileStatus = 'Unsupported';//todo
                      }
                      $scope.fileURL ='/';//todo
                      $scope.documentLoading = false;
                        /*var img = document.getElementById('view_txt');
                      img.src = $scope.documentUrl;
                      img.onload = function() {
                        $scope.documentLoading = false;

                      };*/
                    } else {
                      $scope.fileStatus = 'Unsupported';//todo
                      $scope.documentLoading = false;//TODO
                    }

                } else {
                  toastr.error('Unable to fetch file data.', 'Error');
                }
              });
            };

            $scope.docDetailsSections = {
              'mainBlock': true,
              'dataBlock': true,
              'collectionsBlock': true,
              'infoBlock': true,
              'workflowBlock': true
            };

            $scope.toggleItem = function(elementId) {
              $scope.docDetailsSections[elementId] = !$scope.docDetailsSections[elementId];
            };

            //TODO: move

            $scope.toBase64 = function(text) {
              return btoa(text);
            };

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

            $scope.downloadDoc = function () {
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
          preserveScope: true,
          /*parent: angular.element(document.body),*/
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
