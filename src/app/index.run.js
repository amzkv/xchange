export function runBlock (CheckAuthService, $state, $log, $rootScope) {
  'ngInject';
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
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
