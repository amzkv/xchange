/**
 * Created by decipher on 22.2.16.
 */
export function SidemenuDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/sidemenu/sidemenu.html',
    scope: {
      creationDate: '='
    },
    controller: SidemenuController,
    controllerAs: 'sm',
    bindToController: true
  };

  return directive;
}

class SidemenuController {
  constructor ($mdSidenav) {
    'ngInject';

    // "this.creation" is available by directive option "bindToController: true"
    this.toggle =  $mdSidenav('left').toggle();
  }
}
