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
  constructor ($mdSidenav, $rootScope, $log,$state) {
    'ngInject';

    var self = this;

    self.state = $state.current.name;

    this.toggle = function () {
      $mdSidenav('left').toggle();
    };

    this.closeMenu = function () {
      $mdSidenav('left').close();
    };

    function setState(state, prev, params){
      "use strict";
      self.state = state;
      self.previousState = prev;
      self.previousStateParams = params;
    }

    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, from, fromState, fromParams, options){

        setState($state.current.name, from.name, fromState);
      });

    this.navigateBack = function(){
      "use strict";
      if(self.previousState && self.previousStateParams){
        $state.go(self.previousState, {id: self.previousStateParams.id})
      }
    }

    this.navigateHome = function(){
      "use strict";
      if (self.state !== 'home'){
        $state.go('home');
      }
    }

  }
}
