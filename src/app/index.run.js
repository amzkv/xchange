export function runBlock (CheckAuthService, $state, $rootScope, LocalAccessService, SearchService, InfinicastWrapper, $window) {
  'ngInject';
  $rootScope.searchService = SearchService;
  $rootScope.showSplash = true;

  $rootScope.infinicast = InfinicastWrapper;

  $rootScope.title = '365xchange';

  let stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
    //update title
    $rootScope.title = toState.data ? toState.data.pageTitle : toParams.locale || toParams.collectionLocale || '365xchange';
    //check login status
    //event.preventDefault();
    //console.log('start', toState);

    CheckAuthService.checkAuth().then(function(checkAuth) {
      if (!checkAuth) {
        if (CheckAuthService.isStateAccessible(toState, toParams)) {

          /*if ($rootScope.infinicast) {
            //$rootScope.infinicast.listen();
            console.log('infinicast', LocalAccessService.getPartnerIds());
          }*/

          stateChangeStartEvent();

          //console.log('run1');
          //$state.go(toState, toParams, options);
        } else {
          //event.preventDefault();
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
        //console.log('run2');
        //$state.go(toState, toParams, options);
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

  /*$rootScope.$on('$viewContentLoaded', function(event, state,) {
    if (state == '@') {
      $rootScope.showSplash = false;
    }
  });*/

}
