export function routerConfig($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'login'
    })
    .state('home', {
      url: '/',
      parentState: null,
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main',
      resolve: {
        categories: function (documentsService) {
          return documentsService.callDocumentsCore();
        }
      }
    })

    .state('collection', {
      url: '/collection/:id/:locale',
      parentState: 'home',
      templateUrl: 'app/collection/collection.html',
      controller: 'CollectionController',
      controllerAs: 'collection',
      resolve: {
        collection: function (documentsService, $stateParams) {
          return documentsService.callDocumentRelated($stateParams.id);
        }
      }
    })

    .state('customer', {
      url: '/customer/:id/:category/:locale',
      parentState: 'collection',
      templateUrl: 'app/customer/customer.html',
      controller: 'CustomerController',
      controllerAs: 'customer',
      params: {
        category: 'CUSTOMER'
      },
      resolve: {
        docs: function (documentsService, $stateParams) {
          return documentsService.callDocumentByOneCollection($stateParams.id);
        },
        category: function ($stateParams) {
          return $stateParams.category;
        }
      }
    });

  $urlRouterProvider.otherwise('/');
}
