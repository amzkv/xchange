/**
 * Created by decipher on 13.5.16.
 */
export function AppTitle () {
  'ngInject';

  let directive = {
    restrict: 'A',
    link: function($timeout, $rootScope, $state, $stateParams) {

      let listener = function(event, toState) {

        $timeout(function() {
          /*$rootScope.title = (toState.data && toState.data.pageTitle)
            ? toState.data.pageTitle
            : '365';*/
          //$rootScope.title = '365';
        });
      };

      $rootScope.$on('$stateChangeSuccess', listener);
    }
  };

  return directive;
}
