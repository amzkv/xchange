export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    scope: {
      creationDate: '='
    },
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class NavbarController {
  constructor ($mdSidenav, $rootScope, $state, ConfigService, LocalAccessService, $document, hotkeys, $scope, documentsService, ViewModeService, $mdComponentRegistry, CONSTANT, $window, NotificationService, toastr, $timeout, $anchorScroll, $location) {
    'ngInject';

    this.constant = CONSTANT;
    this.displayOptions = false;
    this.version = this.constant.VERSION;
    this.hideHeader = true;
    this.storageCache = {};

    $scope.groupFilters = [];
    $scope.filterData = {};

    /*//TODO
    try {
      this.storageCache.core = JSON.parse($window.localStorage.getItem('core'));
      this.storageCache.collections = JSON.parse($window.localStorage.getItem('collections'));
    } catch (e) {
      //console.log('error:', e)
    }*/

    $scope.documentsService = documentsService;
    $scope.notificationService = NotificationService;
    $scope.localAccessService = LocalAccessService;
    $scope.busy = documentsService.busy;
    $scope.dataChanged = false;

    $scope.onExit = function() {
      if ($rootScope.infinicast) {
        $rootScope.infinicast.goOffline();
      }
    };

    $window.onbeforeunload =  $scope.onExit;

    $scope.$watch('documentsService.busy', function (newValue, oldValue, scope) {
      scope.busy = newValue;
    });

    let self = this;
    self.coreItems = null;
    self.accessKeyUser = null;
    self.currentClass = {};
    self.currentCollection = {};
    self.chatMessages = [];
    //this.notifications = $scope.notificationService.notifications;

    this.populateCurrentClass = function() {
      //console.log('populate params:',self.params);
      if (self.params.collectionId) {
        let collectionsbyClass = (documentsService.allCollections || documentsService.akCollections).filter(function (item) {
          return item.group.value == self.params.collectionId;
        });

        if (collectionsbyClass.length > 0) {
          self.currentClass = collectionsbyClass[0].group;
          documentsService.currentClass = self.currentClass;
          //console.log('class:', self.currentClass);
        }
      }
    };

    this.populateCurrentCollection = function() {
      //console.log('populate params:',self.params);
      if (self.params.customerId) {
        let collectionById = (documentsService.allCollections || documentsService.akCollections).filter(function (item) {
          return item.id == self.params.customerId;
        });

        if (collectionById.length > 0) {
          self.currentCollection = collectionById[0].title;
          documentsService.currentCollection = self.currentCollection;
          //console.log('collection:', self.currentCollection);
        }
      }
    };


    //add some hotkeys
    hotkeys.add({
      combo: 'ctrl+m',
      description: 'Toggle sidenav',
      callback: function($event) {
        $event.preventDefault();
        $mdSidenav('left').toggle();
      }
    });

    hotkeys.add({
      combo: 'ctrl+f',
      description: 'Toggle search',
      callback: function($event) {
        $event.preventDefault();
        self.toggleFilter();
      }
    });

    hotkeys.add({
      combo: 'ctrl+l',
      description: 'Toggle notifications',
      callback: function($event) {
        $event.preventDefault();
        self.displayNotifications ?  self.displayNotifications = false : self.displayNotifications = true;
      }
    });

    hotkeys.add({
      combo: 'ctrl+c',
      description: 'Toggle chat',
      callback: function($event) {
        $event.preventDefault();
        self.displayChat ?  self.displayChat = false : self.displayChat = true;
      }
    });


    /////////////////////notifications//////////////////
    //draft//
    this.reloadData = function() {
      $state.go($state.current, {}, {reload: true});
    };

    this.scrollToLastMessage = function () {
      if (self.displayChat) {
        $timeout(function () {
          let oldHash = $location.hash();
          $location.hash('chat-bottom');
          /*$anchorScroll.yOffset = 64;*/
          $anchorScroll();
          $location.hash(oldHash);
        }, 300);
      }
    };

    this.togglePartners =function() {

      if (!this.partners) {
        if (self.accessKeyUser && self.accessKeyUser.partners) {
          this.partners = self.accessKeyUser.partners;
          //$rootScope.infinicast.getData
          if (this.partners && angular.isArray(this.partners)) {
            angular.forEach(this.partners, function (partner) {
              //partner.uuid = 'a0dd085d-a8a1-4380-9085-fadf969ff384';//TODO: remove , test
              //console.log('userOnline', partner.uuid);
              let partnerStatus = $rootScope.infinicast.getDataPoolRecordByPathName('userOnline', partner.uuid);
              partner.online = null;
              if (partnerStatus.status == 'online') {
                partner.online = true;
              }
              if (self.currentRemoteChatUser && self.currentRemoteChatUser.uuid == partner.uuid) {
                self.currentRemoteChatUser.online = partner.online;
              }
              partner.lastSeen = partnerStatus.time;
              //$rootScope.infinicast.getDataByPathName('userOnline', null, partner.uuid)
            });
          }
        }
        this.displayPartners = !this.displayPartners;
      } else {
        this.displayPartners = !this.displayPartners;
      }
    };

    this.chatPartner = function (partner, notification) {
      //console.log(partner);
      //let remoteUuid = partner.uuid;//to test it
      //partner.uuid = 'a0dd085d-a8a1-4380-9085-fadf969ff384';//TODO: remove after test
      if (self.accessKeyUser && self.accessKeyUser.partners) {
        this.partners = self.accessKeyUser.partners;
        //accesskey
          if (partner) {
            //using partner list
            notification = $rootScope.infinicast.getDataPoolRecordByPathName('userOnline', partner.uuid);
            notification.partnerUuid = notification.idForPath;//??
            //this.currentRemoteChatUser = partner;
            //self.displayPartners = false;
          }
          //using online notification
          if (notification.partnerUuid && notification.chatid) {

            //self.currentRemoteChatUser.online = (notification.status == 'online');

            //console.log('notification', notification);
            let partnerId = notification.chatid.replace(/\D/g, '');
            self.currentPartnerId = partnerId;
            self.currentChatId = notification.chatid;
            angular.forEach(self.accessKeyUser.partners, function(thePartner) {
              if (thePartner.uuid == notification.partnerUuid) {
                //console.log('ok');
                self.currentRemoteChatUser = thePartner;
                let partnerId = notification.chatid.replace(/\D/g, '');//chatid to userid
                self.currentPartnerId = partnerId;
                self.currentChatId = notification.chatid;
                self.currentRemoteChatUser.fullname = notification.name;
                //self.displayPartners = false;
                //self.togglePartners();

                //let partnerStatus = $rootScope.infinicast.getDataPoolRecordByPathName('userOnline', thePartner.uuid);
                //if (self.currentRemoteChatUser && self.currentRemoteChatUser.uuid == thePartner.uuid) {
                  self.currentRemoteChatUser.online = (notification.status == 'online');

                //}

                if ($rootScope.infinicast) {
                  //$rootScope.infinicast.listen();
                  //console.log('infinicast', LocalAccessService.getPartnerIds());
                  let partners = LocalAccessService.getPartnerIds();
                  //dynamically inject ids to subscribe
                  let chatids = [notification.chatid];
                  //chatids.push();
                  $rootScope.infinicast.updatePathConfig('userChat', 'ids', chatids);
                  $rootScope.infinicast.updatePathConfig('userOnline', 'ids', partners);
                  $rootScope.infinicast.isAccessKeyUser = true;
                  $rootScope.infinicast.listen(true);
                  //console.log($rootScope.infinicast);
                }

                //partner.lastSeen = partnerStatus.time;

                self.displayPartners = false;
                return;
              }
            });
          }
        //}
      } else {
        //regular
        if ($rootScope.infinicast) {

          //console.log('notification::',notification);

          let chatids = [$rootScope.infinicast.getChatId(),notification.chatid];//my chatid and notifier's
          //notifier doesnt know me, so we need to sub to both chatid or only notifier's
          //but there can be the case of simulateus chat initiation so we leave both
          /*

          */

          //notification format: rendered notification

          let partnerId = notification.chatid.replace(/\D/g, '');//chatid to userid
          self.currentPartnerId = partnerId;
          self.currentChatId = notification.chatid;
          self.currentRemoteChatUser = {
            "fullname": notification.name,
            "uuid": notification.partnerUuid
          };

          //console.log('chatPartner: notification',notification);

          if (notification.userid) {
            self.currentRemoteChatUser.userid = notification.userid;
          }

          $rootScope.infinicast.updatePathConfig('userChat', 'ids', chatids);
          $rootScope.infinicast.isAccessKeyUser = false;
          $rootScope.infinicast.listen(true);

          self.currentRemoteChatUser.online = (notification.status == 'online');

         /* let partnerStatus = $rootScope.infinicast.getDataPoolRecordByPathName('userOnline', thePartner.uuid);
          //if (self.currentRemoteChatUser && self.currentRemoteChatUser.uuid == thePartner.uuid) {
          self.currentRemoteChatUser.online = (partnerStatus.status == 'online');*/

          /*if (self.currentRemoteChatUser && self.currentRemoteChatUser.userid == notification.userid) {
            self.currentRemoteChatUser.online = (notification.status == 'online');
            //partner.lastSeen = partnerStatus.time;
          }*/

          //partner.lastSeen = notification.time;

        }
      }
    };

    this.sendMessage = function() {
      if (!self.currentMessage) {
        return;
      }
      if (self.accessKeyUser && self.accessKeyUser.partners) {
        if (self.currentRemoteChatUser) {
          $rootScope.infinicast.setDataByPathName('userChat',
            {
              "fromUserType" : "initiator",
              "accessKeyUser" : true,
              /*"idForPath" : self.currentRemoteChatUser.uuid,*/
              "idForPath" : self.currentChatId,
              "partnerName" : self.currentRemoteChatUser.name,/*send it to partner...*/
              "fullname" : self.accessKeyUser.name,
              "company" : self.accessKeyUser.company,
              'text' : self.currentMessage,
              'time' : new Date().getTime()
            }
          );
        }
      } else {
        //move to run once
        let fullname = '';
        if ($rootScope.infinicast.user.firstname && $rootScope.infinicast.user.lastname) {
          fullname = $rootScope.infinicast.user.firstname + ' ' + $rootScope.infinicast.user.lastname;
        }

        let outgoingMessage = {
          "idForPath" : self.currentChatId || $rootScope.infinicast.getChatId(),
          'text' : self.currentMessage,
          'time' : new Date().getTime(),
          'fullname' : fullname
        };


       // if (self.currentChatId!=$rootScope.infinicast.getChatId()) {
        if (self.currentChatId) {
          //console.log('initiator');
          outgoingMessage.fromUserType = 'initiator';

          //outgoingMessage.fromUserType = 'accessKey';
          //outgoingMessage.partnerName = self.currentRemoteChatUser.name;/*send it to partner...*/
          outgoingMessage.company = $rootScope.infinicast.user.displayname;
        } else {
          outgoingMessage.fromUserType = 'acceptor';
          outgoingMessage.company = $rootScope.infinicast.user.displayname;
        }

        //console.log('message:', outgoingMessage, self.currentChatId, $rootScope.infinicast.getChatId());

        $rootScope.infinicast.setDataByPathName('userChat',
          outgoingMessage
        );
      }

      $timeout(function(){
        self.currentMessage = '';
      },100);

    };

    this.handleCtrlEnter = function (event) {
      if (event.keyCode == 13 && event.ctrlKey) {
        this.sendMessage();
      }
    };

    if ($rootScope.infinicast) {
      //collections changes
      $rootScope.infinicast.setRootScope($rootScope);
      //can be refactored like this:
      // getPathNames -> addNotificationListenerByName(pathName);

      function addChatMessage(incMsg, me) {

        /*if (!incMsg.uuid) {
          self.chatIncomingUser = {
            name: incMsg.name,
            company: incMsg.company
          }
        }*/
        //TODO: constants
        let message = angular.copy(incMsg);

        if (incMsg.fromUserType) {
          if (incMsg.fromUserType == 'initiator' && !me) {
            //console.log('ak message');
            self.chatIncomingUser = self.chatIncomingUser || {};

            self.chatIncomingUser.fullname = incMsg.fullname;
            self.chatIncomingUser.company = incMsg.company;
            self.chatIncomingUser.partnerName = incMsg.fullname;
            self.chatIncomingUser.online = true;
            if (incMsg.accessKeyUser) {
              self.chatIncomingUser.accessKeyUser = true;
            }
            //message.partnerName = incMsg.partnerName;
          }
          if (incMsg.fromUserType == 'acceptor') {
            //console.log('partner message');
            /*self.chatIncomingUser = {
              name: incMsg.name,
              company: incMsg.company
            }*/

            /*self.chatIncomingUser = {
              name: incMsg.fullname,
              company: incMsg.company,
              partnerName: incMsg.fullname
            };*/

            if (self.chatIncomingUser) {
              message.partnerName = self.chatIncomingUser.partnerName;
            } else {
              if (self.currentRemoteChatUser) {
                message.partnerName = self.currentRemoteChatUser.fullname;
              }
            }
            //message.partnerName = self.chatIncomingUser.partnerName;
          }
          if (me) {
            message.me = true;
          } else {
            /*console.log(message);
            if ()*/
            if (self.currentRemoteChatUser) {
              if (message.fullname) {
                self.currentRemoteChatUser.fullname = message.fullname;
              }
              if (message.company) {
                self.currentRemoteChatUser.company = message.company;
              }
            }
          }

          //console.log('addMessage:', message);

          self.chatMessages.push(message);
          self.scrollToLastMessage();
        }
      }

      angular.forEach($rootScope.infinicast.getPaths(), function (item) {
        if (item.viewType == 'notification') {
          let scopeWatch = 'infinicast.dataPool.' + item.name;
          $rootScope.$watch(scopeWatch, function (newValue, oldValue, scope) {
            if (newValue != null) {
              //console.log('notification', scopeWatch, newValue, oldValue);
              let notification = $scope.notificationService.processNotificationData(item.name, newValue, $rootScope.infinicast.user.userid);
              $scope.notificationService.addNotification(notification);

              if (notification.usedUrls && notification.usedUrls.length > 0) {
                angular.forEach(notification.usedUrls, function (url) {
                  if ($state.href($state.current.name, $state.params).indexOf(url) !== -1) {
                    $scope.dataChanged = true;
                  }
                });
                if ($scope.dataChanged) {
                  toastr.warning('Displayed data has been changed', 'Attention');
                }
              }
              /*
              if ($state.href($state.current.name, $state.params).indexOf(notification.url) !== -1) {
                $scope.dataChanged = true;
                toastr.warning('Displayed data has been changed', 'Attention');
              }
              */

            }
          }, true);
        }
        if (item.viewType == 'chat') {
          let scopeWatch = 'infinicast.dataPool.' + item.name;
          $rootScope.$watch(scopeWatch, function (newValue, oldValue, scope) {
            if (newValue != null) {
              //console.log('incoming chat message', newValue);
              if (self.currentRemoteChatUser) {
                //me
                var messageForAcceptor = newValue[self.currentChatId] || newValue[$rootScope.infinicast.getChatId()];
                //var messageForAcceptor = newValue[self.currentRemoteChatUser.uuid];
                if (messageForAcceptor) {
                  //console.log('add Message:', messageForAcceptor);
                  if (messageForAcceptor.fromUserType == 'acceptor') {
                    addChatMessage(messageForAcceptor);
                  } else {
                    addChatMessage(messageForAcceptor, true);
                  }
                }
              } else {
                if (newValue.fromUserType == 'initiator') {
                  addChatMessage(newValue);
                } else {
                  addChatMessage(newValue, true);
                }
              }
            }
          }, true);
        }

        if (item.viewType == 'online') {
          let scopeWatch = 'infinicast.dataPool.' + item.name;
          $rootScope.$watch(scopeWatch, function (newValue, oldValue, scope) {
            if (newValue != null) {
              //console.log('incoming online status', newValue, self.partners);
              //exclusive notification

              if (newValue.status) {
                //regular
                //single

                //console.log('single');
                if (newValue.fromChange && newValue.status == 'online' && newValue.chatid!= $rootScope.infinicast.getChatId()) {
                  $scope.notificationService.addNotification($scope.notificationService.processNotificationData(item.name, newValue, newValue.uuid));
                }

                /*partner.online = false;
                if (newValue.status == 'online') {
                  partner.online = true;
                }*/
                //console.log('onlineStatus', newValue, self.currentRemoteChatUser);

                if (newValue.fromChange && self.currentRemoteChatUser && self.currentRemoteChatUser.userid == newValue.userid) {
                  self.currentRemoteChatUser.online = (newValue.status == 'online');
                  //partner.lastSeen = partnerStatus.time;
                }

                if (newValue.fromChange && self.chatIncomingUser && self.chatIncomingUser.fullname == newValue.name) {
                  self.chatIncomingUser.online = (newValue.status == 'online');
                  //partner.lastSeen = partnerStatus.time;
                }

                /*if (newValue.fromChange) {
                  let notification = $scope.notificationService.processNotificationData(item.name, newValue);
                  $scope.notificationService.addNotification(notification);
                }*/
              } else {
                //multiple
                angular.forEach(newValue, function(partnerStatus, partnerUuid) {
                  if (partnerStatus.fromChange && partnerStatus.status == 'online') {
                    $scope.notificationService.addNotification($scope.notificationService.processNotificationData(item.name, partnerStatus, partnerUuid));
                  }
                });
              }
              /*let notification = $scope.notificationService.processNotificationData(item.name, newValue);
              $scope.notificationService.addNotification(notification);*/
              //console.log('pre-partners', self.partners);
              if (self.partners) {
                //console.log('partners');
                //newValue[self.currentRemotePartner.uuid];
                //multiple case
                angular.forEach(newValue, function(partnerStatus, partnerUuid) {
                  //console.log(partnerUuid, partnerStatus);
                  /*if (partnerStatus.fromChange && partnerStatus.status == 'online') {
                    let notification = $scope.notificationService.processNotificationData(item.name, partnerStatus, partnerUuid);
                    $scope.notificationService.addNotification(notification);
                  }*/

                  //??
                  if (partnerStatus.fromGet) {
                    return;
                  }

                  angular.forEach(self.partners, function (partner) {
                    partner.online = false;
                    if (partnerStatus.status == 'online') {
                      partner.online = true;
                    }
                    if (self.currentRemoteChatUser && self.currentRemoteChatUser.uuid == partner.uuid) {
                      self.currentRemoteChatUser.online = partner.online;
                    }
                    partner.lastSeen = partnerStatus.time;
                  });
                });
              }
            }
          }, true);
        }
      });
    }

    this.testDataUpdate = function() {
      console.log('test');
      let time = new Date();
      //$rootScope.infinicast.setDataByUser('user', 'collection', {"test":time});

      let oldFormatData = {
        "id" : 394247,
        "title" : "invoice received",
        "group" : {
          "locale" : "Workflow",
          "value" : "WORKFLOW"
        }
      };

      let newFormatData = {
        "document": {
          "id": 57905,
          "title": "Verkauf_-_Rechnung_Sa_lzer_1",
          "type": {
            "value": "INVOICE",
            "locale": "Rechnung"
          },
          "when": "2016-10-03 13:25:02",
          "collections": [
            {
              "action": "dropped",
              "id": 394247,
              "title": {
                "value": "INVOICE versendet",
                "locale": "INVOICE versendet"
              },
              "group": {
                "value": "WORKFLOW",
                "locale": "Workflow"
              }
            },
            {
              "action": "new",
              "id": 438602,
              "title": {
                "value": "INVOICE eingegangen",
                "locale": "INVOICE eingegangen"
              },
              "group": {
                "value": "WORKFLOW",
                "locale": "Workflow"
              }
            }
          ]
        }
      };

      $rootScope.infinicast.setDataByPathName('userCollection', newFormatData
      );

      /*$rootScope.infinicast.setDataByUser('user', 'collection',
        { "id" : 394247,
          "title" : "invoice received #2",
          "group" : {
            "locale" : "Workflow",
            "value" : "WORKFLOW"
          }
      });*/

    };

    this.testChatUpdate = function() {
      console.log('test');
      let time = new Date();
      $rootScope.infinicast.setDataByPathName('userChat',
        { "name" : 'n3m0',
          "company" : "n3m0 c0mpany",
          'text' : 'Hello there!',
          'time' : new Date().getTime()
        });


      $rootScope.infinicast.setDataByPathName('userChat',
        { "name" : 'Namename Namenamenamename',
          "company" : "name company",
          'text' : 'Curabitur congue lorem quis dolor blandit hendrerit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;Vivamus bibendum efficitur tortor, non porttitor magna imperdiet in.',
          'time' : new Date().getTime()
        });

      /*$rootScope.infinicast.setDataByUser('user', 'collection',
       { "id" : 394247,
       "title" : "invoice received #2",
       "group" : {
       "locale" : "Workflow",
       "value" : "WORKFLOW"
       }
       });*/

    };

    this.testOnlineUpdate = function(status) {
      console.log('test online');
      let time = new Date();
      status = status || 'online';
      let onlineData = {
        'status' : status,
        'time' : new Date().getTime()
      };
      if ($rootScope.infinicast.user) {
        onlineData.idForPath = $rootScope.infinicast.user.account.uuid;
        onlineData.name = $rootScope.infinicast.user.firstname + ' ' + $rootScope.infinicast.user.lastname;
        onlineData.chatid = $rootScope.infinicast.getChatId();
      }
      //console.log(onlineData);

      $rootScope.infinicast.setDataByPathName('userOnline', onlineData);
    };

    //////////////////end notifications///////

    this.hideBoxes = function() {
      self.displayOptions = false;
      self.displayNotifications = false;
      self.displayChat = false;
    };

    this.anyBoxIsShown = function() {
      return (self.displayOptions || self.displayNotifications || self.displayChat);
    };

    $scope.$watch('documentsService.allCollections', function (newValue, oldValue, scope) {
      if (newValue) {
        self.populateCurrentClass();
        self.populateCurrentCollection();
      }
    }, true);

    $scope.$watch('documentsService.akCollections', function (newValue, oldValue, scope) {
      if (newValue) {
        self.populateCurrentClass();
        self.populateCurrentCollection();
      }
    }, true);

    $scope.$watch('documentsService.coreItems', function (newValue, oldValue) {
      if (newValue && newValue != oldValue) {
        self.coreItems = newValue;
      }
    });

    this.applySearchQuery =function(value) {
      $scope.searchField = value;
    };

    $scope.clearSearchField = function () {
      $scope.searchField = '';
      documentsService.searchFilter = '';
    };


    /*$scope.$watch('documentsService.searchFilter', function (newValue, oldValue) {
      //$scope.searchField = newValue;
      console.log('doc.sf');
      if (newValue === oldValue) { return; }
      //$scope.searchField = newValue;
      //$timeout(self.applySearchQuery, 350);
    });*/

    $scope.$watch('localAccessService.accessKeyUser', function (newValue, oldValue, scope) {
      if (newValue && newValue != oldValue) {
        self.accessKeyUser = newValue;
      }
    }, true);
    //requests remote server only once

    /*let coreItemsP = documentsService.callDocumentsCore();
    if (coreItemsP) {
      coreItemsP.then(function (response) {
        if (response.data) {
          self.coreItems = response.data.collections;
        }
      });
    }*/

    let appName = ConfigService.appName();//todo
    this.appConfig = {appName: appName};

    self.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    //self.cardMode = (self.toggleMode.thisState === 'Card');
    self.cardMode = (self.toggleMode.thisState === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));

    this.changeState = function(mode, alternateMode){
      "use strict";

      //quick fix
      let vwM = LocalAccessService.getUserSetting('viewMode');
      if (vwM && vwM == mode) {
        /*let nM = mode;
        let naM = alternateMode;
        mode = naM;
        alternateMode = nM;*/
        [mode, alternateMode] = [alternateMode, mode];
      }
      LocalAccessService.setUserSetting('viewMode', mode);
      ViewModeService.setState(mode, alternateMode);

    };

    $rootScope.$on('customerStateChanged', function (event, data) {
      self.toggleMode = {
        thisState: data.thisState,
        alterState:  data.alterState
      };
      //self.cardMode = (data.thisState === 'Card');
      self.cardMode = ('Card' === (LocalAccessService.getUserSetting('viewMode') || ViewModeService.getDefaultViewMode()));
    });


    self.state = $state.current.name;
    self.parentState = $state.current.parentState;



    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, from, fromState){
      "use strict";
      $scope.dataChanged = false;
      $rootScope.globalState = toState.name;//???
      //console.log('scs', $rootScope.globalState);
      self.documentsView = ($state.current.name === 'home.collection.customer');
      self.hideHeader = ($state.current.name === 'register' || $state.current.name === 'login' || $state.current.name === 'confirm');
      if (!self.hideHeader && !self.coreItems) {
        let coreItemsP = documentsService.callDocumentsCore();
        if (coreItemsP) {
          coreItemsP.then(function (response) {
            if (response.data) {
              self.coreItems = response.data.collections;
            }
          });
        }
      }
      /*fill all collections(task)*/

      if (!toParams.accessKey && !self.hideHeader && !documentsService.allCollections) {
        let allCollections = documentsService.callDocumentAllCollections();
        if (allCollections) {
          allCollections.then(
            function (response) {
            if (response.data) {
              documentsService.allCollections = response.data.collections;
            }
            setState($state.current.name, from.name, fromState, $state.current.parentState, toParams);
              return;
            },  function (errresp) {

                }
          );
        } else {
          setState($state.current.name, from.name, fromState, $state.current.parentState, toParams);
          return;
        }
      } else {
        setState($state.current.name, from.name, fromState, $state.current.parentState, toParams);
        return;
      }
    });


    this.toggle = function () {
      $mdSidenav('left').toggle();
    };

    $scope.isAppFullscreen  = function() {
      //console.log(window.innerHeight == screen.height, window.innerHeight, screen.height, window.outerHeight);
      return !!(document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement);
      //return (window.innerHeight == screen.height);
    };

    $scope.isFullScreen = $scope.isAppFullscreen();

    $scope.fullScreen = function() {

      function launchIntoFullscreen(element) {
        if(element.requestFullscreen) {
          element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }

      function exitFullscreen() {
        if(document.exitFullscreen) {
          return document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
          return document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
          return document.webkitExitFullscreen();
        }
      }

      /*if (exitFullscreen()) {
       launchIntoFullscreen(document.documentElement);
       }
       else {
       launchIntoFullscreen(document.documentElement);
       }
       $scope.isFullScreen = !$scope.isFullScreen;*/

      if ($scope.isFullScreen) {
        exitFullscreen();
        $scope.isFullScreen = $scope.isAppFullscreen();
      } else {
        launchIntoFullscreen(document.documentElement);
        $scope.isFullScreen = $scope.isAppFullscreen();
      }
    };

    this.toggleFilter = function () {
      $mdComponentRegistry.when('right').then(function(rightSidenav){
        rightSidenav.toggle();
      });
    };
    $scope.showEmptyCollections = false;
    this.toggleEmptyCollectionFiltering = function() {
      $scope.showEmptyCollections = !$scope.showEmptyCollections;
      ViewModeService.showEmptyCollections = $scope.showEmptyCollections;
    };

    this.closeMenu = function () {
      $mdSidenav('left').close();
    };

    this.logout = function(){
      "use strict";
      documentsService.clearCache();
      LocalAccessService.removeCredentails();
      $rootScope.loggedOut = true;
      $state.go('login');
    };

    function setState(state, prev, params, parent, toParams){
      "use strict";
      self.state = state;
      self.previousState = prev;
      self.previousStateParams = params;
      if (parent) {
        self.parentState = parent;
      }
      if (toParams) {
        self.params = toParams;
      }

      if (self.state == 'home.collection.customer' || self.state == 'accesskeyDocument') {

        $scope.groupFilters = [];
        $scope.filterData = {};
        $scope.shownGroup = null;

        //$scope.filters = $rootScope.filters;
      } else {
        $scope.filters = null;
      }

      if (documentsService.allCollections || documentsService.akCollections) {
        self.populateCurrentClass();
        self.populateCurrentCollection();
      }
    }

    /*let listener = $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, from, fromState){
        console.log('NavbarController listener $stateChangeSuccess');
        setState($state.current.name, from.name, fromState, $state.current.parentState, toParams);
      });*/

    let filterWatch = $rootScope.$watch('filters',
      function(newValue, oldValue, scope){
        $scope.filters = $rootScope.filters;
      }
    );

    this.navigateBack = function(){
      "use strict";
      if(self.previousState && self.previousStateParams){
        $state.go(self.previousState, {id: self.previousStateParams.id})
        $rootScope.globalState = self.previousState;//test it
      }
    };

    this.navigateUp = function(){
      "use strict";

      if(self.parentState){
        if (self.parentState == self.previousState) {
          //{id: self.previousStateParams.id}
          $state.go(self.previousState, self.previousStateParams);
          $rootScope.globalState = self.previousState;//test it
          $rootScope.stateInfo = {};//test it
        } else {
          $state.go(self.parentState, self.params);
          $rootScope.globalState = self.parentState;//test it
          $rootScope.stateInfo = {};//test it
        }
        //????
        if ($rootScope.globalState == 'home') {
          documentsService.currentClass = {};
        }
        if ($rootScope.globalState == 'home.collection') {
          documentsService.currentCollection = {};
        }
      }
    };

    this.navigateHome = function(){
      "use strict";
      if (self.accessKeyUser) {
        if (self.state !== 'accesskeyHome'){
          $state.go('accesskeyHome', {'accessKey' : self.params.accessKey});
        }
      } else {
        if (self.state !== 'home'){
          $state.go('home',self.params);
          $rootScope.globalState = 'home';//test it
        }
      }
    };

    //filter funcs

    //documentsService.filter = null;//??


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
      return $scope.shownGroup === group;
    };

    $scope.search = function(keyCode) {
      //console.log('search', keyCode, $scope.searchField);
      if (keyCode == 13) {
        //total search
        $state.go('search', {'searchPhrase': $scope.searchField});
      } else {
        //filter
        documentsService.searchFilter = $scope.searchField;
      }

    };

    $scope.applyFilter = function () {

      //$scope.documentsService.filter = null;

      $scope.collectionFilter = [];
      $scope.collectionFilterGroupTitles = [];

      if (typeof $scope.filterData.titleIds != 'undefined') {
        angular.forEach($scope.filterData.titleIds, function (items, groupKey) {
          angular.forEach(items, function (active, id) {
            if (active) {
              if (!$scope.groupFilters[groupKey]) {
                $scope.groupFilters[groupKey] = id;
              } else {
                if ($scope.groupFilters[groupKey] != id) {
                  $scope.filterData.titleIds[groupKey][$scope.groupFilters[groupKey]] = false;//uncheck previous
                  $scope.groupFilters[groupKey] = id;//set new
                }
              }
            } else {
              if ($scope.groupFilters[groupKey] == id) {
                $scope.groupFilters[groupKey] = null;//none checked
              }
            }
          });
        });
      }

      //prepare filter
      angular.forEach($scope.groupFilters, function (val, key) {
        if (val) {
          $scope.collectionFilter.push({collection: val});
        }
      });

      //console.log('collectionFilter', $scope.collectionFilter);
      //pass filter to doc service
      documentsService.filter = $scope.collectionFilter;
      if (self.params.customerId) {
        documentsService.filterCustomerId = self.params.customerId;
      }
      if (self.params.accessKey) {
        //console.log($rootScope, self.params.accessKey);
        documentsService.filterAccessKey = self.params.accessKey;
      }


      //console.log('filter', documentsService.filter);

      /*
      documentsService.callDocumentByOneCollection(self.params.customerId)
        .then(function(resp) {
          if (resp.data.response.success) {
            console.log('response');
            $scope.docs = resp.data.documents;
          }
        });
      */

      //$mdSidenav('right').close();
    };

  }
}
