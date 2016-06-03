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
  constructor ($mdSidenav, $rootScope, $state, ConfigService, LocalAccessService, $scope, documentsService, ViewModeService, $mdComponentRegistry, CONSTANT) {
    'ngInject';

    this.constant = CONSTANT;
    this.version = this.constant.VERSION;

    $scope.documentsService = documentsService;
    $scope.busy = documentsService.busy;

    $scope.$watch('documentsService.busy', function (newValue, oldValue, scope) {
      scope.busy = newValue;
    });

    let self = this;
    self.coreItems = null;

    $scope.$watch('documentsService.coreItems', function (newValue, oldValue) {
      if (newValue && newValue != oldValue) {
        self.coreItems = newValue;
      }
    });

    //requests remote server only once
    let coreItemsP = documentsService.callDocumentsCore();
    if (coreItemsP) {
      coreItemsP.then(function (response) {
        if (response.data) {
          self.coreItems = response.data.collections;
        }
      });
    }

    let appName = ConfigService.appName();//todo
    this.appConfig = {appName: appName};

    self.toggleMode = {
      thisState: ViewModeService.getState(),
      alterState:  ViewModeService.getAlterState()
    };

    self.cardMode = (self.toggleMode.thisState === 'Card');

    this.changeState = function(mode, alternateMode){
      "use strict";
      ViewModeService.setState(mode, alternateMode);
    };

    $rootScope.$on('customerStateChanged', function (event, data) {
      self.toggleMode = {
        thisState: data.thisState,
        alterState:  data.alterState
      };
      self.cardMode = (data.thisState === 'Card');
    });


    self.state = $state.current.name;
    self.parentState = $state.current.parentState;



    $rootScope.$on('$stateChangeSuccess', function(){
      "use strict";
      self.documentsView = ($state.current.name === 'customer');
      self.hideHeader = ($state.current.name === 'register' || $state.current.name === 'login' || $state.current.name === 'confirm');
    });


    this.toggle = function () {
      $mdSidenav('left').toggle();
    };

    this.toggleFilter = function () {
      $mdComponentRegistry.when('right').then(function(rightSidenav){
        rightSidenav.toggle();
      });
    };

    this.closeMenu = function () {
      $mdSidenav('left').close();
    };

    this.logout = function(){
      "use strict";
      LocalAccessService.removeCredentails();
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

  }
}
