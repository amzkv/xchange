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
  constructor ($mdSidenav, $rootScope, $log, $state, $stateParams, $http, $scope, $window, LocalAccessService, documentsService) {
    'ngInject';

    $scope.documentsService = documentsService;
    $scope.localAccessService = LocalAccessService;
    var self = this;


    self.state = $state.current.name;
    self.parentState = $state.current.parentState;
    self.accessKeyUser = {};
    self.currentClass = {};
    self.currentCollection = {};

    this.populateCurrentClass = function() {
      if (self.params.collectionId) {
        let collectionsbyClass = documentsService.allCollections.filter(function (item) {
          return item.group.value == self.params.collectionId;
        });

        if (collectionsbyClass.length > 0) {
          self.currentClass = collectionsbyClass[0].group;
        }
      }
    };

    this.populateCurrentCollection = function() {
      if (self.params.customerId) {
        let collectionById = documentsService.allCollections.filter(function (item) {
          return item.id == self.params.customerId;
        });

        if (collectionById.length > 0) {
          self.currentCollection = collectionById[0].title;
        }
      }
    };

    $scope.$watch('documentsService.allCollections', function (newValue, oldValue, scope) {
      if (newValue) {
        self.populateCurrentClass();
        self.populateCurrentCollection();
      }
    }, true);

    this.toggle = function () {
      $mdSidenav('left').toggle();
    };

    this.closeMenu = function () {
      $mdSidenav('left').close();
    };

    $rootScope.$on('$stateChangeSuccess', function(){
      "use strict";
      self.hideFooter = ($state.current.name === 'register' || $state.current.name === 'login' || $state.current.name === 'home' || $state.current.name === 'confirm');
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

      if (documentsService.allCollections) {
        self.populateCurrentClass();
        self.populateCurrentCollection();
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

    $scope.$watch('localAccessService.accessKeyUser', function (newValue, oldValue, scope) {
      if (newValue && newValue != oldValue) {
        self.accessKeyUser = newValue;
      }
    }, true);

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
