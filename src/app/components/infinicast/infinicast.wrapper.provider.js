class InfinicastProxy {
  constructor(client, config, pathTypes) {
    'ngInject';
    this.client = client;
    this.config = config;
    this.pathTypes = pathTypes;
    this.rootScope = null;
    this.listening = false;
    this.errors = [];
    this.user = null;
    this.pathMap = [];
    this.dataPool = {};
  }

  isConfigValid() {
    //simple validation
    if (this.config && this.config.host && this.config.scope && this.config.role) {
      return true;
    }
    console.log('wrong config');
    return false;
  }

  setUser(user) {
    this.user = user;
  }

  isUserValid(skipLog) {
    if (this.user && this.user.account.uuid) {
      return true;
    }
    if (!skipLog) {
      console.log('wrong user');
    }
    return false;
  }

  connect() {
    let self = this;
    this.client.connect(this.config.host, this.config.scope, this.config.role, function(connectError) {
      if (!connectError) {
        console.log('connected');
        //path configs
        self.listening = true;
        self.initOnChangeDataHandlers();
        self.client.onDisconnect(function() {
          console.log('disconnected');
        });
      } else {
        self.errors.push = connectError;
      }
    });
  }

  getUserPath(type, dataType) {
    let userid = this.user.account.uuid;
    return '/' + type + '/' + userid + '/' + dataType;
  }

  bindOnChangeDelegate(path, delegateFunction) {
    //old
    if (!this.listening) {
      return;
    }
    this.client.path(path).onDataChange(delegateFunction);
  }

  applyOnChangeDataDelegate(pathInfo) {
    //new
    let self = this;
    if (!this.listening) {
      return;
    }
    let path = this.getPath(pathInfo);
    let pathName = pathInfo.name;
    //console.log('applying: ' + pathInfo.name);
    this.client.path(path).onDataChange(function(newValue, oldValue, scope) {

      //console.log('onChange:',pathName, newValue);
      //var args = arguments;
      //console.log('rootScope', self.rootScope);
      //self.dataPool[pathName] = newValue;

      self.rootScope.$apply(function () {
        self.dataPool[pathName] = newValue;
        //callback.apply(this, args);
      });

    });
  }

  getPath(pathInfo) {
    //todo
    switch (pathInfo.pathType) {
      case this.pathTypes.userCollection:
          let userid = this.user ? this.user.account.uuid : '';
          return '/' + pathInfo.pathConfig.type + '/' + userid + '/' + pathInfo.pathConfig.dataType;
      default:
            return null;
    }
  }

  onChangeDataEntryPoint(newValue, oldValue, scope) {
    return newValue;
  }

  initOnChangeDataHandlers() {
    let self = this;
    if (self.config.paths) {
      //console.log('init path');
      angular.forEach(self.config.paths, function(item, key){
        //let path = self.getPath(item);
        self.applyOnChangeDataDelegate(item);
        //console.log('path', item);
      });
    } else {
      console.log('no valid paths configured');
    }
  }

  getPathByName(name) {
    let self = this;
    let path = null;
    if (self.config.paths) {
      angular.forEach(self.config.paths, function(item, key){
        if (item.name == name) {
          path = self.getPath(item);
          return;
        }
      });
    }
    return path;
  }

  setOnChangeDelegate(type, dataType, delegateFunction) {
    let userid = this.user.account.uuid;
    let path = '/' + type + '/' + userid + '/' + dataType;
    this.bindOnChangeDelegate(path, delegateFunction);
  }

  /*setOnChangeDelegateByMap(type, dataType) {
    let path = this.getUserPath(type, dataType);
    let func = this.pathMap[path] || function() {};
    this.setOnChangeDelegate(path, func);
  }

  setMapOnChangeDelegate(type, dataType, func) {
    let path = this.getUserPath(type, dataType);
    this.pathMap[path] = func;
  }*/

  setData(path, data) {
    if (!this.listening) {
      return;
    }
    //console.log('set data:', path, data);
    this.client.path(path).setData(data);
  }

  setRootScope(rootScope) {
    this.rootScope = rootScope;
  }

  /*setDataByUser(type, dataType, jsonData) {
    //deprecated
    let userid = this.user.account.uuid;
    let path = '/' + type + '/' + userid + '/' + dataType;
    this.setData(path, jsonData);
  }*/

  setDataByPathName(pathName, data) {
    let path = this.getPathByName(pathName);
    if (path) {
      this.setData(path, data);
    }
  }

  listen() {
    if (this.listening) {
      return;
    }
    if (this.isConfigValid() && this.isUserValid()) {
      this.connect();
    }
  }
}

export class InfinicastWrapper {
  constructor() {
    'ngInject';
    //this.config = {};
    this.pathTypes = {
      'userCollection': 1
    };
    this.client = new Infinicast.InfinicastClient();
    this.config = {};
  }

  setConfig(config) {
    this.config = config;
  }

  $get(){
    /*return {
      client: client,
      config: config
    };*/
    //return this;
    return new InfinicastProxy(this.client, this.config, this.pathTypes);
  }
}
