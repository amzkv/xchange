/******/!function(e){function t(o){if(n[o])return n[o].exports;var a=n[o]={exports:{},id:o,loaded:!1};return e[o].call(a.exports,a,a.exports,t),a.loaded=!0,a.exports}// webpackBootstrap
/******/
var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";var o=n(1),a=n(2),r=n(3),i=n(4),c=n(5),s=n(6),l=n(7),u=n(8),d=n(9),m=n(10),p=n(11),g=n(12),f=n(13),v=n(14),h=n(15),b=n(16),y=n(17),S=n(18);angular.module("xchange",["ngAnimate","ngTouch","ngCookies","ngSanitize","ngMessages","ngAria","ui.router","ngMaterial","onsen","toastr","akoenig.deckgrid"]).constant("CONSTANT",a.constant).config(o.config).config(r.routerConfig).run(i.runBlock).service("documentsService",d.DocumentsService).service("ConfigService",m.ConfigService).service("LoginService",p.LoginService).service("CheckAuthService",g.CheckAuthService).service("LocalAccessService",f.LocalAccessService).controller("MainController",c.MainController).controller("LoginController",s.LoginController).controller("LocalAccessService",f.LocalAccessService).controller("CollectionController",l.CollectionController).controller("CustomerController",u.CustomerController).directive("acmeNavbar",v.NavbarDirective).directive("footerBar",h.FooterbarDirective).directive("sideMenu",b.SidemenuDirective).directive("noScopeRepeat",y.NoScopeRepeatDirective).filter("truncate",S.TruncateFilter)},function(e,t){"use strict";function n(e,t,n,o){"ngInject";e.debugEnabled(!0),t.allowHtml=!0,t.timeOut=3e3,t.positionClass="toast-top-right",t.preventDuplicates=!0,t.progressBar=!0,n.definePalette("365xchangeViolet",{50:"9457c1",100:"8430c1",200:"4b0082",300:"4b0082",400:"431862",500:"310055",600:"e53935",700:"d32f2f",800:"c62828",900:"b71c1c",A100:"ff8a80",A200:"ff5252",A400:"ff1744",A700:"d50000",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),n.definePalette("365xchangeRed",{50:"ca5ba3",100:"ca3395",200:"960061",300:"960061",400:"701c53",500:"61003f",600:"e53935",700:"d32f2f",800:"c62828",900:"b71c1c",A100:"ff8a80",A200:"ff5252",A400:"ff1744",A700:"d50000",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),n.definePalette("365xchangeGreen",{50:"b8db62",100:"abdb37",200:"82b700",300:"82b700",400:"6b8922",500:"547700",600:"e53935",700:"d32f2f",800:"c62828",900:"b71c1c",A100:"ff8a80",A200:"ff5252",A400:"ff1744",A700:"d50000",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),n.definePalette("365xchangeYellow",{50:"e0dd65",100:"e0dc38",200:"c2bd00",300:"c2bd00",400:"918f24",500:"7e7b00",600:"e53935",700:"d32f2f",800:"c62828",900:"b71c1c",A100:"ff8a80",A200:"ff5252",A400:"ff1744",A700:"d50000",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),n.theme("default").primaryPalette("365xchangeViolet"),n.theme("365violet").primaryPalette("365xchangeViolet"),n.theme("365red").primaryPalette("365xchangeRed"),n.theme("365green").primaryPalette("365xchangeGreen"),n.theme("365yellow").primaryPalette("365xchangeYellow"),o.value("themeProvider",n),n.alwaysWatchTheme(!0)}n.$inject=["$logProvider","toastrConfig","$mdThemingProvider","$provide"],Object.defineProperty(t,"__esModule",{value:!0}),t.config=n},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={ENV:"production",BASEURL_PROD:"365xchange.de",BASEURL_DEV:"stage.365xchange.net",API_ENTRY:"/api/",HTTP:"http://",HTTPS:"https://"};t.constant=n},function(e,t){"use strict";function n(e,t,n){"ngInject";e.state("login",{url:"/login",templateUrl:"app/login/login.html",controller:"LoginController",controllerAs:"login"}).state("home",{url:"/",parentState:null,templateUrl:"app/main/main.html",controller:"MainController",controllerAs:"main",resolve:{categories:["documentsService",function(e){return e.callDocumentsCore()}]}}).state("collection",{url:"/:collectionId",parentState:"home",templateUrl:"app/collection/collection.html",controller:"CollectionController",controllerAs:"collection",resolve:{collection:["documentsService","$stateParams",function(e,t){return e.callDocumentRelated(t.collectionId)}]}}).state("customer",{url:"/:customerId/:category",parentState:"collection",templateUrl:"app/customer/customer.html",controller:"CustomerController",controllerAs:"customer",params:{category:"CUSTOMER"},resolve:{docs:["documentsService","$stateParams",function(e,t){return e.callDocumentByOneCollection(t.customerId)}],category:["$stateParams",function(e){return e.category}],baseUrl:["ConfigService",function(e){return e.getBaseUrl()}]}}),n.html5Mode(!0),t.otherwise("/")}n.$inject=["$stateProvider","$urlRouterProvider","$locationProvider"],Object.defineProperty(t,"__esModule",{value:!0}),t.routerConfig=n},function(e,t){"use strict";function n(e,t,n){"ngInject";e.checkAuth?n.log("authorized"):t.go("login")}n.$inject=["CheckAuthService","$state","$log"],Object.defineProperty(t,"__esModule",{value:!0}),t.runBlock=n},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function a(e,t){"ngInject";n(this,a),t.setDefaultTheme("365violet"),this.docs=e.data.collections};o.$inject=["categories","themeProvider"],t.MainController=o},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function a(e,t,o,r,i){"ngInject";function c(){t.authenticateUser(s.userInfo).then(function(t){o.log(t),"200"==t.data.response.errorcode&&(r.setCredentails(s.userInfo),i.setUser(t.data.user),e.go("home"))})}n(this,a),this.onClickForRegistration=function(){e.go("registration")},this.onClickForForgetPassword=function(){e.go("forgetPassword")},this.onLogin=function(){this.loginForm.$valid&&c()};var s=this};o.$inject=["$state","LoginService","$log","LocalAccessService","CheckAuthService"],t.LoginController=o},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function a(e,t){"ngInject";n(this,a),t.setDefaultTheme("365violet"),this.docs=e.data.collections};o.$inject=["collection","themeProvider"],t.CollectionController=o},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function a(e,t,o,r,i){"ngInject";n(this,a),e.category=o,e.docs=t.data.documents,e.baseUrl=i,e.showDetails=function(e){e.details=e.details?!1:!0,e.baseUrl=i}};o.$inject=["$scope","docs","category","themeProvider","baseUrl"],t.CustomerController=o},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=function(){function e(t,o,a,r){"ngInject";n(this,e),this.$http=t,this.$log=o,this.configService=a,this.localAccessService=r}return e.$inject=["$http","$log","ConfigService","LocalAccessService"],o(e,[{key:"callDocumentsCore",value:function(){var e=this.localAccessService.getCredentails(),t={auth:{user:{username:e.userId,password:e.passWord}},collection:{method:"core"}};return this.$http.post(this.configService.getBaseUrl()+"document",{auth:t.auth,collection:t.collection,contentType:"application/json",datatype:"json"})}},{key:"callDocumentRelated",value:function(e){var t=this.localAccessService.getCredentails(),n={auth:{user:{username:t.userId,password:t.passWord}},collection:{method:"related by ID",group:{value:e}}};return this.$http.post(this.configService.getBaseUrl()+"document",{auth:n.auth,collection:n.collection,contentType:"application/json",datatype:"json"})}},{key:"callDocumentByOneCollection",value:function(e){var t=this.localAccessService.getCredentails(),n={auth:{user:{username:t.userId,password:t.passWord}},document:{method:"by collection",collection:e,offset:{start:1,end:20}}};return this.$http.post(this.configService.getBaseUrl()+"document",{auth:n.auth,document:n.document,contentType:"application/json",datatype:"json"})}}]),e}();t.DocumentsService=a},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=function(){function e(t,o,a,r){"ngInject";n(this,e),this.$http=t,this.$log=o,this.$q=a,this.constant=r}return e.$inject=["$http","$log","$q","CONSTANT"],o(e,[{key:"getProtocol",value:function(){var e="development"===this.constant.ENV?this.constant.HTTP:this.constant.HTTPS;return e}},{key:"getBaseUrl",value:function(){var e="development"===this.constant.ENV?this.constant.BASEURL_DEV+this.constant.API_ENTRY:this.constant.BASEURL_PROD+this.constant.API_ENTRY;return this.getProtocol(this.constant.ENV)+e}},{key:"userServiceURL",value:function(){return this.getBaseUrl()+"user"}},{key:"accountServiceURL",value:function(){return this.getBaseUrl()+"account"}},{key:"documentServiceURL",value:function(){return this.getBaseUrl()+"document"}},{key:"partnerServiceURL",value:function(){return this.getBaseUrl()+"partner"}},{key:"appName",value:function(){return"365"}}]),e}();t.ConfigService=a},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=function(){function e(t,o,a,r){"ngInject";n(this,e),this.$http=t,this.$log=o,this.$q=a,this.ConfigService=r}return e.$inject=["$http","$log","$q","ConfigService"],o(e,[{key:"getLoginModel",value:function(){return{userId:"",passWord:""}}},{key:"getRegistrationModel",value:function(){return{firstName:"",lastName:"",companyName:"",eMailName:"",passWord:"",confirmPassWord:"",iagreewith:!1}}},{key:"getForgetPasswordModel",value:function(){return{email:""}}},{key:"authenticateUser",value:function(e){var t=this.$q.defer(),n={auth:{user:{username:e.userId,password:e.passWord}},user:{method:"by id"}};return n=JSON.stringify(n),this.$http.post(this.ConfigService.userServiceURL(),n).success(function(e){t.resolve(e)}).error(function(e){t.reject(e)})}}]),e}();t.LoginService=a},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=function(){function e(t,o,a){"ngInject";n(this,e),this.$http=t,this.$log=o,this.$window=a}return e.$inject=["$http","$log","$window"],o(e,[{key:"checkAuth",value:function(){return null===this.$window.localStorage.getItem("userinfo")?!1:!0}},{key:"setUser",value:function(e){return this.$window.localStorage.setItem("user",e)}},{key:"getUser",value:function(){var e=this.$window.localStorage.getItem("user");return JSON.parse(e)}}]),e}();t.CheckAuthService=a},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=function(){function e(t,o,a){"ngInject";n(this,e),this.$http=t,this.$log=o,this.$window=a}return e.$inject=["$http","$log","$window"],o(e,[{key:"checkCredentails",value:function(){return null==localStorage.getItem("userinfo")?!1:!0}},{key:"getCredentails",value:function(){var e=this.$window.localStorage.getItem("userinfo");return JSON.parse(e)}},{key:"setCredentails",value:function(e){var t=JSON.stringify(e);this.$window.localStorage.setItem("userinfo",t)}},{key:"removeCredentails",value:function(){this.$window.localStorage.removeItem("userinfo"),this.$window.localStorage.removeItem("user")}},{key:"setViewSettings",value:function(e){this.$window.localStorage.setItem("viewSetting",e)}},{key:"getViewSettings",value:function(){return this.$window.localStorage.getItem("viewSetting")}}]),e}();t.LocalAccessService=a},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(){"ngInject";var e={restrict:"E",templateUrl:"app/components/navbar/navbar.html",scope:{creationDate:"="},controller:a,controllerAs:"vm",bindToController:!0};return e}Object.defineProperty(t,"__esModule",{value:!0}),t.NavbarDirective=o;var a=function r(e,t,o,a,i){"ngInject";function c(e,t,n,o,a){l.state=e,l.previousState=t,l.previousStateParams=n,o&&(l.parentState=o),a&&(l.params=a)}n(this,r);var s=a.appName();this.appConfig={appName:s};var l=this;l.state=o.current.name,l.parentState=o.current.parentState,this.toggle=function(){e("left").toggle()},this.closeMenu=function(){e("left").close()},this.logout=function(){i.removeCredentails(),o.go("login")};t.$on("$stateChangeSuccess",function(e,t,n,a,r){c(o.current.name,a.name,r,o.current.parentState,n)});this.navigateBack=function(){l.previousState&&l.previousStateParams&&o.go(l.previousState,{id:l.previousStateParams.id})},this.navigateUp=function(){l.parentState&&(l.parentState==l.previousState?o.go(l.previousState,l.previousStateParams):o.go(l.parentState,l.params))},this.navigateHome=function(){"home"!==l.state&&o.go("home")}};a.$inject=["$mdSidenav","$rootScope","$state","ConfigService","LocalAccessService"]},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(){"ngInject";var e={restrict:"E",templateUrl:"app/components/footerbar/footerbar.html",scope:{creationDate:"="},controller:a,controllerAs:"fm",bindToController:!0};return e}Object.defineProperty(t,"__esModule",{value:!0}),t.FooterbarDirective=o;var a=function r(e,t,o,a,i,c,s){"ngInject";function l(e,t,n,o,a){u.state=e,u.previousState=t,u.previousStateParams=n,o&&(u.parentState=o),a&&(u.params=a)}n(this,r),c.get("app/config.json").success(function(e){s.appConfig=e.appConfig});var u=this;u.state=a.current.name,u.parentState=a.current.parentState,this.toggle=function(){e("left").toggle()},this.closeMenu=function(){e("left").close()};t.$on("$stateChangeSuccess",function(e,t,n,o,r){l(a.current.name,o.name,r,a.current.parentState,n)});this.navigateBack=function(){u.previousState&&u.previousStateParams&&a.go(u.previousState,{id:u.previousStateParams.id})},this.navigateUp=function(){u.parentState&&(u.parentState==u.previousState?a.go(u.previousState,u.previousStateParams):a.go(u.parentState,u.params))},this.navigateHome=function(){"home"!==u.state&&a.go("home")}};a.$inject=["$mdSidenav","$rootScope","$log","$state","$stateParams","$http","$scope"]},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(){"ngInject";var e={restrict:"E",templateUrl:"app/components/sidemenu/sidemenu.html",scope:{creationDate:"="},controller:a,controllerAs:"sm",bindToController:!0};return e}Object.defineProperty(t,"__esModule",{value:!0}),t.SidemenuDirective=o;var a=function r(e){"ngInject";n(this,r),this.toggle=e("left").toggle()};a.$inject=["$mdSidenav"]},function(e,t){"use strict";function n(e){"ngInject";return function(t,n,o){t.$watch(o.items,function(a){if(a){var r="<div>{{ #TPL#."+o.value+" }}</div>";a.forEach(function(a,i){var c=angular.element(r.replace(/#TPL#/g,o.items+"["+i+"]"));e(c)(t),n.append(c)})}})}}n.$inject=["$compile"],Object.defineProperty(t,"__esModule",{value:!0}),t.NoScopeRepeatDirective=n},function(e,t){"use strict";function n(){"ngInject";return function(e,t,n,o){if(!e)return"";if(n=parseInt(n,10),!n)return e;if(e.length<=n)return e;if(e=e.substr(0,n),t){var a=e.lastIndexOf(" ");-1!=a&&(("."==e.charAt(a-1)||","==e.charAt(a-1))&&(a-=1),e=e.substr(0,a))}return e+(o||" …")}}Object.defineProperty(t,"__esModule",{value:!0}),t.TruncateFilter=n}]),angular.module("xchange").run(["$templateCache",function(e){e.put("app/collection/collection.html","<div layout-fill=\"\" ng-cloak=\"\"><md-content class=\"md-padding\"><div flex=\"\" deckgrid=\"\" class=\"deckgrid\" source=\"collection.docs\"><div class=\"a-card\"><a ui-sref=\"customer({id: card.id, category: card.group.locale})\"><md-card><md-card-title class=\"card-title-mod\"><div class=\"card-count {{{'CUSTOMER':'count-customer', 'VENDOR':'count-customer', 'Lead':'count-customer', 'Workflow': 'count-workflow', 'Type': 'count-other', 'Inbox': 'count-other', 'Monat': 'count-other', 'Project': 'count-project', '':'count-other'}[card.group.value]}}\">{{card.count}}</div><md-card-title-text><span class=\"md-headline\">{{card.title.locale}}</span></md-card-title-text></md-card-title></md-card></a></div></div></md-content></div>"),e.put("app/customer/customer.html",'<div layout-fill="" ng-cloak=""><md-content class="md-padding"><div flex="" deckgrid="" class="docgrid" source="docs"><div class="a-card"><md-card class="main-card" ng-click="mother.showDetails(card)" ng-show="!card.details"><div class="card-upper-bar"></div><md-card-title><md-card-title-media><img style="background-color: #FAFAFA;" ng-src="{{mother.baseUrl}}file{{card.thumb}}" class="image-container" alt="{{card.title | truncate:true:16:\'...\'}}"></md-card-title-media><md-card-title-text class="mod-card-title"><span class="md-headline mod-card-text">{{card.title|truncate:true:28:\'...\'}}</span><br><span class="md-subhead">{{card.workstatus|truncate:true:28:\'...\'}}</span> <span class="md-subhead">{{card.type.locale|truncate:true:28:\'...\'}}</span> <span class="md-subhead">{{card.date}}</span> <span class="md-subhead secondary-subhead">{{(card.user.firstname + \' \' + card.user.lastname)|truncate:false:28:\'...\'}}</span></md-card-title-text></md-card-title></md-card><md-card style="height:322px;" class="card-details {{{\'Lieferanten\': \'count-customer\', \'Kunden\': \'count-customer\', \'CUSTOMER\': \'count-customer\', \'VENDOR\':\'count-customer\', \'Lead\':\'count-customer\', \'Workflow\': \'count-workflow\', \'Type\': \'count-other\', \'Inbox\': \'count-other\', \'Monat\': \'count-other\', \'Belegart\': \'count-other\', \'Datum\': \'count-other\', \'Project\': \'count-project\', \'\':\'count-other\'}[mother.category]}}" ng-show="card.details" ng-click="mother.showDetails(card)"><md-card-actions layout="row" layout-align="end center"><button class="md-button md-icon-button card-details-button download-button" type="button" aria-label="Download" ng-click="$event.stopPropagation()"><i class="mdi mdi-download"></i></button> <button class="md-button md-icon-button card-details-button edit-button" type="button" aria-label="Edit" ng-click="$event.stopPropagation()"><i class="mdi mdi-pencil"></i></button></md-card-actions><md-card-title><md-card-title-text class="mod-card-title"><span class="md-headline md-headline-selected mod-card-text">{{card.title|truncate:true:18:\'...\'}}</span><br><span class="md-subhead md-subhead-selected">{{card.type.locale|truncate:true:18:\'...\'}}</span> <span class="md-subhead md-subhead-selected">{{card.date}}</span> <span class="md-subhead secondary-subhead md-secondary-subhead-selected">{{(card.user.firstname + \' \' + card.user.lastname)|truncate:true:28:\'...\'}}</span></md-card-title-text><md-card-title-text class="mod-card-title"><span class="md-headline md-headline-selected mod-card-text">Collections:</span><br><div class="md-subhead-selected" no-scope-repeat="" items="card.collections" value="title.locale"></div></md-card-title-text></md-card-title></md-card></div></div></md-content></div>'),e.put("app/login/login.html",'<application-bar></application-bar><div class="login-container"><div class="content-container" layout="row" layout-sm="column"><div flex="" class="content-left-border"><div class="login-left-content-settings"><span style="display: block; font-size: 12px;">Need an account?</span><md-button data-ng-click="login.onClickForRegistration()" class="md-raised login-sample-button">Create Account</md-button></div></div><div flex="" class="content-right"><div id="signin">Sign In</div><form name="login.loginForm" id="loginForm" novalidate=""><div><md-input-container><label class="login-validation-color">Username</label> <input type="email" style="color:white !important;border-color: rgb(250, 245, 245) !important;" name="userId" data-ng-model="login.userInfo.userId" required=""><div ng-messages="login.loginForm.userId.$error"><span ng-message="required" class="login-validation-color">Please enter your email address</span><div ng-message="email" class="login-validation-color">Please enter a VALID email address</div></div></md-input-container></div><div><md-input-container><label class="login-validation-color">Password</label> <input type="password" style="color:white !important;border-color: rgb(250, 245, 245) !important;" name="passWord" data-ng-model="login.userInfo.passWord" required=""><div ng-messages="login.loginForm.passWord.$error"><span ng-message="required" class="login-validation-color">Password doesn\'t match</span></div></md-input-container></div><div><md-button class="md-raised login-sample-button login-format" data-ng-click="login.onLogin()">Sign In</md-button><span data-ng-click="login.onClickForForgetPassword()" id="Span1" class="login-forgetpassword">Forgot your password?</span></div></form></div></div></div>'),e.put("app/main/main.html","<div layout-fill=\"\" ng-cloak=\"\"><md-content class=\"md-padding\"><div flex=\"\" deckgrid=\"\" class=\"deckgrid\" source=\"main.docs\"><div class=\"a-card\"><a ui-sref=\"collection({collectionId: card.group.value})\"><md-card><md-card-title><div class=\"card-count\" ng-class=\"{'CUSTOMER':'count-customer', 'VENDOR':'count-customer', 'Lead':'count-customer', 'Workflow': 'count-workflow', 'Type': 'count-other', 'Inbox': 'count-other', 'Monat': 'count-other', 'Project': 'count-project', '':'count-other'}[card.group.value]\">{{card.count}}</div><md-card-title-text><span class=\"md-headline\">{{card.group.locale}}</span></md-card-title-text></md-card-title></md-card></a></div></div></md-content></div>"),e.put("app/components/footerbar/footerbar.html",'<md-toolbar layout="row" layout-align="center center" class="footer-bar footer"><div layout="row" flex="" class="fill-height"><h2 class=""><span class="footer-fix"><span ng-if="fm.state === \'collection\'" ng-click="fm.navigateUp()">{{fm.params.category}}</span> <span ng-if="fm.state !== \'home\'" ng-click="fm.navigateUp()">{{fm.params.locale}}</span></span></h2></div></md-toolbar>'),e.put("app/components/navbar/navbar.html",'<md-toolbar layout="row" layout-align="center center" class="header md-primary" ng-hide="vm.state === \'login\'"><i class="mdi mdi-menu hamburger" ng-click="vm.toggle()"></i> <span class="nav-mob-header" ng-click="vm.navigateHome()">{{vm.appConfig.appName}}</span> <span class="nav-back" ng-if="vm.state !== \'home\'"><span class="docs-menu-separator-icon" ng-click="vm.navigateUp()"><i class="material-icons">keyboard_arrow_left</i></span></span><div layout="row" flex="" class="fill-height breadcrumbs"><h2 class="md-toolbar-item md-breadcrumb md-headline"><span><span hide-sm="" hide-md="" ng-click="vm.navigateHome()">{{vm.appConfig.appName}}</span> <span class="docs-menu-separator-icon" hide-sm="" hide-md="" ng-if="vm.state !== \'home\'"><i class="material-icons">keyboard_arrow_right</i></span> <span ng-if="vm.state != \'collection\'" ng-click="vm.navigateUp()">{{vm.params.category}}</span> <span class="docs-menu-separator-icon" hide-sm="" hide-md=""><i class="material-icons" ng-if="vm.state === \'customer\'">keyboard_arrow_right</i></span> <span ng-if="vm.state === \'customer\'" ng-click="vm.navigateUp()">{{vm.params.customerId}}</span> <span class="docs-menu-separator-icon" hide-sm="" hide-md=""><i class="material-icons" ng-if="vm.state === \'customer\'">keyboard_arrow_right</i></span> <span ng-if="vm.state === \'customer\'">Documents</span></span></h2></div><i class="mdi mdi-filter-variant nav-filter"></i> <i class="mdi mdi-dots-vertical nav-options"></i> <i class="mdi mdi-logout-variant nav-logout" ng-click="vm.logout()"></i> <i class="nav-home" ng-click="vm.navigateHome()"><img src="assets/images/365Header.png" style="width:40px"></i></md-toolbar><md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="left"><md-toolbar></md-toolbar><md-content layout-padding=""><nav class="menu"><ul><li ng-click="vm.closeMenu()"><a ui-sref="home"><i class="material-icons">home</i> Home</a></li><li ng-click="vm.closeMenu()" ng-if="vm.state !== \'home\'"><a ng-click="vm.navigateUp()"><i class="material-icons">keyboard_arrow_right</i>{{vm.params.category}}</a></li><li ng-click="vm.closeMenu()" ng-if="vm.state === \'customer\'"><a ui-sref="customer" ng-click="vm.navigateUp()"><i class="material-icons">keyboard_arrow_right</i>{{vm.params.locale}}</a></li><li ng-click="vm.closeMenu()" ng-if="vm.state === \'customer\'"><a ui-sref="customer"><i class="material-icons">keyboard_arrow_right</i>Documents</a></li></ul></nav></md-content></md-sidenav>'),e.put("app/components/sidemenu/sidemenu.html",'<md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="left"><md-toolbar class="md-theme-indigo"><h1 class="md-toolbar-tools">Sidenav Left</h1></md-toolbar><md-content layout-padding=""><md-button ng-click="close()" class="md-primary" hide-gt-md="">Close Sidenav Left</md-button><p hide-md="" show-gt-md="">This sidenav is locked open on your device. To go back to the default behavior, narrow your display.</p></md-content></md-sidenav>'),e.put("app/components/tremulaGrid/tremula.html","")}]);
//# sourceMappingURL=../maps/scripts/app-e23cd51ade.js.map