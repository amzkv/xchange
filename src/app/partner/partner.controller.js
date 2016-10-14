export class PartnerController {
  constructor ($scope, $state, group, $stateParams, $mdDialog, PartnerService, collectionId, $window, toastr) {
    'ngInject';

    console.log(group);

    let self = this;
    $scope.isShowContact = true;
    $scope.contactInformations = [];

    $scope.invokeExternalLink = function(url) {
      $window.open('http://'+url, '_blank');
    };

    $scope.openPartnerInfo = function() {
      $scope.invokeExternalLink($scope.partnerInfo.url);
    };

    this.isValidURL = function(urlToValidate) {
      var message;
      let finalUrl = 'http://' + urlToValidate;
      var urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
      if (!urlRegExp.test(finalUrl)) {
        message = false;
      } else {
        message = true
      }
      return message;
    };

    $scope.addDocumentFile = function (fileObject) {
      return PartnerService.uploadDocument(fileObject, $scope.partnerInfo.id);
    };

    $scope.formatDate = function(date){
      return Date.parse(date);
    };

    $scope.onMaterialClose = function (event) {
      var index = 0, finalIndex = 0;

      angular.forEach($scope.partnerTypeList, function (item) {
        if (item.vendortype == $scope.partnerType) {
          finalIndex = index;
        }
        index++;
      });
      $scope.partnerIndex = finalIndex;
    };

    $scope.onSavePartner = function(trashMode) {

      function validate(partner) {
        var checkPartner = (partner.name1 == undefined || partner.name1.length == 0 ? false : true);
        var checkType = $scope.partnerInfo.hasOwnProperty('type');
        //in case from Account Type
        if ($scope.partnerIndex != -1) {
          $scope.partnerInfo['type'] = {
            value: 'CUSTOMER'
          };
          checkType = $scope.partnerInfo.hasOwnProperty('type');
        }

        return (checkPartner == true && checkType == true);
      }

      function getPartnerType(type) {
        var partnerType;
        switch (type) {
          case 0:
            partnerType = "CUSTOMER";
            break;
          case 1:
            partnerType = "LEAD";
            break;
          case 2:
            partnerType = "VENDOR";
            break;
        }
        return partnerType;
      }

      function getPartnerIndex(type) {
        var partnerIndex;
        switch (type) {
          case "CUSTOMER":
            $scope.lineClass = "partner-customer-underline";
            partnerIndex = 0;
            break;
          case "LEAD":
            $scope.lineClass = "partner-leads-underline";
            partnerIndex = 1;
            break;
          case "VENDOR":
            $scope.lineClass = "partner-vendor-underline";
            partnerIndex = 2;
            break;
          case "ACCOUNT":
            $scope.lineClass = "partner-accounts-underline";
            partnerIndex = 0;
            break;
        }
        return partnerIndex;
      }

      if (validate($scope.partnerInfo)) {
        if (!$scope.partnerIndex && $scope.partnerInfo.type && $scope.partnerInfo.type.value) {
          $scope.partnerIndex = getPartnerIndex($scope.partnerInfo.type.value);
        }
        $scope.partnerInfo['type'] = {
          value: getPartnerType($scope.partnerIndex)
        };

        PartnerService
          .updatePartnerInformation($scope.partnerInfo, "change", trashMode)
          .then(function (data) {
            if (!data.error) {
              toastr.success('Partner updated', 'Success');//??
            } else {
              toastr.error('Partner update failed', 'Error');//??
            }
          });
      }
    };

    $scope.onSelectforEdit = function (ev, contact) {

      if ($scope.contactInformations[contact.id]) {
        //clear
        delete $scope.contactInformations[contact.id];
        delete $scope.ContactInformation;
        delete $scope.currentContactId;
        return;
      }

      PartnerService.callContactByCollectionId(contact.id).then(function (result) {
        //contactServerAPI.contactInformation = result.contact;

        /*$mdDialog.show({
          controller: gfunction,
          templateUrl: 'app/contact/partials/contactEntryUI.tpl.html',
          targetEvent: ev,
        }).then(function (result) {
          if (result.contact != undefined) {
            $scope.ContactInformation = result.contact;
            updateContact(result.mode, result.traceMode);
          }
        });*/
        if (result.data.contact) {
            $scope.contactInformations[contact.id] = result.data.contact;
            $scope.ContactInformation = result.data.contact;
            $scope.currentContactId = contact.id;
        }
      });


    };

    $scope.getSelectedValue = function (text, index) {
      $scope.partnerIndex = index;
    };

    $scope.populateData = function(resp) {

      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
      };

      if (resp.data.partner) {
        let data = resp.data;
        $scope.partnerInfo = data.partner;
        $scope.isValidURL = self.isValidURL($scope.partnerInfo.url);

        if (data.partner.hasOwnProperty("contacts")) {
          $scope.contactCounter = data.partner.contacts.length;
        } else {
          $scope.contactCounter = 0;
        }

        $scope.partnerInfo.name1 = decodeURIComponent(data.partner.name1);
        $scope.currentPartner = data.partner;
        $scope.$broadcast("user:information", $scope.partnerInfo);
        $scope.partnerTypeList = [];
        $scope.documentCount = data.partner.hasOwnProperty("hasdocuments") ? data.partner.hasdocuments : 0;
        angular.forEach(data.partner.type_available, function (item) {
          $scope.partnerTypeList.push({ 'vendortype': item.locale });
        });
        if (data.partner.hasOwnProperty("type")) {
          $scope.partnerType = data.partner.type.locale;
        } else {
          $scope.partnerType = toTitleCase(($stateParams.param != 'ACCOUNT' ? $stateParams.param : ''));
          if ($scope.partnerType.length == 0) {
            $scope.partnerIndex = -1;
          }
        }
        $scope.collectionId = collectionId;
      }
    };

    let collectionType = 'CUSTOMER';


    PartnerService.callPartnerByCollectionId(null, null, collectionId, collectionType).then(function(resp) {
      console.log(collectionId);
      console.log(resp);
      $scope.populateData(resp);
    });

    $scope.onClickOk = function (trashMode) {
      /*if ($scope.mode == 1) {*/
      console.log('click ok');
      PartnerService.updateContacts($scope.ContactInformation, $scope.currentPartner.id, trashMode).then(function (result) {
          if (result.response.success) {
            toastr.success('Contact updated', 'Success');//??
            //$scope.onStartupLoadContactListOffLine(false, result.contact.id);
            //angular.element(document.getElementById("lblPartnerName")).text($scope.ContactInformation.firstname + ' ' + $scope.ContactInformation.lastname);
          } else {
            toastr.error('Contact update failed', 'Error');//??
            //$scope.ContactInformation = $scope.cloneObject;
            //$scope.showErrorToast(result.response.errormessage);
          }
        });
      /*} else {
        contactServerAPI.insertContacts($scope.ContactInformation, contactServerAPI.partnerInfo.id).then(function (result) {
          $scope.showSuccessToast($translate.instant('PARTNER_UPDATE_SUCCESSFULLY'));
          $mdDialog.hide(result);
        });
      }*/
    };

    $scope.onCloseDialog = function() {
      $scope.contactInformations = [];//??
      delete $scope.currentContactId;
      delete $scope.ContactInformation;
    };

    function validData(contactEntry) {
      return (contactEntry.lastName.$valid && contactEntry.eMail.$valid);
    }

    $scope.cancel = function (ev) {
      //$scope.mdClosing = true;
      if ($scope.formChanged && !key) {
        $scope.showSaveConfirmation = true;
      } else {
        $mdDialog.hide();
      }
    };

  }
}
