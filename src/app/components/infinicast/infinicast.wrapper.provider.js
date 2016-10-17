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

    if (this.isAccessKeyUser) {
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
        self.initGetDataHandlers();
        if (self.user) {
          self.goOnline();
        }
        self.client.onDisconnect(function() {
          console.log('disconnected');
        });
      } else {
        self.errors.push = connectError;
      }
    });
  }

  /*getUserPath(type, dataType) {
    let userid = this.user.account.uuid;
    return '/' + type + '/' + userid + '/' + dataType;
  }*/

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
    if (!pathInfo.pathConfig.checkMultipleIds || (pathInfo.pathConfig.checkMultipleIds && pathInfo.pathConfig.ids.length == 0)) {
      let path = this.getPath(pathInfo);
      let pathName = pathInfo.name;
      //console.log('applying: ' + pathInfo.name);
      self.client.path(path).onDataChange(function(newValue, oldValue, scope) {
        //console.log('onChange:single:',pathName, newValue);
        self.rootScope.$apply(function () {
          self.dataPool[pathName] = newValue;
          //callback.apply(this, args);
        });
      });
    } else {
      let ids = pathInfo.pathConfig.ids;
      let path;
      let pathName;
      angular.forEach(ids, function (id) {
        path = self.getPath(pathInfo, id);
        pathName = pathInfo.name;
        //console.log('init multiple listener',path);
        self.client.path(path).onDataChange(function(newValue, oldValue, scope) {
          //console.log('onChange:multiple:',pathName, newValue);
          self.rootScope.$apply(function () {
            //self.dataPool[pathName] = newValue;
            if (!self.dataPool[pathName]) {
              self.dataPool[pathName] = {};
            }
            self.dataPool[pathName][id] = newValue;
            //callback.apply(this, args);
          });
        });



      });
    }
  }

  applyGetDataDelegate(pathInfo) {
    //new
    let self = this;
    if (!this.listening) {
      return;
    }

    if (pathInfo.pathConfig.getData) {
      //data code
    } else {
      return;
    }

    if (!pathInfo.pathConfig.checkMultipleIds || (pathInfo.pathConfig.checkMultipleIds && pathInfo.pathConfig.ids.length == 0)) {
      let path = this.getPath(pathInfo);
      let pathName = pathInfo.name;
      //console.log('applying: ' + pathInfo.name);
      self.client.path(path).getData(function(error, data, scope) {
        //console.log('getData:single:',pathName, data);
        if (error == null) {
          self.rootScope.$apply(function () {
            self.dataPool[pathName] = data;
          });
        }
      });
    } else {
      let ids = pathInfo.pathConfig.ids;
      let path;
      let pathName;
      angular.forEach(ids, function (id) {
        path = self.getPath(pathInfo, id);
        pathName = pathInfo.name;
        self.client.path(path).getData(function(error, data, scope) {
          //console.log('getData:multiple:', pathName, data);
          if (error == null) {
            self.rootScope.$apply(function () {
              //self.dataPool[pathName] = data;
              if (!self.dataPool[pathName]) {
                self.dataPool[pathName] = {};
              }
              self.dataPool[pathName][id] = data;
              //callback.apply(this, args);
            });
          }
        });
      });
    }
  }

  generateUuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
  }

  updatePathConfig(pathName, variableName, value) {
    let self = this;
    angular.forEach(self.config.paths, function (item) {
      if (item.name == pathName) {
        item.pathConfig[variableName] = value;
      }
    });
  }

  getPath(pathInfo, id) {
    //todo
    switch (pathInfo.pathType) {
      case this.pathTypes.userCollection:
          let userid = this.user ? this.user.account.uuid : this.generateUuid();
          return '/' + pathInfo.pathConfig.type + '/' + userid + '/' + pathInfo.pathConfig.dataType;
      case this.pathTypes.userOnline:
        let accid = '';
        if (this.user && this.user.account && this.user.account.uuid) {
          accid = this.user.account.uuid;
        } else if (id) {
          accid = id;
        }
        //let accid = this.user ? this.user.account.uuid : this.generateUuid();
        return '/' + pathInfo.pathConfig.type + '/' + accid;
      case this.pathTypes.userChat:
          /*let userid2;
          if (this.user && this.user.account.uuid) {
            userid2 = this.user ? this.user.account.uuid : '';
          } else {
            userid2 = this.currentParnter ? this.currentParnter.uuid : '';
          }*/
          let userid2 = '';
          if (this.user && this.user.account && this.user.account.uuid) {
            userid2 = this.user.account.uuid;
          } else if (id) {
            userid2 = id;
          }
          return '/' + pathInfo.pathConfig.type + '/' + userid2;
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
  initGetDataHandlers() {
    let self = this;
    if (self.config.paths) {
      //console.log('init path');
      angular.forEach(self.config.paths, function(item, key){
        //let path = self.getPath(item);
        self.applyGetDataDelegate(item);
        //console.log('path', item);
      });
    } else {
      console.log('no valid paths configured');
    }
  }

  getPathByName(name, id) {
    let self = this;
    let path = null;
    if (self.config.paths) {
      angular.forEach(self.config.paths, function(item, key){
        if (item.name == name) {
          if (id) {
            path = self.getPath(item, id);
          } else {
            path = self.getPath(item);
          }
          return;
        }
      });
    }
    return path;
  }

  getPaths() {
    let self = this;
    return self.config.paths;
  }

  /*setOnChangeDelegate(type, dataType, delegateFunction) {
    let userid = this.user.account.uuid;
    let path = '/' + type + '/' + userid + '/' + dataType;
    this.bindOnChangeDelegate(path, delegateFunction);
  }*/

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

  getData(path, callback) {
    if (!this.listening) {
      return;
    }
    //console.log('set data:', path, data);
    this.client.path(path).getData(callback || function(error, data, context){
      if (error == null) {
        //data
      }
    });
  }

  getDataByPathName(pathName, callback, id) {
    let path = this.getPathByName(pathName, id);
    //console.log('getDataByPathName', path)
    this.getData(path, callback);//callback args: error, data, context
  }

  getDataPoolRecordByPathName(pathName, customId) {

    if (!this.dataPool[pathName]) {
      return;
    }
    if (customId) {
      return this.dataPool[pathName][customId];
    } else {
      return this.dataPool[pathName];
    }
  }

  setRootScope(rootScope) {
    this.rootScope = rootScope;
  }

  goOffline() {
    this.setDataByPathName('userOnline',
      {
        'status': 'offline',
        'time': new Date().getTime()
      });
  }

  goOnline() {
    console.log('online');
    this.setDataByPathName('userOnline',
      {
        'status': 'online',
        'time': new Date().getTime()
      });
  }

  /*setDataByUser(type, dataType, jsonData) {
    //deprecated
    let userid = this.user.account.uuid;
    let path = '/' + type + '/' + userid + '/' + dataType;
    this.setData(path, jsonData);
  }*/

  setDataByPathName(pathName, data) {
    let path = this.getPathByName(pathName, data.idForPath);//idForPath uuid for multiple id case, ex. chat/idForPath
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
      'userCollection': 1,
      'userChat': 10,
      'userOnline' : 11
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
