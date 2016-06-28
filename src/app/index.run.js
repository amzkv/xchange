export function runBlock (CheckAuthService, $state, $rootScope) {
  'ngInject';
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams){
    //update title
    $rootScope.title = toState.data ? toState.data.pageTitle : toParams.locale || toParams.collectionLocale || '';
    //check login status

    CheckAuthService.checkAuth().then(function(checkAuth) {
      if (!checkAuth && toState.name != 'login' && toState.name != 'register' && toState.name != 'confirm' && toState.name != 'accesskey') {
        event.preventDefault();
        $state.go('login');
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
