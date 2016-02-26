export function routerConfig($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
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
      url: '/collection/:id',
      templateUrl: 'app/collection/collection.html',
      controller: 'CollectionController',
      controllerAs: 'collection',
      resolve: {
        collection: function (documentsService, $stateParams) {
          return documentsService.callDocumentRelated($stateParams.value);
        }
      }
    })

    .state('customer', {
      url: '/customer/:id',
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
