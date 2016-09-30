import { config } from './index.config';
import { constant } from './index.constant';
import { routerConfig } from './index.route';
import { indexedDBConfig } from './indexedDB.config';
import { StorageService } from './storage/storage.service';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { RegisterController } from './register/register.controller';
import { ConfirmController } from './confirm/confirm.controller';
import { CollectionController } from './collection/collection.controller';
import { EditDocumentController } from './customer/editDocument.controller';
import { CustomerController } from './customer/customer.controller';
import { DocumentsService } from './components/documents/documents.service';
import { ChangeLogController } from './changelog/changelog.controller';
import { TestController } from './test/test.controller';
import { SearchController } from './search/search.controller';
import { AccesskeyController } from './accesskey/accesskey.controller';
import { PartnerController } from './partner/partner.controller';
import { ConfigService } from './config/config';
import { LoginService } from './login/login.service';
import { CheckAuthService } from './login/checkAuth.service';
import { LocalAccessService } from './login/localAccess.service';
import { ViewModeService } from './customer/viewMode.service.js';
import { NavbarDirective } from './components/navbar/navbar.directive';
import { NavtabbarDirective } from './components/navtabbar/navtabbar.directive';
import { FlyingButtonDirective } from './components/flyingButton/flyingbutton.directive';
import { FooterbarDirective } from './components/footerbar/footerbar.directive';
import { SidemenuDirective } from './components/sidemenu/sidemenu.directive';
import { NoScopeRepeatDirective } from './components/noScopeRepeat/noscoperepeat.directive';
import { TruncateFilter } from './components/truncate/truncate.filter';
import { CollectionFilter } from './components/collectionFilter/collection.filter';
import { SearchService } from './components/search/search.service';
import { ValidateEmail } from './components/validateEmail/validateEmail.directive';
import { AppTitle } from './components/appTitle/appTitle.directive.js';
import { CompareTo } from './components/compareTo/compareTo.directive';
import { DocumentDataValidate } from './components/documentDataValidate/documentDataValidate.directive';
import { langConf } from './languages/langConf';
import { InfinicastWrapper } from './components/infinicast/infinicast.wrapper.provider';
import { NotificationService } from './notification/notification.service';
import { UploadService } from './components/upload/upload.service';
import { ViewerService } from './components/viewer/viewer.service';
import { PartnerService } from './partner/partner.service';
import { contactInformation } from './partner/contactInformation.directive';

angular.module('xchange', [
  'ngAnimate',
  'ngTouch',
  'ngCookies',
  'ngSanitize',
  'ngMessages',
  'ngAria',
  'ui.router',
  'ngMaterial',
  'onsen',
  'toastr',
  /*'akoenig.deckgrid',*/
  'infinite-scroll',
  'indexedDB',
  'ngFileSaver',
  'pdf',
  'ngLocalize',
  'angular-inview',
  'ng-currency',
  'angularLazyImg',
  'thatisuday.dropzone',
  'ui.grid',
  'ui.grid.importer'
])
  .constant('CONSTANT', constant)
  .value('langConf', langConf)
  .config(config)
  .config(routerConfig)
  .config(indexedDBConfig)
  .run(runBlock)
  .service('StorageService', StorageService)
  .service('documentsService', DocumentsService)
  .service('ConfigService', ConfigService)
  .service('LoginService', LoginService)
  .service('CheckAuthService', CheckAuthService)
  .service('LocalAccessService', LocalAccessService)
  .service('ViewModeService', ViewModeService)
  .controller('MainController', MainController)
  .controller('LoginController', LoginController)
  .controller('RegisterController', RegisterController)
  .controller('ConfirmController', ConfirmController)
  .controller('LocalAccessService', LocalAccessService)
  .controller('CollectionController', CollectionController)
  .controller('SearchController', SearchController)
  .controller('CustomerController', CustomerController)
  .controller('EditDocumentController', EditDocumentController)
  .controller('ChangeLogController', ChangeLogController)
  .controller('AccesskeyController', AccesskeyController)
  .controller('PartnerController', PartnerController)
  .controller('TestController', TestController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('navtabbar', NavtabbarDirective)
  .directive('footerBar', FooterbarDirective)
  .directive('sideMenu', SidemenuDirective)
  .directive('noScopeRepeat', NoScopeRepeatDirective)
  .directive('validateEmail', ValidateEmail)
  .directive('appTitle', AppTitle)
  .directive('compareTo', CompareTo)
  .directive('documentDataValidate', DocumentDataValidate)
  .directive('flyingButton', FlyingButtonDirective)
  .directive('contactInformation', contactInformation)
  .filter('truncate', TruncateFilter)
  .filter('collectionFilter', CollectionFilter)
  .service('SearchService', SearchService)
  .provider('InfinicastWrapper', InfinicastWrapper)
  .service('NotificationService', NotificationService)
  .service('UploadService', UploadService)
  .service('ViewerService', ViewerService)
  .service('PartnerService', PartnerService);
