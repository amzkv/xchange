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
    $scope.accessKey = $stateParams.accessKey;
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
        key = $stateParams.accessKey;
        //return;
      }
      event.stopPropagation();
      $scope.etc = function() {
        return !$scope.formChanged;
      };

      let thatScope = $scope;

      $mdDialog.show({
          controller: function ($scope, $rootScope, documentsService, $timeout, $mdDialog, ConfigService, pdfDelegate, $location, $anchorScroll) {
          let self = this;
          $scope.pdfState = {'page': 1};

          //thatScope.docs[0].title = 'test';

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
                  //console.log(res.document.date);
                  var currentDate = new Date(res.document.date);
                  //convert if invalid
                  //console.log(currentDate, res.document.date, isNaN(Date.parse(currentDate)));
                  if (isNaN(Date.parse(currentDate))) {
                    //yyyyMMdd case
                    let datePattern = /(\d{4})(\d{2})(\d{2})/;
                    $scope.documentDate = new Date(res.document.date.replace(datePattern, '$1-$2-$3'));
                    //console.log($scope.documentDate);
                  } else {
                    $scope.documentDate = currentDate;//*
                  }


                  $scope.createdDate = new Date(res.document.created || res.document.date);//for future update?
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
                  $scope.editForm.text = resp.data.document.text;
                  $scope.editForm.documentDate = $scope.documentDate;
                  $scope.editForm.currentDate = $scope.documentDate;
                  $scope.editForm.documentName = res.document.filename;
                  $scope.editForm.createdDate = $scope.createdDate;//for future update?
                  $scope.editForm.payDate = new Date();
                  $scope.editForm.changedDate = new Date(updatedDate);
                  $scope.editForm.workflow = resp.data.document.workflow;//
                  $scope.editForm.workflowTips = resp.data.document.workflowTips;//
                  $scope.editForm.userType = $scope.userType;//
                  $scope.editForm.typesavailable = $scope.typesavailable;//
                  $scope.editForm.typeList = res.document.collections;

                  $scope.editForm.allCollections = documentsService.allCollections || res.document.collections;

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
                      /*if (angular.isObject(chip)) {
                        //return chip;
                        return { group: {}, title: { locale: chip.locale} };
                      }*/
                      //return { name: chip, type: 'new' }
                      //return { group: { locale: chip.value}, title: { locale: chip.locale} };
                      this.saveForm.collections.$dirty = true;//??
                      return chip;
                  };

                  $scope.removeChip = function (chip) {
                    this.saveForm.collections.$dirty = true;//??
                  };

                  function createFilterFor(query) {

                    let lowercaseQuery = angular.lowercase(query);
                    let filteredItems = [];

                    function filterFn(item) {
                      return (angular.lowercase(item.title.locale).indexOf(lowercaseQuery) !== -1);
                    };

                    angular.forEach(documentsService.allCollections, function (item) {
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

            $scope.goTo =function(event, hash) {
              let oldHash = $location.hash();
              $location.hash(hash);
              //$anchorScroll.yOffset = 64;
              $anchorScroll();
              $location.hash(oldHash);
              event.stopPropagation();
              event.preventDefault();
            };

            $scope.toggleSideMenu = function() {
              $scope.sideMenu = !$scope.sideMenu;
            };

            $scope.hideDialog = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function (ev) {
              $scope.mdClosing = true;
              if ($scope.formChanged) {
                $scope.showSaveConfirmation = true;
              } else {
               $mdDialog.hide();
              }
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

            /*$scope.$watch('showFile', function() {
              console.log('showFile', $scope.showFile);
            });

            $scope.onViewFile = function(inview) {
              if (inview) {
                //$scope.viewFile();
                $scope.showFile = true;
              } else {
                $scope.showFile = false;
              }
            };*/

            $scope.onViewFile = function(inview) {
              if (inview) {
                //$scope.viewFile();
                $scope.showControls = true;
              } else {
                $scope.showControls = false;
              }
              //console.log($scope.showControls);
              return true;
            };

            $scope.documentLoaded = false;

            $scope.viewFile = function(inview) {

              if ($scope.documentLoading) {
                return;
              }

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

              documentsService.callFileById(documentId, docType, key).then(function(resp) {
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
                            $scope.documentLoaded = true;
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
                          $scope.documentLoaded = true;

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
                      $scope.documentLoaded = true;

                      /*var img = document.getElementById('view_txt');
                    img.src = $scope.documentUrl;
                    img.onload = function() {
                      $scope.documentLoading = false;

                    };*/
                    } else {
                      $scope.fileStatus = 'Unsupported';//todo
                      $scope.documentLoading = false;//TODO
                      $scope.documentLoaded = true;
                    }

                } else {
                  toastr.error('Unable to fetch file data.', 'Error');
                  $scope.documentLoading = false;//TODO
                  $scope.documentLoaded = true;
                  $scope.documentError = true;
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

            $scope.focusControl = function($event) {
              //this does work

              /*if (angular.element($event.target)[0] && angular.element($event.target)[0].tagName != 'INPUT') {
                $event.target.focus();
              }*/
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
              documentsService.callFileById(documentId, null, key).then(function(resp) {
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
            };

            /*$scope.fixAmount = function(field,val) {
              $scope.saveForm[field].$setViewValue((+val).toFixed(2));
            };*/

            $scope.updateCurrentDocumentList = function(id, data) {

              function changeValue(fieldName, data, item, key, subKey) {
                if (data[fieldName] && data[fieldName] != item[fieldName]) {
                  if (subKey) {
                    thatScope.docs[key][fieldName] = data[fieldName][subKey];
                  } else {
                    thatScope.docs[key][fieldName] = data[fieldName];
                  }
                }
              }

              angular.forEach(thatScope.docs, function (item, key) {
                //manual list for now
                if (item.id == id) {
                  changeValue('title', data, item, key);
                  changeValue('date', data, item, key);
                  changeValue('type', data, item, key);
                  changeValue('text', data, item, key);
                  //changeValue('workstatus', data, item, key);
                  changeValue('netvaluegoods', data, item, key);
                  changeValue('totalamount', data, item, key);
                  changeValue('taxamount', data, item, key);
                  changeValue('collections', data, item, key);
                  //todo
                }
              });
            };

            $scope.save = function (editForm) {
              function prepareCollections(collections) {
                let colsToSave = [];
                angular.forEach(collections, function (item) {
                  if (item.id) {
                    colsToSave.push({"id": item.id});
                    //colsToSave.push(item);
                  }
                });
                  //return collections;
                  return colsToSave;
              }

              //console.log('editForm', editForm, this.saveForm);
              let form = this.saveForm;
              let permissionType = 'change';
              let data = {};
              let updateData = {};
              if (editForm.authorized && editForm.authorized.indexOf(permissionType) !== -1 && form.$valid) {
                //title
                if (form.title.$dirty && form.title.$modelValue) {
                  let title = form.title.$modelValue;
                  data.title = title;
                }
                if (form.date && form.date.$dirty && form.date.$modelValue) {
                  let date = form.date.$modelValue;
                  let formattedDate = $filter('date')(date, 'yyyy-MM-dd');
                  data.date = formattedDate;
                }

                /*if (form.title.$dirty && form.title.$modelValue) {
                  let workstatus = form.workstatus.$modelValue;
                  data.workstatus = workstatus;
                }*/

                if (form.type.$dirty && form.type.$modelValue) {
                  let type = form.type.$modelValue;
                  let locale = type;
                  let typeF = editForm.types_available.filter(function(item) {
                    return item.value === type;
                  });
                  if (typeF && typeF[0]) {
                    locale = typeF[0].locale;
                  }
                  data.type = {'value' : type};
                  updateData.type = {'value' : type, 'locale' : locale};
                }

                if (form.text.$dirty) {
                  let text = form.text.$modelValue;
                  data.text = text;
                }

                if (form.netvaluegoods.$dirty && form.netvaluegoods.$modelValue) {
                  let netvaluegoods = form.netvaluegoods.$modelValue;
                  data.netvaluegoods = netvaluegoods;
                }

                if (form.totalamount.$dirty && form.totalamount.$modelValue) {
                  let totalamount = form.totalamount.$modelValue;
                  data.totalamount = totalamount;
                }

                if (form.totaltax.$dirty && form.totaltax.$modelValue) {
                  let totaltax = form.totaltax.$modelValue;
                  data.totaltax = totaltax;
                }

                if (form.collections.$dirty && form.collections.$modelValue) {
                  let collections = form.collections.$modelValue;
                  data.collections = prepareCollections(collections);
                  updateData.collections = form.collections.$modelValue;//TODO:test
                }
                let savedata = documentsService.callSaveDocumentById(documentId, data, key);
                savedata.then(function(saveResp) {
                  if (saveResp.data && saveResp.data.response && saveResp.data.response.errorcode == '200') {
                    toastr.success('File has been updated successfully', 'Success');//translate
                    //clear view document cache
                    documentsService.callDocumentById(documentId, key, true);//reload, TODO: just clear db
                    //clear documents list cache

                    //documentsService.cleanupRelatedLists('documents',documentId);//do not cleanup for now - we use modified cache

                    $scope.saveForm.$setPristine();
                    $scope.saveForm.$setSubmitted();
                    $scope.formChanged = false;
                    let viewData = angular.merge(data, updateData);
                    $scope.updateCurrentDocumentList(documentId, viewData);

                    documentsService.updateRelatedRelatedDocumentCache('documents',documentId, viewData);

                    //console.log($scope.saveForm);

                  } else {
                    //?
                    toastr.error('Unable to save file' + ':' + saveResp.error, 'Error');//translate
                  }
                });
              }
              /*documentsService.callSaveDocumentById(documentId, null, key).then(function(resp) {
              });*/
              //$mdDialog.hide();
            }
          },
          templateUrl: 'app/customer/edit.html',
          preserveScope: true,
          /*parent: angular.element(document.body),*/
          targetEvent: event,
          clickOutsideToClose:true,
          /*escapeToClose: false,*/
          /*fullscreen: true,*/
          hasBackdrop: false,
          transformTemplate: function(template) {
            return '<div class="md-dialog-container edit-doc">' + template + '</div>';
          }
        })
        .then(function() {
          $scope.mdClosing = true;
        }, function() {
          $scope.mdClosing = true;
          //console.log('close2');
        });
    };
  }
}
