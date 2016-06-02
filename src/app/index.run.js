export function runBlock (CheckAuthService, $state, $rootScope) {
  'ngInject';
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    //update title
    $rootScope.title = toState.data ? toState.data.pageTitle : toParams.locale || toParams.collectionLocale || '';
    //check login status

    if(CheckAuthService.checkAuth()){

    } else {
      if (toState.name != 'login' && toState.name != 'register') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });
}
