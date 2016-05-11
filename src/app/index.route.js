export function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
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
      url: '/:collectionId',
      parentState: 'home',
      templateUrl: 'app/collection/collection.html',
      controller: 'CollectionController',
      controllerAs: 'collection',
      params: {
        collectionLocale: null
      },
      resolve: {
        collection: function (documentsService, $stateParams) {
          return documentsService.callDocumentRelated($stateParams.collectionId);
        }
      }
    })

    .state('customer', {
      url: '/:collectionId/:customerId',
      parentState: 'collection',
      templateUrl: 'app/customer/customer.html',
      controller: 'CustomerController',
      controllerAs: 'customer',
      params: {
        category: 'CUSTOMER',
        collectionLocale: null,
        locale: ''
      },
      resolve: {
        docs: function (documentsService, $stateParams) {
          return documentsService.callDocumentByOneCollection($stateParams.customerId);
        },
        category: function ($stateParams) {
          return $stateParams.category;
        },
        locale: function ($stateParams) {
          return $stateParams.locale;
        },
        baseUrl: function(ConfigService){
          "use strict";
          return ConfigService.getBaseUrl();
        }
      }
    });

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');
}
