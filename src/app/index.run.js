export function runBlock (CheckAuthService, $state, $rootScope, LocalAccessService, SearchService, InfinicastWrapper, $window) {
  'ngInject';
  $rootScope.searchService = SearchService;

  $rootScope.infinicast = InfinicastWrapper;

  let stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
    //update title
    $rootScope.title = toState.data ? toState.data.pageTitle : toParams.locale || toParams.collectionLocale || '';
    //check login status
    event.preventDefault();

    CheckAuthService.checkAuth().then(function(checkAuth) {
      if (!checkAuth) {
        if (CheckAuthService.isStateAccessible(toState, toParams)) {

          /*if ($rootScope.infinicast) {
            //$rootScope.infinicast.listen();
            console.log('infinicast', LocalAccessService.getPartnerIds());
          }*/

          stateChangeStartEvent();
          $state.go(toState, toParams, options);
        } else {
          stateChangeStartEvent();//remove
          $state.go('login');
        }
      } else {
        //regular user case
        //LocalAccessService.decryptCredentials(checkAuth);
        if ($rootScope.infinicast) {
          if ($rootScope.infinicast.isUserValid(true)) {
            $rootScope.infinicast.listen();
            //$rootScope.infinicast.goOnline();
          } else {
            CheckAuthService.getUser().then(function (user) {
              $rootScope.infinicast.setUser(user);
              $rootScope.infinicast.listen();
              //$rootScope.infinicast.goOnline();
            });
          }
        }

        stateChangeStartEvent();
        $state.go(toState, toParams, options);
        //$urlRouter.sync();
      }
    });

    /*if(CheckAuthService.checkAuth()){

    } else {
      if (toState.name != 'login' && toState.name != 'register' && toState.name != 'confirm') {
        event.preventDefault();
        $state.go('login');
      }
    }*/

  });

  $rootScope.$on('$locationChangeStart', function() {
    $rootScope.previousPage = location.pathname;
  });

}
