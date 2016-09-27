export function NavtabbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navtabbar/navtabbar.html',
    scope: {
      creationDate: '='
    },
    controller: NavtabbarController,
    controllerAs: 'tb',
    bindToController: true
  };

  return directive;
}

class NavtabbarController {
  constructor ($stateParams, $state, $rootScope, $scope, documentsService) {
    'ngInject';

    $scope.currentClass = {};
    $scope.currentCollection = {};
    $scope.documentsService = documentsService;
    let self = this;
    self.hideHeader = true;
    self.changeUrl = false;//set to true to enable state change

    self.activateTab = function(index) {
      setImmediate(function() {
        try {
          tabbar.setActiveTab(index);
        } catch(e) {
        }
      });
    };

    $rootScope.$watch('globalState', function (newV, oldV) {
      if (newV && newV!=oldV) {
        $scope.currentState = newV;
        //console.log(newV);

        switch (newV) {
          case 'home':
            self.activateTab(0);

            break;
          case 'home.collection':
            self.activateTab(1);
            /*this.collectionId = $state.params.collectionId;
            this.loadCollectionItems(this.collectionId);*/
            break;
          /*case 'accesskeyCollection':
              self.activateTab(1);
            break;*/
          case 'home.collection.customer':
            self.activateTab(2);
            /*this.collectionId = $state.params.collectionId;
            this.customerId = $state.params.customerId;

            this.loadDocumentItems(this.customerId);

            this.loadCollectionItems(this.collectionId);*///load it right away for a fast navigation
            break;
          case 'home.collection.document':
            self.activateTab(2);
            break;
          /*case 'accesskeyDocumentFromCollection':
           self.activateTab(2);
            break;*/
          default:
            self.activateTab(0);
        }
      }
    });

    $rootScope.$watch('stateInfo', function (newV, oldV) {
      if (newV && newV!=oldV) {
        if (newV.currentClass) {
          $scope.currentClass =  newV.currentClass;
        } else {
          $scope.currentClass = {};
        }
        if (newV.currentCollection) {
          $scope.currentCollection =  newV.currentCollection;
        } else {
          $scope.currentCollection = {};
        }
      }
    }, true);

    this.goToCore = function() {
      $rootScope.globalState = 'home';

      if (this.changeUrl) {
        $state.go('home', $stateParams, {'reload': false, 'notify': false});
      }
    };

    this.goToDocuments = function(value) {
      //$state.go('home.collection.customer', params, {'reload': false, 'notify': false});
      //console.log('gotodoc', documentsService);
      if ($rootScope.currentCustomerId) {
        //console.log('test',value);
        $stateParams.customerId = $rootScope.currentCustomerId;
        $rootScope.globalState = 'home.collection.customer';

        if (this.changeUrl) {
          $state.go('home.collection.customer', $stateParams, {'reload': false, 'notify': false});
        }
      }
    };

    this.goToRelated = function(value) {
      if ($rootScope.currentCollectionId) {
        $rootScope.globalState = 'home.collection';
        $stateParams.collectionId = $rootScope.currentCollectionId;

        if (this.changeUrl) {
          $state.go('home.collection', $stateParams, {'reload': false, 'notify': false});
        }
      }
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, from, fromState){
      self.hideHeader = ($state.current.name.indexOf('accesskey')!== -1 || $state.current.name === 'changelog' || $state.current.name === 'register' || $state.current.name === 'login' || $state.current.name === 'confirm');
    });

  }
}
