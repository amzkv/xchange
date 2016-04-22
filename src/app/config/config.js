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

  getProtocol() {
    return "http://";
  }

  getBaseUrl() {
    "use strict";
    return this.getProtocol() + 'stage.365xchange.net/api/';
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
    return '365 xchange'
  }


}
