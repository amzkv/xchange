export function runBlock (CheckAuthService, $state, $rootScope, LocalAccessService, SearchService) {
  'ngInject';
  $rootScope.searchService = SearchService;
  let stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
    //update title
    $rootScope.title = toState.data ? toState.data.pageTitle : toParams.locale || toParams.collectionLocale || '';
    //check login status
    event.preventDefault();

    CheckAuthService.checkAuth().then(function(checkAuth) {
      if (!checkAuth) {
        if (CheckAuthService.isStateAccessible(toState, toParams)) {
          stateChangeStartEvent();
          $state.go(toState, toParams, options);
        } else {
          stateChangeStartEvent();//remove
          $state.go('login');
        }
      } else {
        //regular user case
        //LocalAccessService.decryptCredentials(checkAuth);
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
