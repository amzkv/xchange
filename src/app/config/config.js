/**
 * Created by decipher on 22.4.16.
 */
export class ConfigService {
  constructor($http, $log, $q) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$q = $q;
  }

  getProtocol(env) {
    "use strict"
    let protocol = (env === 'development') ? "http://" : "https://";
    return protocol;
  }

  getBaseUrl(env) {
    "use strict";
    let baseUrl = (env === 'development') ? "stage.365xchange.net/api/" : "365xchange.de/api/";
    return this.getProtocol(env) + baseUrl;
  }

  userServiceURL() {
    "use strict";
    return this.getBaseUrl() + 'user';
  }

  accountServiceURL() {
    "use strict";
    return this.getBaseUrl() + 'account';
  }

  documentServiceURL() {
    "use strict";
    return this.getBaseUrl() + 'document';
  }

  partnerServiceURL() {
    "use strict";
    return this.getBaseUrl() + 'partner';
  }

  appName(){
    "use strict";
    return '365'
  }


}
