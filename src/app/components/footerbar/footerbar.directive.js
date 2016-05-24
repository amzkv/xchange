export function FooterbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/footerbar/footerbar.html',
    scope: {
      creationDate: '='
    },
    controller: FooterbarController,
    controllerAs: 'fm',
    bindToController: true
  };

  return directive;
}

class FooterbarController {
  constructor ($mdSidenav, $rootScope, $log, $state, $stateParams, $http, $scope) {
    'ngInject';

    $http.get('app/config.json').success(function(data) {
      $scope.appConfig = data.appConfig;//todo
      //$scope['appConfig'] = {"appName":"Home"};
    });
    var self = this;

    self.state = $state.current.name;
    self.parentState = $state.current.parentState;

    this.toggle = function () {
      $mdSidenav('left').toggle();
    };

    this.closeMenu = function () {
      $mdSidenav('left').close();
    };

    $rootScope.$on('$stateChangeSuccess', function(){
      "use strict";
      self.hideFooter = ($state.current.name === 'register' || $state.current.name === 'login' || $state.current.name === 'home');
    });

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
