export function FooterbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/footerbar/footerbar.html',
    scope: {
      creationDate: '='
    },
    controller: FooterbarController,
    controllerAs: 'fm',
    bindToController: true
  };

  return directive;
}

class FooterbarController {
  constructor () {
    'ngInject';

  }
}
