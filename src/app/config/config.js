/**
 * Created by decipher on 22.4.16.
 */
export class ConfigService {
  constructor($http, $log, $q, CONSTANT) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$q = $q;
    this.constant = CONSTANT;
  }

  getProtocol(env) {
    "use strict"
    let protocol = (this.constant.ENV === 'development') ? this.constant.HTTP : this.constant.HTTPS;
    return protocol;
  }

  getBaseUrl() {
    "use strict";
    let baseUrl = (this.constant.ENV === 'development') ? this.constant.BASEURL_DEV + this.constant.API_ENTRY : this.constant.BASEURL_PROD + this.constant.API_ENTRY;
    return this.getProtocol(this.constant.ENV) + baseUrl;
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
