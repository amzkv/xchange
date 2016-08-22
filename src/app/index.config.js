export function config ($logProvider, toastrConfig, $mdThemingProvider, $provide, InfinicastWrapperProvider) {
  'ngInject';
  // Enable log
  InfinicastWrapperProvider.setConfig({
    'host': 'https://ws.demo.infinicast.io',
    'scope' : '365xchange',
    'role' : 'myRole',
    'paths' : [
      {
        name: 'userCollection',
        pathType: InfinicastWrapperProvider.pathTypes.userCollection,
        pathConfig: {
          type: 'user',
          dataType: 'collection'
        }
      }
    ]
  });

  $logProvider.debugEnabled(true);

  // Set options third-party lib
  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 3000;
  toastrConfig.positionClass = 'toast-bottom-right';
  toastrConfig.preventDuplicates = false;
  /*toastrConfig.maxOpened = 1;*/
  toastrConfig.progressBar = true;

  /*$mdThemingProvider.theme('default')
    .primaryPalette('deep-purple', {
      'default': '800'
    })
    .accentPalette('red');*/

  $mdThemingProvider.definePalette('365xchangeViolet', {
    '50': 'ffffff',//lighter
    '100': 'ffffff',//light
    '200': 'ffffff',
    '300': '4b0082',//main, dark-lighter, more
    '400': '431862',//main, dark-lighter
    '500': '310055',//#main, dark
    '600': 'e53935',//todo
    '700': 'd32f2f',//todo
    '800': 'c62828',//todo
    '900': 'b71c1c',//todo
    'A100': 'ff8a80',//todo
    'A200': 'ff5252',//todo
    'A400': 'ff1744',//todo
    'A700': 'd50000',//todo
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
      '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });

  $mdThemingProvider.definePalette('365xchangeRed', {
    '50': 'ca5ba3',//lighter
    '100': 'ca3395',//light
    '200': '960061',
    '300': '960061',//main, dark-lighter, more
    '400': '701c53',//main, dark-lighter
    '500': '61003f',//#main, dark
    '600': 'e53935',//todo
    '700': 'd32f2f',//todo
    '800': 'c62828',//todo
    '900': 'b71c1c',//todo
    'A100': 'ff8a80',//todo
    'A200': 'ff5252',//todo
    'A400': 'ff1744',//todo
    'A700': 'd50000',//todo
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
      '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });

  $mdThemingProvider.definePalette('365xchangeGreen', {
    '50': 'b8db62',//lighter
    '100': 'abdb37',//light
    '200': '82b700',
    '300': '82b700',//main, dark-lighter, more
    '400': '6b8922',//main, dark-lighter
    '500': '547700',//#main, dark
    '600': 'e53935',//todo
    '700': 'd32f2f',//todo
    '800': 'c62828',//todo
    '900': 'b71c1c',//todo
    'A100': 'ff8a80',//todo
    'A200': 'ff5252',//todo
    'A400': 'ff1744',//todo
    'A700': 'd50000',//todo
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
      '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });

  $mdThemingProvider.definePalette('365xchangeYellow', {
    '50': 'e0dd65',//lighter
    '100': 'e0dc38',//light
    '200': 'c2bd00',
    '300': 'c2bd00',//main, dark-lighter, more
    '400': '918f24',//main, dark-lighter
    '500': '7e7b00',//#main, dark
    '600': 'e53935',//todo
    '700': 'd32f2f',//todo
    '800': 'c62828',//todo
    '900': 'b71c1c',//todo
    'A100': 'ff8a80',//todo
    'A200': 'ff5252',//todo
    'A400': 'ff1744',//todo
    'A700': 'd50000',//todo
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
      '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('365xchangeViolet');

  $mdThemingProvider.theme('365violet')
    .primaryPalette('365xchangeViolet');

  $mdThemingProvider.theme('365red')
    .primaryPalette('365xchangeRed');

  $mdThemingProvider.theme('365green')
    .primaryPalette('365xchangeGreen');

  $mdThemingProvider.theme('365yellow')
    .primaryPalette('365xchangeYellow');

  //$scope.theme = 'default';

  //$provide.value('themeValue', 'default');

  //$mdThemingProvider.generateThemesOnDemand(true);
  $provide.value('themeProvider', $mdThemingProvider);
  /*$provide.decorator('ngFocusDirective', function($delegate, $parse, $rootScope) {
    var directive = $delegate[0];

    var link = directive.link;
    directive.compile = function($element, attr) {
      var fn = $parse(attr['ngFocusDirective'], /!* interceptorFn *!/ null, /!* expensiveChecks *!/ true);
      var forceAsyncEvents = {
        'blur': true,
        'focus': true
      };
      var eventName = 'focus';
      return function ngEventHandler(scope, element, attr) {
        element.on(eventName, function (event) {
          var callback = function () {
            fn(scope, {$event: event});
          };
          if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
            scope.$evalAsync(callback);
          } else {
            scope.$apply(callback);
          }
        });
      };
    };

    return $delegate;
  });*/

  //console.log($scope);

  $mdThemingProvider.alwaysWatchTheme(true);

}
