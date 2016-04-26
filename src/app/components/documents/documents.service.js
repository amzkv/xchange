/**
 * Created by decipher on 17.2.16.
 */
export class DocumentsService {
  constructor($http, $log, ConfigService, LocalAccessService) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.configService = ConfigService;
    this.localAccessService = LocalAccessService;
  }

  callDocumentsCore() {
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

    return this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      collection: info.collection,
      contentType: 'application/json',
      datatype: 'json'
    });
  }

  callDocumentRelated(value) {
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

    return this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      collection: info.collection,
      contentType: 'application/json',
      datatype: 'json'
    });
  }

  callDocumentByOneCollection(id) {
    let credentials = this.localAccessService.getCredentails();
    let info =
    {
      "auth" : {
        "user" : { "username" : credentials.userId, "password" : credentials.passWord }
      },
      "document": {
        "method" : "by collection",
        "collection" : id,
        "offset" : { "start" : 1, "end" : 20 }
      }
    };

    return this.$http.post(this.configService.getBaseUrl() + 'document', {
      auth: info.auth,
      document: info.document,
      contentType: 'application/json',
      datatype: 'json'
    });
  }
}
