angular.module('ngLocalize.Config', [])
  .value('localeConf', {
    basePath: 'app/languages',
    defaultLocale: 'EN',
    sharedDictionary: 'common',
    fileExtension: '.lang.json',
    persistSelection: true,
    cookieName: 'COOKIE_LOCALE_LANG',
    observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
    delimiter: '::'
  });
angular.module('ngLocalize.InstalledLanguages', [])
  .value('localeSupported', [
    'EN',
    'DE'
  ])
  .value('localeFallbacks', {
    'en': 'EN',
    'de': 'DE'
  });
