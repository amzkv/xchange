export function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  'ngInject';
  $stateProvider

    .state('home', {
      url: '/',
      parentState: null,
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main',
      data : { pageTitle: '365' },
      resolve: {
        categories: function (documentsService) {
          return documentsService.callDocumentsCore();
        }
      }
    })

    .state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginController',
      controllerAs: 'login',
      data : { pageTitle: '365 | Login' }
    })

    .state('register', {
      url: '/register',
      templateUrl: 'app/register/register.html',
      controller: 'RegisterController',
      controllerAs: 'register',
      data : { pageTitle: '365 | Register' }
    })

    .state('confirm', {
      url: '/confirm',
      templateUrl: 'app/confirm/confirm.html',
      controller: 'ConfirmController',
      controllerAs: 'confirm',
      params: {
        confirmCode: null,
        squash: true
      },
      data : { pageTitle: '365 | Confirm Registration' },
      resolve: {
        info: function (LoginService, $stateParams) {
          if ($stateParams.confirmCode) {
            return LoginService.registerInformation($stateParams.confirmCode);
          }
          return {};
        }
      }
    })

    .state('changelog', {
      url: '/changelog',
      templateUrl: 'app/changelog/changelog.html',
      controller: 'ChangeLogController',
      controllerAs: 'log',
      data : { pageTitle: 'changelog' }
    })


    /*should be last*/

    .state('search', {
      url: '/search/:searchPhrase',
      templateUrl: 'app/search/search.html',
      controller: 'SearchController',
      controllerAs: 'search',
      data : { pageTitle: '365 | Search' },
      resolve: {
        core_docs: function (documentsService, $stateParams) {
          return documentsService.callDocumentsCore();
          //documentsService.filter = null;
          //return documentsService.callDocumentByOneCollection($stateParams.customerId);
        },
        collections: function (documentsService, $stateParams) {
          return documentsService.callDocumentRelated('Type');//just to test, TODO
        },
        docs: function (documentsService, $stateParams) {
          documentsService.filter = null;
          return documentsService.callDocumentByOneCollection(2047);//just to test, TODO
          //return documentsService.searchDocument($stateParams.searchPhrase); //use this when API is ready
        },
        /*category: function ($stateParams) {
         return $stateParams.category;
         },
         locale: function ($stateParams) {
         return $stateParams.locale;
         },*/
        baseUrl: function(ConfigService){
          "use strict";
          return ConfigService.getBaseUrl();
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
          documentsService.filter = null;
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

    })

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');
}
