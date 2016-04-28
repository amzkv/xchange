export function runBlock (CheckAuthService, $state, $log) {
  'ngInject';
  if(CheckAuthService.checkAuth){
    $log.log('authorized');
  } else {
    $state.go('login');
  }
}
