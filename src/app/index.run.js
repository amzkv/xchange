export function runBlock (CheckAuthService, $timeout, $state, $log, $rootScope) {
  'ngInject';
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    //update title
    console.log(toParams);
    $rootScope.title = toState.data ? toState.data.pageTitle : toParams.locale || toParams.collectionLocale || '';
    //check login status
    if(CheckAuthService.checkAuth()){
      $log.log('authorized');//remove?
    } else {
      if (toState.name != 'login') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });
}
