import { config } from './index.config';
import { constant } from './index.constant';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { CollectionController } from './collection/collection.controller';
import { CustomerController } from './customer/customer.controller';
import { DocumentsService } from './components/documents/documents.service';
import { ConfigService } from './config/config';
import { LoginService } from './login/login.service';
import { CheckAuthService } from './login/checkAuth.service';
import { LocalAccessService } from './login/localAccess.service';
import { NavbarDirective } from './components/navbar/navbar.directive';
import { FooterbarDirective } from './components/footerbar/footerbar.directive';
import { SidemenuDirective } from './components/sidemenu/sidemenu.directive';
import { NoScopeRepeatDirective } from './components/noScopeRepeat/noscoperepeat.directive';

angular.module('xchange', ['ngAnimate', 'ngTouch', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'onsen', 'toastr', 'akoenig.deckgrid'])
  .constant('CONSTANT', constant)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('documentsService', DocumentsService)
  .service('ConfigService', ConfigService)
  .service('LoginService', LoginService)
  .service('CheckAuthService', CheckAuthService)
  .service('LocalAccessService', LocalAccessService)
  .controller('MainController', MainController)
  .controller('LoginController', LoginController)
  .controller('LocalAccessService', LocalAccessService)
  .controller('CollectionController', CollectionController)
  .controller('CustomerController', CustomerController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('footerBar', FooterbarDirective)
  .directive('sideMenu', SidemenuDirective)
  .directive('noScopeRepeat', NoScopeRepeatDirective);
