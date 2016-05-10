/**
 * Created by decipher on 17.2.16.
 */
export class DocumentsService {
  constructor($http, $log, ConfigService, LocalAccessService) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.configService = ConfigService;
    this.initPagerValues();
    this.localAccessService = LocalAccessService;
  }

  initPagerValues() {
    this.configService = this.configService || ConfigService;
    this.startValue = this.configService.getDocumentStartValue();
    this.offset = this.configService.getDocumentOffsetValue();
    this.endValue = this.offset;
    this.busy = false;
  }

  callDocumentsCore() {

    this.busy = true;
    let credentials = this.localAccessService.getCredentails();
    let info =
    {
      "auth" : {
        "user" : { "username" : credentials.userId, "password" : credentials.passWord }
      },
      "collection" : {
        "method" : "core"
      }
    };
    let self = this;
    let promise =  this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      collection: info.collection,
      contentType: 'application/json',
      datatype: 'json'
    });

    promise.then(function(response) {
      self.busy = false;
    });

    return promise;

  }

  callDocumentRelated(value) {

    this.busy = true;

    let credentials = this.localAccessService.getCredentails();
    let info =
    {
      "auth" : {
        "user" : { "username" : credentials.userId, "password" : credentials.passWord }
      },
      "collection": {
        "method": "related by ID",
        "group": { "value": value }
      }
    };

    let self = this;
    let promise = this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      collection: info.collection,
      contentType: 'application/json',
      datatype: 'json'
    });

    promise.then(function(response) {
      self.busy = false;
    });

    return promise;

  }

  callDocumentByOneCollection(id, start, end) {

    this.busy = true;

    let credentials = this.localAccessService.getCredentails();
    let offset_value = this.offset;
    this.startValue = start ? start : this.configService.getDocumentStartValue();
    this.endValue = end ? end : this.configService.getDocumentOffsetValue();

    let info =
    {
      "auth" : {
        "user" : { "username" : credentials.userId, "password" : credentials.passWord }
      },
      "document": {
        "method" : "by collection",
        "collection" : id,
        "offset" : { "start" : this.startValue, "end" : this.endValue }
      }
    };

    let self = this;
    let promise = this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      document: info.document,
      contentType: 'application/json',
      datatype: 'json'
    });

    promise.then(function(response) {
      self.busy = false;
    });

    return promise;
  }
}
