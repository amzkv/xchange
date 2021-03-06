export class EditDocumentController {
  constructor (thatScope, $sce, documentId, key, toastr, $filter, hotkeys, FileSaver, $scope, $rootScope , documentsService, $timeout, $mdDialog, ConfigService, pdfDelegate, $location, $anchorScroll, ViewerService, uiGridConstants, $state, $stateParams) {
    'ngInject';

    let self = this;
    $scope.pdfState = {'page': 1};
    $scope.formChanged = false;
    $scope.accessKey = key;

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.createFilterFor = function(query) {

      let lowercaseQuery = angular.lowercase(query);
      let filteredItems = [];

      function filterFn(item) {
        return (angular.lowercase(item.title.locale).indexOf(lowercaseQuery) !== -1);
      }

      angular.forEach(documentsService.allCollections, function (item) {
        if (filterFn(item)) {
          filteredItems.push(item);
        }
      });

      return filteredItems;
    };

    $timeout(function () {
      $scope.querySearch = function (query) {
        return query ? $scope.createFilterFor(query) : $scope.typesavailable;
      };
    }, 400);

    $scope.transformChip = function (chip) {
      this.saveForm.collections.$dirty = true;//??
      return chip;
    };

    $scope.removeChip = function (chip) {
      this.saveForm.collections.$dirty = true;//??
    };

    $scope.getCurrentType = function () {
      return $scope.editForm.type.value;
    };

    $scope.hasCollection =function(collectionValue) {
      let found = false;
      angular.forEach($scope.editForm.typeList, function (item) {
        if (item.group.value == collectionValue) {
          found = true;
          return;
        }
      });
      return found;
    };

    $scope.autoFillWFProcess = function () {
      if ($scope.newWorkFlow && $scope.editForm.workprocess) {
        if ($scope.hasCollection('CUSTOMER') && $scope.getCurrentType() == 'INVOICE') {
          let oiProcess = $scope.editForm.workprocess.filter(function(item) {
            return item.name === 'outgoing invoice';
          });
          if (oiProcess.length == 1) {
            $scope.editForm.workprocessToStart = oiProcess[0];
            $scope.formChanged = true;
            toastr.success('Applying default workflow process [outgoing invoice]', 'Notice');//??
          }
        }
      }
    };

    $scope.populateData = function(resp) {
      if (resp.data.document) {
        var res = resp.data;
        $scope.selectedItem = {};//$scope.rowDocument;
        $scope.searchText = "";

        $scope.basepath = ConfigService.getBaseUrl() + 'file';
        $scope.documentUrl = $scope.basepath + '/original/' + res.document.uuid;
        $scope.documentUrlLarge = $scope.basepath + '/large/' + res.document.uuid;

        let currentDate = new Date(res.document.date);
        let documentDate;
        //convert if invalid
        if (isNaN(Date.parse(currentDate))) {
          //yyyyMMdd case
          let datePattern = /(\d{4})(\d{2})(\d{2})/;
          documentDate = new Date(res.document.date.replace(datePattern, '$1-$2-$3'));
        } else {
          documentDate = currentDate;//*
        }

        let createdDate = new Date(res.document.created || res.document.date);//for future update?
        var updatedDate = res.document.updated;//(languageCode == "de" ? moment(res.document.updated).format(configService.DateFormatInGerman) : moment(res.document.updated).format(configService.DateFormatInEnglish));

        if (res.document.hasOwnProperty('types_available')) {
          var firstType = res.document.types_available[0];
          $scope.userType = firstType.locale;
          $scope.typesavailable = res.document.types_available;
        }
        $scope.typeList = res.document.collections;

        $scope.editForm = res.document;
        $scope.editForm.documentTitle = resp.data.document.title;
        $scope.editForm.text = resp.data.document.text;
        $scope.editForm.documentDate = documentDate;
        $scope.editForm.currentDate = documentDate;
        $scope.editForm.documentName = res.document.filename;
        $scope.editForm.createdDate = createdDate;//for future update?
        $scope.editForm.payDate = new Date();
        $scope.editForm.changedDate = new Date(updatedDate);
        $scope.editForm.workflow = resp.data.document.workflow;//
        $scope.editForm.workflowTips = resp.data.document.workflowTips;//
        $scope.editForm.userType = $scope.userType;//
        $scope.editForm.typesavailable = $scope.typesavailable;//
        $scope.editForm.typeList = res.document.collections;

        $scope.editForm.allCollections = documentsService.allCollections || res.document.collections;

        //console.log($scope.editForm.workflow);
        //TODO: test, remove when backend ready and leave newWorkFlow = true; remove deprecated layout (!newWorkflow)
        let newWorkFlow = false;

        if (newWorkFlow) {
          let workprocess = [{
                "id": 123,
                "name": "outgoing unilever invoice",
                "description": "Ausgangsrechnung an Unilever-Kunden",
                "type": "INVOICE",
                "direction": "OUT",
                "scope": "private"
              },
              {
                "id": 1,
                "name": "outgoing invoice",
                "description": "Ausgangsrechnung an den Kunden",
                "type": "INVOICE",
                "direction": "OUT",
                "scope": "public"
              },
              {
                "id": 2,
                "name": "incoming invoice",
                "description": "Eingangsrechnung vom Lieferanten",
                "type": "INVOICE",
                "direction": "IN",
                "scope": "public"
              }
          ];

          let workflow =  {
            "id" : 34,  // id of workflow
            "process" : {
              "id" : 1,
              "name" : "outgoing invoice",
              "description" : "an invoice is send to an customer"
            },
            "done" : [
              {  "step" : "sent", "desc" : "document has been sent", "when" : "2014-01-07 11:11:11", "who" : "John Doe" },
              {  "step" : "started", "desc" : "workflow has been started", "when" : "2014-01-07 11:11:11", "who" : "John Doe" }
            ],
            "next" : [
              {  "step" : "received", "desc" : "document has been received"  },
              {  "step" : "booked", "desc" : "document has been booked"  }
            ]
          };

          let wfcase = 1;

          if (wfcase == 1) {
            $scope.editForm.workprocess = workprocess;
            $scope.editForm.workflow = null;
          }

          if (wfcase == 2) {
            $scope.editForm.workprocess = null;
            $scope.editForm.workflow = workflow;
          }
          $scope.newWorkFlow = newWorkFlow;
        }

        //console.log($scope.editForm.workprocess);
        //console.log($scope.editForm.workflow);

        $scope.originalEditForm = angular.copy($scope.editForm);

      } else {
        let error = $filter('i18n')('error.5005');
        //console.log(resp);
        if (resp.error) {
          error = resp.error;
        }
        toastr.error(error, 'Error');
        $mdDialog.hide();//ok?
      }

      if ($scope.editFormWatch) {
        $scope.editFormWatch();
      }

      $scope.editFormWatch = $scope.$watch("editForm", function(newVal, oldVal){
        if (newVal && newVal!=oldVal) {
          if ($scope.originalEditForm) {
            if (angular.equals($scope.editForm, $scope.originalEditForm)) {
              //same data
              $scope.formChanged = false;
              thatScope.formChanged = false;
            } else {
              //changed
              $scope.formChanged = true;
              thatScope.formChanged = true;
            }
          } else {
            $scope.formChanged = true;
            thatScope.formChanged = true;
          }

        }
      }, true);

      //autofills:

      $scope.autoFillWFProcess();

    };

    documentsService.callDocumentById(documentId, key).then(function(resp) {
      $scope.populateData(resp);
    });

    //go to section
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
      //$scope.mdClosing = true;
      if ($scope.formChanged && !key) {
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

    //$scope.xlsheetNames = jsonSheets.names;
    //$scope.xldataSheets = jsonSheets.data;

    $scope.useSheet = function (index) {
      if ($scope.xldataSheets[index]) {
        $scope.xlsheetIndex = index;
        $scope.xldata = $scope.xldataSheets[index];
      }
    };
    $scope.hasSheetByIndex = function(index) {
      if ($scope.xldataSheets[index]) {
        return true;
      }
      return false;
    };

    $scope.applyXLIndex = function (index) {
      if ($scope.xldataSheets[index]) {
        $scope.xlprocessing = true;
        $scope.xlsheetIndex = index;
        $scope.xldata = $scope.xldataSheets[index];

        $scope.gridOptions.columnDefs = [];
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridOptions.data = $scope.xldata;
        $scope.xlsheet = $scope.xlsheetNames[index];

        $scope.xlprocessing = false;
      }
    };

    $scope.prevSheet = function () {
      if (index == 0) {
        return;
      }
      let index = $scope.xlsheetIndex - 1;
      $scope.applyXLIndex(index);
    };

    $scope.nextSheet = function () {
      let index = $scope.xlsheetIndex + 1;
        $scope.applyXLIndex(index);
    };

    $scope.onViewFile = function(inview) {
      if (inview) {
        $scope.showControls = true;
      } else {
        $scope.showControls = false;
      }
      return true;
    };

    $scope.documentLoaded = false;

    $scope.viewFile = function(inview) {

      if (!$scope.editForm) {
        return;
      }

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
        let extensions = ['.txt', '.log', '.md', '.readme' ];
        return extensions.some(function(element, index) {
          return (filename.length > element.length)  ? (filename.indexOf(element) === (filename.length - element.length)) : false;
        });
      }

      function isXLFile(filename) {
        let extensions = ['.xml', '.report', '.xl', '.xls', '.xlsx', '.ods' ];
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

      //console.log($scope.editForm.filename);

      let fileName = $scope.editForm.filename;
      //for test
      if (self.base64data && self.base64file) {
        fileName = self.base64file;
      }

        if (isPdfFile(fileName)) {
          if (fileName) {
            $scope.documentLoading = false;
            $scope.fileType = 'PDF';
            //$scope.pdfCurrentPage = $scope.getPdfCurrentPage();
            $scope.documentLoaded = true;
            //FileSaver.saveAs(data, fileName);
          } else {
            let error = $filter('i18n')('error.5005');
            toastr.error(error, 'Error');
          }
        } else if (isImage(fileName)) {
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
        } else if (isPlainText(fileName)) {
          $scope.fileType = 'TXT';

          documentsService.callFileById(documentId, docType, key).then(
            function(resp) {
              if (resp && resp.data.file) {
                let fileContents = resp.data.file.file;
                if (self.base64data && self.base64file) {
                  fileContents = self.base64data;
                }
                fileContents = atob(fileContents);
                //fileContents = fileContents.replace(/(?:\r\n|\r|\n)/g, '<br />');//test
                //$scope.textData = $sce.trustAsHtml(fileContents);
                $scope.textData = fileContents;
              }
            }
          );
          /*try {
            fileContents = atob(fileContents);
            $scope.textData = fileContents;
          } catch (e) {
            $scope.fileStatus = 'Unsupported';//todo
          }*/
          $scope.fileURL ='/';//todo
          $scope.documentLoading = false;
          $scope.documentLoaded = true;

          /*var img = document.getElementById('view_txt');
           img.src = $scope.documentUrl;
           img.onload = function() {
           $scope.documentLoading = false;

           };*/
        } else if (isXLFile(fileName)) {
          $scope.fileType = 'XL';
          /*try {
           fileContents = atob(fileContents);
           $scope.textData = fileContents;
           } catch (e) {
           $scope.fileStatus = 'Unsupported';//todo
          }*/
          self.initXLViewer();
          $scope.xlprocessing = true;


          documentsService.callFileById(documentId, docType, key).then(
            function(resp) {
              if (resp && resp.data.file) {
                let fileContents = resp.data.file.file;
                if (self.base64data && self.base64file) {
                  fileContents = self.base64data;
                }
                fileContents = atob(fileContents);
                //console.log(fileContents);

                let workbook = ViewerService.readXLdata(fileContents);
                //console.log(workbook);
                let jsonSheets = {};
                if (workbook) {
                  jsonSheets = ViewerService.workbooktoJson(workbook);
                  self.resetGrid();

                  $scope.xlsheetIndex = 0;//default

                  if (jsonSheets.data && jsonSheets.data[$scope.xlsheetIndex]) {
                    $scope.xldata = jsonSheets.data[$scope.xlsheetIndex];
                    $scope.xlsheet = jsonSheets.names[$scope.xlsheetIndex];

                    $scope.xlsheetNames = jsonSheets.names;
                    $scope.xldataSheets = jsonSheets.data;

                    $scope.gridOptions.columnDefs = [];
                    $scope.gridOptions.data = $scope.xldata;

                    $scope.xlprocessing = false;
                  }
                } else {
                  //error
                  console.log('error');
                }

                $scope.documentLoading = false;
                $scope.documentLoaded = true;
                //console.log(fileContents);
              }
          },
            function (resp) {
              $scope.documentLoading = false;
              $scope.documentLoaded = true;
            }
          );

          /*$scope.fileURL ='/';//todo
          $scope.documentLoading = false;
          $scope.documentLoaded = true;*/

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


      /*documentsService.callFileById(documentId, docType, key).then(function(resp) {
        if (resp && resp.data.file) {

          let fileContents = resp.data.file.file;
          let fileName = resp.data.file.filename;

          /!*fake text test*!/
          //fileContents = $scope.toBase64('Hello, guys! \n\r How are you?');
          //fileName = 'test.txt';

          if (isPdfFile(fileName)) {
            if (fileContents && fileName) {
              fileContents = $scope.base64toBlob(fileContents);
              var data = new Blob([fileContents]);
              $scope.fileURL = URL.createObjectURL(data);
              //$scope.documentLoading = true;

              /!*pdfDelegate
               .$getByHandle('pdf-container')
               .load($scope.fileURL)
               .then(function(item) {
               $scope.pdfTotalPages = pdfDelegate.$getByHandle('pdf-container').getPageCount();
               $scope.documentLoading = false;
               $scope.fileType = 'PDF';
               $scope.pdfCurrentPage = $scope.getPdfCurrentPage();
               $scope.documentLoaded = true;
               });*!/

              $scope.documentLoading = false;
              $scope.fileType = 'PDF';
              //$scope.pdfCurrentPage = $scope.getPdfCurrentPage();
              $scope.documentLoaded = true;

              //FileSaver.saveAs(data, fileName);
            } else {
              let error = $filter('i18n')('error.5005');
              toastr.error(error, 'Error');
            }
          } else if (isImage(fileName)) {
            if (fileContents) {
              /!*simple*!/
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

            /!*var img = document.getElementById('view_txt');
             img.src = $scope.documentUrl;
             img.onload = function() {
             $scope.documentLoading = false;

             };*!/
          } else {
            $scope.fileStatus = 'Unsupported';//todo
            $scope.documentLoading = false;//TODO
            $scope.documentLoaded = true;
          }

        } else {
          let error = $filter('i18n')('error.5006');
          toastr.error(error, 'Error');
          $scope.documentLoading = false;//TODO
          $scope.documentLoaded = true;
          $scope.documentError = true;
        }
      });*/
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

    this.initXLViewer = function() {
      $scope.xldata = [];
      $scope.columnDefs = [];
      $scope.gridApi = {};

      $scope.gridOptions = {
        /*columnDefs: $scope.columnDefs,*/
        /*data: 'xldata',*/
        onRegisterApi: function(gridApi){
          $scope.gridApi = gridApi;
        }
      };
    };

    this.resetGrid = function () {
      //$scope.$apply(function () {
        $scope.gridOptions.columnDefs = [];
        /*$scope.gridOptions = {
         columnDefs: [],
         data: []
         };*/
      //});
    };

    $scope.getFile = function (element) {
      $scope.xlprocessing = true;
      /*console.log(element, element.files);*/
      if (element.files && element.files[0]) {
        var fileReader = new FileReader();
        fileReader.onload = function (file) {
          let data = fileReader.result;
          let workbook = ViewerService.readXLdata(data);
          let jsonSheets = {};
          if (workbook) {
            jsonSheets = ViewerService.workbooktoJson(workbook);
          } else {
            //error
          }

          self.resetGrid();
          if (jsonSheets.data && jsonSheets.data[0]) {
            $scope.$apply(function () {
              $scope.xldata = jsonSheets.data[0];
              $scope.xlprocessing = false;
            });
          }
        };
        fileReader.readAsBinaryString(element.files[0]);
        //fileReader.readAsDataURL(element.files[0]);
      }
    };

    $scope.updateFileContents = function (element) {
      //debug and test only
      //$scope.xlprocessing = true;
      /*console.log(element, element.files);*/
      if (element.files && element.files[0]) {
        var fileReader = new FileReader();
        fileReader.onload = function (file) {
          self.base64data = btoa(fileReader.result);
          self.base64file = element.files[0].name;
        };
        fileReader.readAsBinaryString(element.files[0]);
        //fileReader.readAsDataURL(element.files[0]);
      }
    };

    $scope.downloadDoc = function (type) {
      $scope.showDLdBox = false;
      if (!type && $scope.editForm && $scope.editForm.filetypes) {
        type = $scope.editForm.filetypes['SIGNEDPDF'] || $scope.editForm.filetypes['ORIGINAL'];
      }
      documentsService.callFileById(documentId, type, key).then(function(resp) {
        if (resp && resp.data.file) {
          let fileContents = resp.data.file.file;
          let fileName = resp.data.file.filename;
          if (fileContents && fileName) {
            fileContents = $scope.base64toBlob(fileContents);
            var data = new Blob([fileContents]);
            FileSaver.saveAs(data, fileName);
          } else {
            let error = $filter('i18n')('error.5007');
            toastr.error(error, 'Error');
          }
        } else {
          let error = $filter('i18n')('error.5006');
          toastr.error(error, 'Error');
        }
      });
      //$mdDialog.hide();
    };

    $scope.toggleDownloadBox = function() {
      $scope.showDLdBox = !$scope.showDLdBox;
    };

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

    $scope.getDocumentIdWithOffset = function(offset) {
      let offsetDocumentId = null;
      //let thisDocId =
      angular.forEach(thatScope.docs, function (item, itemkey) {
        //manual list for now
        if (item.id == documentId) {
          //console.log('i o ',itemkey, offset);
          //(offset < 0) &&
          if ((itemkey + offset) <= 0) {
            $scope.hasNoPrevDocument = true;
          } else {
            $scope.hasNoPrevDocument = false;
          }

          //(offset > 0) &&
          if ((itemkey + offset + 1 >= thatScope.docs.length)) {
            $scope.hasNoNextDocument = true;
          } else {
            $scope.hasNoNextDocument = false;
          }

          if (thatScope.docs[itemkey + offset]) {
            offsetDocumentId = thatScope.docs[itemkey + offset].id;
          }
        }
        return;
      });

      //console.log($scope.hasNoPrevDocument,$scope.hasNoNextDocument);
      //console.log(documentId, offsetDocumentId);
      if (offsetDocumentId) {
        //console.log('load', offsetDocumentId);
        return offsetDocumentId;
      }
    };

    $scope.getDocumentIdWithOffset(0);


    $scope.loadDocumentWithOffset = function(offset) {
      let offsetDocumentId = $scope.getDocumentIdWithOffset(offset);
      if (offsetDocumentId) {
        $scope.loadDocument(offsetDocumentId);
      }
    };

    $scope.loadDocument = function(offsetdocumentId) {
      documentsService.callDocumentById(offsetdocumentId, key).then(
      function (getResp) {
        //success
        //console.log('resp', getResp);
        if (getResp.data.document) {
          $scope.populateData(getResp);//update form from response
          documentId = offsetdocumentId;
          $scope.formChanged = false;
          $scope.saveForm.$setPristine();
          $scope.saveForm.$setSubmitted();
          $stateParams.documentId = offsetdocumentId;
          let state = 'home.collection.document';
          if ($stateParams.accessKey) {
            //state = 'accesskeyDocumentView';
            if ($stateParams.collectionId && $stateParams.customerId) {
              state = 'accesskeyDocumentViewLong';
            } else {
              state = 'accesskeyDocumentView';
            }
          }
          $state.go(state, $stateParams, {reload: false, notify: false});
        }
      },
        function (resp) {
          //error
        }
      );
      //clear documents list cache

      //documentsService.cleanupRelatedLists('documents',documentId);//do not cleanup for now - we use modified cache

    };

    $scope.archiveOrRestore = function(editForm) {
      let form = this.saveForm;
      let permissionType = 'change';
      let data = {};
      let updateData = {};
      if (editForm.authorized && editForm.authorized.indexOf(permissionType) !== -1) {
        if (editForm.deleted) {
          //restore
          data.deleted = null;
        } else {
          //archive
          data.deleted = new Date().getTime();
        }

        let savedata = documentsService.callSaveDocumentById(documentId, data);
        savedata.then(function (saveResp) {
          if (saveResp.data && saveResp.data.response && saveResp.data.response.errorcode == '200') {
            if (!editForm.deleted) {
              toastr.success($filter('i18n')('customer.fileArchivedMsg'), 'Success');//translate
            } else {
              toastr.success($filter('i18n')('customer.fileRestoredMsg'), 'Success');//translate
            }

            editForm.deleted = data.deleted;

            //clear view document cache
            documentsService.callDocumentById(documentId, key, true);//reload, TODO: just clear db
            //clear documents list cache

            //documentsService.cleanupRelatedLists('documents',documentId);//do not cleanup for now - we use modified cache
            $scope.populateData(saveResp);//update form from response
            $scope.formChanged = false;
            $scope.saveForm.$setPristine();
            $scope.saveForm.$setSubmitted();

            let viewData = angular.merge(data, updateData);
            $scope.updateCurrentDocumentList(documentId, viewData);

            documentsService.updateRelatedDocumentCache('documents', documentId, viewData);

            //console.log($scope.saveForm);

          } else {
            //?
            let error = $filter('i18n')('error.5007');
            toastr.error(error, 'Error');
          }
        });
    }

    };

    $scope.resetWorkflowStep = function () {
      delete $scope.editForm.workflowNextStep;
    };

    $scope.workflowGoNextStep = function() {
      if ($scope.editForm.workflow && $scope.editForm.workflow.next && $scope.editForm.workflow.next[0]) {
        let nextStep = $scope.editForm.workflow.next[0];
        $scope.editForm.workflowNextStep = nextStep.step;
      }
    };

    hotkeys.add({
      combo: 'ctrl+s',
      description: 'Save form',
      callback: function($event) {
        $event.preventDefault();
        $scope.save($scope.editForm);
      }
    });

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

        if ($scope.editForm.workflowNextStep) {
          if ($scope.editForm.workflow.next && $scope.editForm.workflow.next[0] && $scope.editForm.workflow.next[0].step == $scope.editForm.workflowNextStep) {
            data.workflow = {'step': $scope.editForm.workflowNextStep};
          }
        }

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

        if (form.workprocessToStart && form.workprocessToStart.$dirty && form.workprocessToStart.$modelValue) {
          let wpToStart = form.workprocessToStart.$modelValue;
          data.workflow = {'process' : {'id' : wpToStart.id }};
          //updateData.type = {'value' : type, 'locale' : locale};
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
            $scope.populateData(saveResp);//update form from response
            $scope.formChanged = false;
            $scope.saveForm.$setPristine();
            $scope.saveForm.$setSubmitted();

            let viewData = angular.merge(data, updateData);
            $scope.updateCurrentDocumentList(documentId, viewData);

            documentsService.updateRelatedDocumentCache('documents',documentId, viewData);

            //console.log($scope.saveForm);

          } else {
            //?
            let error = $filter('i18n')('error.5007');
            toastr.error(error, 'Error');
          }
        });
      }
      /*documentsService.callSaveDocumentById(documentId, null, key).then(function(resp) {
       });*/
    }
  }
}
