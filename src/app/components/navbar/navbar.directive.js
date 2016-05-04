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
  constructor ($mdSidenav, $rootScope, $state, ConfigService, LocalAccessService) {
    'ngInject';

    var appName = ConfigService.appName();//todo
    this.appConfig = {appName: appName};

    var self = this;

    self.state = $state.current.name;
    self.parentState = $state.current.parentState;

    this.toggle = function () {
      $mdSidenav('left').toggle();
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
        self.params = toParams
      }
    }

    var listener = $rootScope.$on('$stateChangeSuccess',
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
