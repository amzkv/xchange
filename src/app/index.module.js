/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { CollectionController } from './collection/collection.controller';
import { CustomerController } from './customer/customer.controller';
import { DocumentsService } from '../app/components/documents/documents.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { SidemenuDirective } from '../app/components/sidemenu/sidemenu.directive';

angular.module('xchange', ['ngAnimate', 'ngTouch', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'toastr', 'akoenig.deckgrid',  'anim-in-out'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('documentsService', DocumentsService)
  .controller('MainController', MainController)
  .controller('CollectionController', CollectionController)
  .controller('CustomerController', CustomerController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('sideMenu', SidemenuDirective);
