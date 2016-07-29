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
  constructor ($mdSidenav, $rootScope, $state, ConfigService, LocalAccessService, $scope, documentsService, ViewModeService, $mdComponentRegistry, CONSTANT, $window) {
    'ngInject';

    this.constant = CONSTANT;
    this.displayOptions = false;
    this.version = this.constant.VERSION;
    this.storageCache = {};

    $scope.groupFilters = [];
    $scope.filterData = {};

    //TODO
    try {
      this.storageCache.core = JSON.parse($window.localStorage.getItem('core'));
      this.storageCache.collections = JSON.parse($window.localStorage.getItem('collections'));
    } catch (e) {
      //console.log('error:', e)
    }

    $scope.documentsService = documentsService;
    $scope.localAccessService = LocalAccessService;
    $scope.busy = documentsService.busy;

    $scope.$watch('documentsService.busy', function (newValue, oldValue, scope) {
      scope.busy = newValue;
    });

    let self = this;
    self.coreItems = null;
    self.accessKeyUser = {};

    $scope.$watch('documentsService.coreItems', function (newValue, oldValue) {
      if (newValue && newValue != oldValue) {
        self.coreItems = newValue;
      }
    });

    $scope.$watch('documentsService.searchFilter', function (newValue, oldValue) {
      $scope.searchField = newValue;
    });

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



    $rootScope.$on('$stateChangeSuccess', function(){
      "use strict";
      self.documentsView = ($state.current.name === 'customer');
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
      if (!self.hideHeader && !documentsService.allCollections) {
        let allCollections = documentsService.callDocumentAllCollections();
        if (allCollections) {
          allCollections.then(function (response) {
            if (response.data) {
              documentsService.allCollections = response.data.collections;
            }
          });
        }
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

      if (self.state == 'customer') {

        $scope.groupFilters = [];
        $scope.filterData = {};
        $scope.shownGroup = null;

        $scope.filters = $rootScope.filters;
      } else {
        $scope.filters = null;
      }
    }

    let listener = $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, from, fromState){
        setState($state.current.name, from.name, fromState, $state.current.parentState, toParams);
      });

    this.navigateBack = function(){
      "use strict";
      if(self.previousState && self.previousStateParams){
        $state.go(self.previousState, {id: self.previousStateParams.id})
      }
    };

    this.navigateUp = function(){
      "use strict";

      if(self.parentState){
        if (self.parentState == self.previousState) {
          //{id: self.previousStateParams.id}

          $state.go(self.previousState, self.previousStateParams);
        } else {
          $state.go(self.parentState, self.params);
        }
      }
    };

    this.navigateHome = function(){
      "use strict";
      if (self.state !== 'home'){
        $state.go('home');
      }
    }

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
      documentsService.filterCustomerId = self.params.customerId;

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
