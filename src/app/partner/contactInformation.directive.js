/// <reference path="../../../scripts/angular.min.js" />

export function contactInformation() {
  'ngInject';

  let directive = {
     restrict: 'A',
     replace: true,
     scope:true,
     templateUrl: 'app/partner/contactInformation.tpl.html',
      controller: ContactInformationController,
      controllerAs: 'sm',
      bindToController: true
  };

  return directive;
}

class ContactInformationController {
  constructor () {
    'ngInject';

    // "this.creation" is available by directive option "bindToController: true"

  }
}

angular.module('xchange',[]).directive('contactInformation', [function () {
  return {
    restrict: 'A',
    replace: true,
    scope:true,
    templateUrl: 'app/partner/contactInformation.tpl.html',
  };
}])
  .directive('getSelectedValue', [function () {
    return {
      link: function (scope, element, attribute) {
        element.on("change", function () {
          scope.getSelectedValue(this.options[this.selectedIndex].text, this.selectedIndex);
        });
      }
    }
  }])
  .directive('fileDropHandler', [function () {
    return {
      restrict: "A",
      link: function (scope, elem) {
        window.addEventListener("dragover", function (e) {
          e = e || event;
          e.preventDefault();
        }, false);

        window.addEventListener("drop", function (e) {
          e = e || event;
          e.preventDefault();
        }, false);

        elem.find('li').on('dragenter', function (evt) {
          elem.addClass('partner-document-container-dragover');
        });

        elem.find('li').on('dragleave', function (evt) {
          elem.removeClass('partner-document-container-dragover');
        });

        elem.on('dragenter', function (evt) {
          elem.addClass('partner-document-container-dragover');
        });

        elem.on('dragleave', function (evt) {
          elem.removeClass('partner-document-container-dragover');
        });

        elem.bind('drop', function (evt) {
          evt.stopPropagation();
          evt.preventDefault();
          elem.removeClass('partner-document-container-dragover');
          //var files = evt.dataTransfer.files;
          var files = evt.dataTransfer.files;
          var currentIndex = 0;
          //scope.$parent.showDialog(evt);
          scope.$parent.$broadcast('start-uploading');
          uploadData(files[currentIndex], currentIndex, files, scope.partnerInfo.id, scope);
        });

        function uploadData(file, currentIndex, files, partnerID, scope) {
          var reader = new FileReader();
          var uploadFileList = [];
          reader.readAsDataURL(file);
          angular.forEach(files, function (item) {
            uploadFileList.push({ 'title': item.name.replace(/\\/g, '/').substring(item.name.lastIndexOf('/') + 1, item.name.lastIndexOf('.')) });
          });
          reader.onload = (function (theFile) {
            return function (e) {
              var newFile = {
                name: theFile.name,
                type: theFile.type,
                size: theFile.size,
                lastModifiedDate: theFile.lastModifiedDate,
                filedata: e.target.result.split(',')[1]
              }
              scope.addDocumentFile(newFile).then(function (result) {
                currentIndex++;
                if (currentIndex < files.length) {
                  var currentFile = files[currentIndex]
                  uploadData(currentFile, currentIndex, files, partnerID, scope);
                } else {
                  //scope.refreshDocumentList(uploadFileList);
                }
              });
            };
          })(file);
        }
      }
    }
  }]);
