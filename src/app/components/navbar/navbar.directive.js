export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    scope: {
        creationDate: '='
    },
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class NavbarController {
  constructor ($mdSidenav, $log) {
    'ngInject';

    this.toggle = function () {
      $mdSidenav('left').toggle();
    };

    this.closeMenu = function () {
      $mdSidenav('left').close();
    };

  }
}
