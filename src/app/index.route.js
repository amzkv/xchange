export function routerConfig($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
  'ngInject';
  $stateProvider

    .state('home', {
      url: '/',
      parentState: null,
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main',
      data : {
        pageTitle: '365',
        accessSettings: {
          public: false,
          accesskey: false,
          customPerms: null
        }
      },
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
      data : {
        pageTitle: '365 | Login' ,
        accessSettings: {
          public: true,
          accesskey: false,
          customPerms: null
        }
      }
    })

    .state('register', {
      url: '/register',
      templateUrl: 'app/register/register.html',
      controller: 'RegisterController',
      controllerAs: 'register',
      data : {
        pageTitle: '365 | Register' ,
        accessSettings: {
          public: true,
          accesskey: false,
          customPerms: null
        }
      }
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
      data : {
        pageTitle: '365 | Confirm Registration',
        accessSettings: {
          public: false,
          accesskey: false,
          customPerms: null
        }
      },
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
      data : {
        pageTitle: 'changelog',
        accessSettings: {
          public: true,
          accesskey: false,
          customPerms: null
        }
      }
    })

    /*.state('test', {
      url: '/test',
      templateUrl: 'app/test/test.html',
      controller: 'TestController',
      controllerAs: 'test',
      data : {
        pageTitle: 'test',
        accessSettings: {
          public: false,
          accesskey: false,
          customPerms: null
        }
      }
    })*/

    /*should be last*/

    .state('search', {
      url: '/search/:searchPhrase',
      templateUrl: 'app/search/search.html',
      controller: 'SearchController',
      controllerAs: 'search',
      data : {
        pageTitle: '365 | Search',
        accessSettings: {
          public: false,
          accesskey: false,
          customPerms: null
        }
      },
      resolve: {
        core_docs: function (documentsService, $stateParams) {
          return documentsService.searchDocumentsCore($stateParams.searchPhrase);
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

    .state('accesskeyHome', {
      url: '/ak/home/:accessKey',
      templateUrl: 'app/accesskey/home.html',
      controller: 'AccesskeyController',
      controllerAs: 'accesskey',
      params: {
        category: 'CUSTOMER',
        collectionLocale: null,
        locale: ''
      },
      data : {
        pageTitle: '365 | Access Key User Home',
        accessSettings: {
          public: true,
          accesskey: true,
          customPerms: null
        }
      },
      resolve: {
        docs: function (storedAccessKey, documentsService, LocalAccessService, $stateParams) {
          documentsService.filter = null;
          let ak = $stateParams.accessKey || (storedAccessKey ? LocalAccessService.decryptCredentials(storedAccessKey) : '');
          return documentsService.callDocumentByAccessKey(ak);//just to test, TODO
        },
        storedAccessKey: function(LocalAccessService) {
          return LocalAccessService.getAccessKeyUserDataEncodedPromise();
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

    .state('accesskeyDocument', {
      url: '/ak/document/:accessKey',
      templateUrl: 'app/accesskey/accesskey.html',
      controller: 'AccesskeyController',
      controllerAs: 'accesskey',
      params: {
        category: 'CUSTOMER',
        collectionLocale: null,
        locale: ''
      },
      data : {
        pageTitle: '365 | Documents By Access Key',
        accessSettings: {
          public: true,
          accesskey: true,
          customPerms: null
        }
      },
      resolve: {
        storedAccessKey: function(LocalAccessService) {
          return LocalAccessService.getAccessKeyUserDataEncodedPromise();
        },

        docs: function (storedAccessKey, LocalAccessService, documentsService, $stateParams) {
          documentsService.filter = null;
          let ak = $stateParams.accessKey || (storedAccessKey ? LocalAccessService.decryptCredentials(storedAccessKey) : '');
          return documentsService.callDocumentByAccessKey(ak);//just to test, TODO
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
    .state('accesskeyDocumentView', {
      url: '/ak/document/:accessKey/:documentId',
      templateUrl: 'app/accesskey/accesskey.html',
      controller: 'AccesskeyController',
      controllerAs: 'accesskey',
      params: {
        category: 'CUSTOMER',
        collectionLocale: null,
        locale: ''
      },
      data : {
        pageTitle: '365 | Documents By Access Key',
        accessSettings: {
          public: true,
          accesskey: true,
          customPerms: null
        }
      },
      resolve: {
        storedAccessKey: function(LocalAccessService) {
          return LocalAccessService.getAccessKeyUserDataEncodedPromise();
        },

        docs: function (storedAccessKey, LocalAccessService, documentsService, $stateParams) {
          documentsService.filter = null;
          let ak = $stateParams.accessKey || (storedAccessKey ? LocalAccessService.decryptCredentials(storedAccessKey) : '');
          return documentsService.callDocumentByAccessKey(ak);//just to test, TODO
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

    .state('accesskeyCollection', {
      url: '/ak/:accessKey/:collectionId',
      parentState: 'accesskeyHome',
      templateUrl: 'app/collection/collection.html',
      controller: 'CollectionController',
      controllerAs: 'collection',
      params: {
        collectionLocale: null
      },
      data : {
        pageTitle: '365 | Collections',
        accessSettings: {
          public: true,
          accesskey: true,
          customPerms: null
        }
      },
      resolve: {
        collection: function (documentsService, $stateParams) {
          documentsService.filter = null;
          let ak = $stateParams.accessKey || (storedAccessKey ? LocalAccessService.decryptCredentials(storedAccessKey) : '');
          return documentsService.callDocumentByAccessKey(ak);//just to test, TODO
        }
      }
    })

    .state('accesskeyDocumentFromCollection', {
      url: '/ak/:accessKey/:collectionId/:customerId',
      parentState: 'accesskeyCollection',
      templateUrl: 'app/accesskey/accesskey.html',
      controller: 'AccesskeyController',
      controllerAs: 'accesskey',
      params: {
        category: 'CUSTOMER',
        collectionLocale: null,
        locale: ''
      },
      data : {
        pageTitle: '365 | Documents By Access Key',
        accessSettings: {
          public: true,
          accesskey: true,
          customPerms: null
        }
      },
      resolve: {
        storedAccessKey: function(LocalAccessService) {
          return LocalAccessService.getAccessKeyUserDataEncodedPromise();
        },

        docs: function (storedAccessKey, LocalAccessService, documentsService, $stateParams) {
          //console.log('accesskeyDocumentFromCollection');
          //if (documentsService.filter && documentsService.filter[0].collection != $stateParams.customerId) {
            documentsService.filter = null;
          //}
          if ($stateParams.customerId) {
            documentsService.filter = [{
              'collection': $stateParams.customerId
            }];
          }

          let ak = $stateParams.accessKey || (storedAccessKey ? LocalAccessService.decryptCredentials(storedAccessKey) : '');
          return documentsService.callDocumentByAccessKey(ak);//just to test, TODO
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

    .state('accesskeyDocumentViewLong', {
      url: '/ak/:accessKey/:collectionId/:customerId/:documentId',
      templateUrl: 'app/accesskey/accesskey.html',
      controller: 'AccesskeyController',
      controllerAs: 'accesskey',
      params: {
        category: 'CUSTOMER',
        collectionLocale: null,
        locale: ''
      },
      data : {
        pageTitle: '365 | Documents By Access Key',
        accessSettings: {
          public: true,
          accesskey: true,
          customPerms: null
        }
      },
      resolve: {
        storedAccessKey: function(LocalAccessService) {
          return LocalAccessService.getAccessKeyUserDataEncodedPromise();
        },

        docs: function (storedAccessKey, LocalAccessService, documentsService, $stateParams) {
          //documentsService.filter = null;
          let ak = $stateParams.accessKey || (storedAccessKey ? LocalAccessService.decryptCredentials(storedAccessKey) : '');
          return documentsService.callDocumentByAccessKey(ak);//just to test, TODO
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

    .state('home.collection', {
      url: ':collectionId',
      parentState: 'home',
      templateUrl: 'app/collection/collection.html',
      controller: 'CollectionController',
      controllerAs: 'collection',
      params: {
        collectionLocale: null
      },
      data : {
        pageTitle: '365 | Collections',
        accessSettings: {
          public: false,
          accesskey: false,
          customPerms: null
        }
      },
      resolve: {
        collection: function (documentsService, $stateParams) {
          return documentsService.callDocumentRelated($stateParams.collectionId);
        }
      }
    })

    .state('home.collection.customer', {
      url: '/:customerId',
      parentState: 'home.collection',
      templateUrl: 'app/customer/customer.html',
      controller: 'CustomerController',
      controllerAs: 'customer',
      /*reloadOnSearch: false,*/
      params: {
        category: 'CUSTOMER',
        collectionLocale: null,
        locale: '',
        currentCollection: null
      },
      data : {
        pageTitle: '365 | Documents',
        accessSettings: {
          public: false,
          accesskey: false,
          customPerms: null
        }
      },
      resolve: {
        docs: function (documentsService, $stateParams) {
          documentsService.filter = null;
          return documentsService.callDocumentByOneCollection($stateParams.customerId);
        },
        storedAccessKey: function(LocalAccessService) {
          return LocalAccessService.getAccessKeyUserDataEncodedPromise();
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

    .state('home.collection.document', {
      url: '/:customerId/:documentId',
      parentState: 'home.collection',
      templateUrl: 'app/customer/customer.html',
      controller: 'CustomerController',
      controllerAs: 'customer',
      /*reloadOnSearch: false,*/
      params: {
        category: 'CUSTOMER',
        collectionLocale: null,
        locale: '',
        currentCollection: null
      },
      data : {
        pageTitle: '365 | Documents',
        accessSettings: {
          public: false,
          accesskey: false,
          customPerms: null
        }
      },
      resolve: {
        docs: function (documentsService, $stateParams) {
          documentsService.filter = null;
          return documentsService.callDocumentByOneCollection($stateParams.customerId);
        },
        storedAccessKey: function(LocalAccessService) {
          return LocalAccessService.getAccessKeyUserDataEncodedPromise();
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

  /*$urlRouterProvider.rule(function ($injector, $location) {
    var path = $location.url();

    // check to see if the path already has a slash where it should be
    if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
      return;
    }

    if (path.indexOf('?') > -1) {
      return path.replace('?', '/?');
    }

    return path + '/';
  });*/

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

}
