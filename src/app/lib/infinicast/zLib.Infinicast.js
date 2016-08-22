"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
String.prototype.contains = function (what) {
    return this.indexOf(what) > -1;
};
String.prototype.splitAsPath = function () {
    return this.split("/");
};
String.prototype.startsWith = function (what) {
    return this.indexOf(what) === 0;
};
String.prototype.endsWith = function (what) {
    return this.lastIndexOf(what) === this.length - what.length;
};
String.prototype.remove = function (start) {
    return this.substring(0, start);
};
String.prototype.butLast = function () {
    if (0 === this.length)
        return this;
    return this.remove(this.length - 1);
};
String.isNullOrEmpty = function (what) {
    if (null === what || undefined === what)
        return true;
    if (0 === what.length)
        return true;
    return false;
};
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement /*, fromIndex*/) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length, 10) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1], 10) || 0;
        var k;
        if (n >= 0) {
            k = n;
        }
        else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement) {
                return true;
            }
            k++;
        }
        return false;
    };
}
Array.prototype.remove = function (value) {
    for (var i = this.items.length - 1; i >= 0; i--)
        if (this.items[i] === value)
            this.items.splice(i, 1);
};
var Infinicast;
(function (Infinicast) {
    function getOrAdd(map, key, value) {
        if (Object.keys(map).includes(key))
            return map[key];
        map[key] = value;
        return value;
    }
    Infinicast.getOrAdd = getOrAdd;
    var DateTime = (function () {
        function DateTime(date) {
            if (date === void 0) { date = new Date(); }
            this.mDate = date;
        }
        Object.defineProperty(DateTime, "Now", {
            get: function () {
                return new DateTime();
            },
            enumerable: true,
            configurable: true
        });
        DateTime.prototype.AddSeconds = function (seconds) {
            return new DateTime(new Date(this.mDate.getTime() + 1000 * seconds));
        };
        return DateTime;
    })();
    Infinicast.DateTime = DateTime;
    function getStringArray(json, key) {
        var result = new Array();
        var array = json[key];
        for (var _i = 0; _i < array.length; _i++) {
            var t = array[_i];
            result.push(t);
        }
        return result;
    }
    Infinicast.getStringArray = getStringArray;
    (function (LogLevel) {
        LogLevel[LogLevel["Debug"] = 0] = "Debug";
        LogLevel[LogLevel["Info"] = 1] = "Info";
        LogLevel[LogLevel["Warn"] = 2] = "Warn";
        LogLevel[LogLevel["Error"] = 3] = "Error";
    })(Infinicast.LogLevel || (Infinicast.LogLevel = {}));
    var LogLevel = Infinicast.LogLevel;
    var LoggerSettings = (function () {
        function LoggerSettings() {
        }
        LoggerSettings.CurrentLogLevel = LogLevel.Warn;
        return LoggerSettings;
    })();
    Infinicast.LoggerSettings = LoggerSettings;
    var Logger = (function () {
        function Logger() {
        }
        Logger.prototype.exception = function (where, x) {
            console.error("Exception thrown ", x);
        };
        Logger.prototype.error = function (msg, p1) {
            console.error(msg);
        };
        Logger.prototype.warn = function (msg) {
            console.warn(msg);
        };
        Logger.prototype.debug = function (msg) {
            console.debug(msg);
        };
        Logger.prototype.info = function (msg) {
            //console.log(msg);
        };
        Object.defineProperty(Logger.prototype, "isDebugEnabled", {
            get: function () {
                return LoggerSettings.CurrentLogLevel === LogLevel.Debug;
            },
            enumerable: true,
            configurable: true
        });
        return Logger;
    })();
    Infinicast.Logger = Logger;
    var LoggerFactory = (function () {
        function LoggerFactory() {
        }
        LoggerFactory.getLogger = function (name) {
            return new Logger();
        };
        return LoggerFactory;
    })();
    Infinicast.LoggerFactory = LoggerFactory;
    var APlayStringMessage = (function () {
        function APlayStringMessage() {
        }
        return APlayStringMessage;
    })();
    Infinicast.APlayStringMessage = APlayStringMessage;
    var ServerAddress = (function () {
        function ServerAddress() {
        }
        return ServerAddress;
    })();
    Infinicast.ServerAddress = ServerAddress;
    var TcpEndpoint2ServerNetLayer = (function () {
        function TcpEndpoint2ServerNetLayer() {
        }
        TcpEndpoint2ServerNetLayer.prototype.Open = function (settings) {
            var connection = io.connect("" + settings.ServerAddress.Address);
            this.connection = connection;
            connection.on("m", function (data) {
                var asJson = JSON.parse(data);
                //console.log("received", asJson);
                if (asJson.type === "Connected")
                    settings.Handler.onConnect(); // high level connection worked
                else {
                    var msg = new APlayStringMessage();
                    msg.DataAsString = data;
                    settings.Handler.onReceiveFromServer(msg);
                }
            });
            return null;
        };
        TcpEndpoint2ServerNetLayer.prototype.Close = function () {
            this.connection.close();
        };
        TcpEndpoint2ServerNetLayer.prototype.SendToServer = function (message) {
            this.connection.emit("m", message.DataAsString);
        };
        return TcpEndpoint2ServerNetLayer;
    })();
    Infinicast.TcpEndpoint2ServerNetLayer = TcpEndpoint2ServerNetLayer;
    var Endpoint2ServerNetSettings = (function () {
        function Endpoint2ServerNetSettings() {
        }
        return Endpoint2ServerNetSettings;
    })();
    Infinicast.Endpoint2ServerNetSettings = Endpoint2ServerNetSettings;
    var Exception = (function () {
        function Exception(message) {
            this.message = message;
        }
        return Exception;
    })();
    Infinicast.Exception = Exception;
    var NotImplementedException = (function (_super) {
        __extends(NotImplementedException, _super);
        function NotImplementedException(message) {
            if (message === void 0) { message = "Not implemented"; }
            _super.call(this, message);
        }
        return NotImplementedException;
    })(Exception);
    Infinicast.NotImplementedException = NotImplementedException;
    var Debug = (function () {
        function Debug() {
        }
        Debug.Assert = function (what, messageIfNotTrue) {
            if (!what)
                throw new Error("Assertion failed: " + messageIfNotTrue);
        };
        return Debug;
    })();
    Infinicast.Debug = Debug;
    var ThreadPool = (function () {
        function ThreadPool() {
        }
        ThreadPool.QueueUserWorkItem = function (workItem) {
            workItem(null);
        };
        return ThreadPool;
    })();
    Infinicast.ThreadPool = ThreadPool;
    var AVoid = (function () {
        function AVoid() {
        }
        return AVoid;
    })();
    Infinicast.AVoid = AVoid;
    var Promise = (function () {
        function Promise() {
            this.innerPromise = Promise.Factory();
        }
        Promise.prototype.reject = function (o) {
            this.innerPromise.reject(o);
        };
        Promise.prototype.resolve = function (o) {
            this.innerPromise.resolve(o);
        };
        Promise.prototype.getData = function () {
            return this.innerPromise.getData();
        };
        return Promise;
    })();
    Infinicast.Promise = Promise;
    var StringUtils = (function () {
        function StringUtils() {
        }
        StringUtils.GetStringPathEleByIdx = function (path, idx) {
            if (String.isNullOrEmpty(path))
                return "";
            var sb = "";
            var count = 0;
            var inside = false;
            for (var i = 0; i < path.length; i++) {
                if (path.charAt(i) === '/') {
                    if (count === idx) {
                        inside = true;
                    }
                    else if (count === idx + 1) {
                        return sb.toString();
                    }
                    count++;
                }
                else {
                    if (inside) {
                        sb += path.charAt(i);
                    }
                }
            }
            return "";
        };
        return StringUtils;
    })();
    Infinicast.StringUtils = StringUtils;
    var Logger = Infinicast.Logger;
    var LoggerFactory = Infinicast.LoggerFactory;
    var DateTime = Infinicast.DateTime;
    var Exception = Infinicast.Exception;
    var LogLevel = Infinicast.LogLevel;
    var NotImplementedException = Infinicast.NotImplementedException;
    var AfinityJsonDataQueryType = (function () {
        function AfinityJsonDataQueryType() {
        }
        AfinityJsonDataQueryType.All = "All";
        AfinityJsonDataQueryType.EqualsJson = "EqualsJson";
        return AfinityJsonDataQueryType;
    })();
    Infinicast.AfinityJsonDataQueryType = AfinityJsonDataQueryType;
    var AtomicChangeType = (function () {
        function AtomicChangeType() {
        }
        AtomicChangeType.Set = "Set";
        AtomicChangeType.AddToArray = "AddToArray";
        AtomicChangeType.RemoveFromArray = "RemoveFromArray";
        AtomicChangeType.IncValue = "IncValue";
        AtomicChangeType.DecValue = "DecValue";
        AtomicChangeType.AddToSet = "AddToSet";
        AtomicChangeType.RemoveFromSet = "RemoveFromSet";
        AtomicChangeType.RemoveProperty = "RemoveProperty";
        return AtomicChangeType;
    })();
    Infinicast.AtomicChangeType = AtomicChangeType;
    var DataContextRelativeOptions = (function () {
        function DataContextRelativeOptions() {
        }
        DataContextRelativeOptions.Root = "Root";
        DataContextRelativeOptions.SenderEndpoint = "SenderEndpoint";
        return DataContextRelativeOptions;
    })();
    Infinicast.DataContextRelativeOptions = DataContextRelativeOptions;
    var ListenTerminateReason = (function () {
        function ListenTerminateReason() {
        }
        ListenTerminateReason.UserRemoved = "UserRemoved";
        ListenTerminateReason.RoleRemoved = "RoleRemoved";
        return ListenTerminateReason;
    })();
    Infinicast.ListenTerminateReason = ListenTerminateReason;
    var ListeningType = (function () {
        function ListeningType() {
        }
        ListeningType.Any = "Any";
        ListeningType.Message = "Message";
        ListeningType.Data = "Data";
        ListeningType.Request = "Request";
        return ListeningType;
    })();
    Infinicast.ListeningType = ListeningType;
    var AMessageLevel = (function () {
        function AMessageLevel() {
        }
        AMessageLevel.Error = "Error";
        return AMessageLevel;
    })();
    Infinicast.AMessageLevel = AMessageLevel;
    var Connector2EpsMessageType = (function () {
        function Connector2EpsMessageType() {
        }
        Connector2EpsMessageType.RequestResponse = "RequestResponse";
        Connector2EpsMessageType.Request = "Request";
        Connector2EpsMessageType.InitConnector = "InitConnector";
        Connector2EpsMessageType.JsonQuery = "JsonQuery";
        Connector2EpsMessageType.CreateChildRequest = "CreateChildRequest";
        Connector2EpsMessageType.SetObjectData = "SetObjectData";
        Connector2EpsMessageType.IntroduceObject = "IntroduceObject";
        Connector2EpsMessageType.Message = "Message";
        Connector2EpsMessageType.MessageValidate = "MessageValidate";
        Connector2EpsMessageType.MessageValidated = "MessageValidated";
        Connector2EpsMessageType.ListAdd = "ListAdd";
        Connector2EpsMessageType.ListRemove = "ListRemove";
        Connector2EpsMessageType.ListChange = "ListChange";
        Connector2EpsMessageType.RemoveHandlers = "RemoveHandlers";
        Connector2EpsMessageType.RegisterHandler = "RegisterHandler";
        Connector2EpsMessageType.CreateOrUpdateRole = "CreateOrUpdateRole";
        Connector2EpsMessageType.DestroyRole = "DestroyRole";
        Connector2EpsMessageType.ModifyRoleForPath = "ModifyRoleForPath";
        Connector2EpsMessageType.GetRoleForPath = "GetRoleForPath";
        Connector2EpsMessageType.GetOrCreate = "GetOrCreate";
        Connector2EpsMessageType.ListeningEnded = "ListeningEnded";
        Connector2EpsMessageType.ListeningStarted = "ListeningStarted";
        Connector2EpsMessageType.DeleteFromCollection = "DeleteFromCollection";
        Connector2EpsMessageType.DebugPingInfo = "DebugPingInfo";
        Connector2EpsMessageType.DebugInfoMessage = "DebugInfoMessage";
        Connector2EpsMessageType.DebugStatistics = "DebugStatistics";
        Connector2EpsMessageType.PathRoleSetup = "PathRoleSetup";
        Connector2EpsMessageType.SetDebugName = "SetDebugName";
        Connector2EpsMessageType.GetObjectData = "GetObjectData";
        Connector2EpsMessageType.GetListeningList = "GetListeningList";
        Connector2EpsMessageType.UpdateData = "UpdateData";
        Connector2EpsMessageType.SetChildData = "SetChildData";
        Connector2EpsMessageType.ModifyChildData = "ModifyChildData";
        Connector2EpsMessageType.RemoveChildren = "RemoveChildren";
        Connector2EpsMessageType.GetEndpointConnectionInfo = "GetEndpointConnectionInfo";
        Connector2EpsMessageType.Reminder = "Reminder";
        Connector2EpsMessageType.AddReminder = "AddReminder";
        Connector2EpsMessageType.DeleteReminder = "DeleteReminder";
        Connector2EpsMessageType.GetAndListenOnChildren = "GetAndListenOnChildren";
        Connector2EpsMessageType.DataListenUpdate = "DataListenUpdate";
        Connector2EpsMessageType.ListeningChanged = "ListeningChanged";
        Connector2EpsMessageType.GetAndListenOnListeners = "GetAndListenOnListeners";
        Connector2EpsMessageType.ListenTerminate = "ListenTerminate";
        Connector2EpsMessageType.SystemCommand = "SystemCommand";
        Connector2EpsMessageType.DataChangeValidate = "DataChangeValidate";
        Connector2EpsMessageType.DataChangeValidated = "DataChangeValidated";
        Connector2EpsMessageType.EndpointDisconnected = "EndpointDisconnected";
        Connector2EpsMessageType.DebugObserverMessage = "DebugObserverMessage";
        return Connector2EpsMessageType;
    })();
    Infinicast.Connector2EpsMessageType = Connector2EpsMessageType;
    var Eps2ConnectorMessageType = (function () {
        function Eps2ConnectorMessageType() {
        }
        Eps2ConnectorMessageType.Message = "Message";
        Eps2ConnectorMessageType.Request = "Request";
        Eps2ConnectorMessageType.RequestResponse = "RequestResponse";
        Eps2ConnectorMessageType.RegisterHandler = "RegisterHandler";
        Eps2ConnectorMessageType.JsonQueryResult = "JsonQueryResult";
        Eps2ConnectorMessageType.CreateChildSuccess = "CreateChildSuccess";
        Eps2ConnectorMessageType.IntroduceObject = "IntroduceObject";
        Eps2ConnectorMessageType.MessageValidate = "MessageValidate";
        Eps2ConnectorMessageType.ListAdd = "ListAdd";
        Eps2ConnectorMessageType.ListChange = "ListChange";
        Eps2ConnectorMessageType.InitConnector = "InitConnector";
        Eps2ConnectorMessageType.SetObjectData = "SetObjectData";
        Eps2ConnectorMessageType.DataChangeValidate = "DataChangeValidate";
        Eps2ConnectorMessageType.GetOrCreate = "GetOrCreate";
        Eps2ConnectorMessageType.CreateOrUpdateRole = "CreateOrUpdateRole";
        Eps2ConnectorMessageType.DestroyRole = "DestroyRole";
        Eps2ConnectorMessageType.GetRoleForPathResult = "GetRoleForPathResult";
        Eps2ConnectorMessageType.ListeningStarted = "ListeningStarted";
        Eps2ConnectorMessageType.ListeningEnded = "ListeningEnded";
        Eps2ConnectorMessageType.ListeningChanged = "ListeningChanged";
        Eps2ConnectorMessageType.ListenTerminate = "ListenTerminate";
        Eps2ConnectorMessageType.EndpointDisconnected = "EndpointDisconnected";
        Eps2ConnectorMessageType.DebugStatistics = "DebugStatistics";
        Eps2ConnectorMessageType.PathRoleSetup = "PathRoleSetup";
        Eps2ConnectorMessageType.Reminder = "Reminder";
        Eps2ConnectorMessageType.ListRemove = "ListRemove";
        Eps2ConnectorMessageType.DebugObserverMessage = "DebugObserverMessage";
        return Eps2ConnectorMessageType;
    })();
    Infinicast.Eps2ConnectorMessageType = Eps2ConnectorMessageType;
    var AfinityException = (function (_super) {
        __extends(AfinityException, _super);
        function AfinityException(info) {
            _super.call(this, info.message);
        }
        AfinityException.prototype.toString = function () {
            return this.message;
        };
        return AfinityException;
    })(Exception);
    Infinicast.AfinityException = AfinityException;
    var AfinityNamedJsonDataQuery = (function () {
        function AfinityNamedJsonDataQuery() {
        }
        Object.defineProperty(AfinityNamedJsonDataQuery.prototype, "query", {
            get: function () {
                return this._query;
            },
            set: function (value) {
                this._query = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AfinityNamedJsonDataQuery.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
            },
            enumerable: true,
            configurable: true
        });
        return AfinityNamedJsonDataQuery;
    })();
    Infinicast.AfinityNamedJsonDataQuery = AfinityNamedJsonDataQuery;
    var ICDataQuery = (function () {
        function ICDataQuery() {
            this.dataFilters = new Array();
            this.limit = -1;
            this.start = -1;
        }
        Object.defineProperty(ICDataQuery.prototype, "dataFilters", {
            get: function () {
                return this._dataFilters;
            },
            set: function (value) {
                this._dataFilters = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ICDataQuery.prototype, "limit", {
            get: function () {
                return this._limit;
            },
            set: function (value) {
                this._limit = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ICDataQuery.prototype, "start", {
            get: function () {
                return this._start;
            },
            set: function (value) {
                this._start = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ICDataQuery.prototype, "orderCriteria", {
            get: function () {
                return this._orderCriteria;
            },
            set: function (value) {
                this._orderCriteria = value;
            },
            enumerable: true,
            configurable: true
        });
        ICDataQuery.prototype.toJson = function () {
            var data = new Object();
            var filters = new Array();
            for (var _i = 0, _a = this.dataFilters; _i < _a.length; _i++) {
                var icDataFilter = _a[_i];
                filters.push(icDataFilter.toJson());
            }
            data["filters"] = filters;
            if ((this.limit != -1)) {
                data["limit"] = this.limit;
            }
            if ((this.start != -1)) {
                data["start"] = this.start;
            }
            if ((this.orderCriteria != null)) {
                data["order"] = this.orderCriteria.field;
                if (this.orderCriteria.isAscending) {
                    data["orderAsc"] = this.orderCriteria.isAscending;
                }
            }
            return data;
        };
        return ICDataQuery;
    })();
    Infinicast.ICDataQuery = ICDataQuery;
    var EndpointConnectionInfo = (function () {
        function EndpointConnectionInfo() {
        }
        return EndpointConnectionInfo;
    })();
    Infinicast.EndpointConnectionInfo = EndpointConnectionInfo;
    /**
     * Field filter class can be used to filter on fields as part of a ChildrenQuery
    */
    var Filter = (function () {
        function Filter() {
            this.data = new Object();
        }
        /**
         * begins a fluent definition for a Filter for the given @see {@link field}
         * @param field
         * @return the created Filter.
        */
        Filter.field = function (field) {
            var ff = new Filter();
            ff.data["field"] = field;
            return ff;
        };
        /**
         * inverses the result of the field filter. For example Filter.Field("online").Not().Eq(true) would return elements with false
         * @return
        */
        Filter.prototype.not = function () {
            this.data["not"] = true;
            return this;
        };
        /**
         * checks if the field and the passed @see {@link value} are equal
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.eq1 = function (value) {
            this.data["op"] = "eq";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field and the passed @see {@link value} are equal
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.eq2 = function (value) {
            this.data["op"] = "eq";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field and the passed @see {@link value} are equal
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.eq3 = function (value) {
            this.data["op"] = "eq";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field and the passed @see {@link value} are equal
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.eq4 = function (value) {
            this.data["op"] = "eq";
            this.data["value"] = value;
            return this;
        };
        /**
         * compares the field with the passed @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.eq5 = function (value) {
            this.data["op"] = "eq";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field and the passed @see {@link value} are equal
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.eq6 = function (value) {
            this.data["op"] = "eq";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is greater then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.gt1 = function (value) {
            this.data["op"] = "gt";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is greater then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.gt2 = function (value) {
            this.data["op"] = "gt";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is greater then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.gt3 = function (value) {
            this.data["op"] = "gt";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is greater then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.gt4 = function (value) {
            this.data["op"] = "gt";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is less then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.lt1 = function (value) {
            this.data["op"] = "lt";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is less then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.lt2 = function (value) {
            this.data["op"] = "lt";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is less then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.lt3 = function (value) {
            this.data["op"] = "lt";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is less then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.lt4 = function (value) {
            this.data["op"] = "lt";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is a collection (array) that contains the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.collectionContains1 = function (value) {
            this.data["op"] = "contains";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is a collection (array) that contains the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.collectionContains2 = function (value) {
            this.data["op"] = "contains";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is a collection (array) that contains the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.collectionContains3 = function (value) {
            this.data["op"] = "contains";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is a collection (array) that contains the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.collectionContains4 = function (value) {
            this.data["op"] = "contains";
            this.data["value"] = value;
            return this;
        };
        /**
         * checks if the field is a collection (array) that contains the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.collectionContains5 = function (value) {
            this.data["op"] = "contains";
            this.data["value"] = value;
            return this;
        };
        /**
         * converts the Filter to a json object
         * @return
        */
        Filter.prototype.toJson = function () {
            return this.data;
        };
        /**
         * checks if the field and the passed @see {@link value} are equal
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.eq = function (value) {
            // dispatching to 'overload':
            if (('boolean' == typeof (value))) {
                return this.eq1(value);
            }
            else if (('string' == typeof (value))) {
                return this.eq2(value);
            }
            else if (('number' == typeof (value))) {
                return this.eq3(value);
            }
            else if (('number' == typeof (value))) {
                return this.eq4(value);
            }
            else if (('number' == typeof (value))) {
                return this.eq5(value);
            }
            else if (('number' == typeof (value))) {
                return this.eq6(value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * checks if the field is greater then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.gt = function (value) {
            // dispatching to 'overload':
            if (('number' == typeof (value))) {
                return this.gt1(value);
            }
            else if (('number' == typeof (value))) {
                return this.gt2(value);
            }
            else if (('number' == typeof (value))) {
                return this.gt3(value);
            }
            else if (('number' == typeof (value))) {
                return this.gt4(value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * checks if the field is less then the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.lt = function (value) {
            // dispatching to 'overload':
            if (('number' == typeof (value))) {
                return this.lt1(value);
            }
            else if (('number' == typeof (value))) {
                return this.lt2(value);
            }
            else if (('number' == typeof (value))) {
                return this.lt3(value);
            }
            else if (('number' == typeof (value))) {
                return this.lt4(value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * checks if the field is a collection (array) that contains the @see {@link value}
         * @param value the value to be compared
         * @return
        */
        Filter.prototype.collectionContains = function (value) {
            // dispatching to 'overload':
            if (('string' == typeof (value))) {
                return this.collectionContains1(value);
            }
            else if (('number' == typeof (value))) {
                return this.collectionContains2(value);
            }
            else if (('number' == typeof (value))) {
                return this.collectionContains3(value);
            }
            else if (('number' == typeof (value))) {
                return this.collectionContains4(value);
            }
            else if (('number' == typeof (value))) {
                return this.collectionContains5(value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        return Filter;
    })();
    Infinicast.Filter = Filter;
    var ListenOnListenersHandlerWithoutChange = (function () {
        function ListenOnListenersHandlerWithoutChange() {
            this._OnListeningStarted = null;
            this._OnListeningEnded = null;
        }
        ListenOnListenersHandlerWithoutChange.prototype.withOnListeningStartedHandler = function (onAdd) {
            this._OnListeningStarted = onAdd;
            return this;
        };
        ListenOnListenersHandlerWithoutChange.prototype.withListeningEndedHandler = function (onRemove) {
            this._OnListeningEnded = onRemove;
            return this;
        };
        ListenOnListenersHandlerWithoutChange.prototype.onListeningStarted = function (context) {
            if ((this._OnListeningStarted != null)) {
                this._OnListeningStarted(context);
            }
        };
        ListenOnListenersHandlerWithoutChange.prototype.onListeningEnded = function (context) {
            if ((this._OnListeningEnded != null)) {
                this._OnListeningEnded(context);
            }
        };
        return ListenOnListenersHandlerWithoutChange;
    })();
    Infinicast.ListenOnListenersHandlerWithoutChange = ListenOnListenersHandlerWithoutChange;
    var ListenOnListenersHandler = (function () {
        function ListenOnListenersHandler() {
            this._OnListeningStarted = null;
            this._OnListeningChanged = null;
            this._OnListeningEnded = null;
        }
        ListenOnListenersHandler.prototype.withOnListeningStartedHandler = function (onAdd) {
            this._OnListeningStarted = onAdd;
            return this;
        };
        ListenOnListenersHandler.prototype.withOnListeningChangedHandler = function (onChange) {
            this._OnListeningChanged = onChange;
            return this;
        };
        ListenOnListenersHandler.prototype.withListeningEndedHandler = function (onRemove) {
            this._OnListeningEnded = onRemove;
            return this;
        };
        ListenOnListenersHandler.prototype.onListeningStarted = function (context) {
            if ((this._OnListeningStarted != null)) {
                this._OnListeningStarted(context);
            }
        };
        ListenOnListenersHandler.prototype.onListeningChanged = function (context) {
            if ((this._OnListeningChanged != null)) {
                this._OnListeningChanged(context);
            }
        };
        ListenOnListenersHandler.prototype.onListeningEnded = function (context) {
            if ((this._OnListeningEnded != null)) {
                this._OnListeningEnded(context);
            }
        };
        return ListenOnListenersHandler;
    })();
    Infinicast.ListenOnListenersHandler = ListenOnListenersHandler;
    var ListenOnDataHandler = (function () {
        function ListenOnDataHandler() {
            this._onAdd = null;
            this._onChange = null;
            this._onRemove = null;
        }
        ListenOnDataHandler.prototype.withAddHandler = function (onAdd) {
            this._onAdd = onAdd;
            return this;
        };
        ListenOnDataHandler.prototype.withChangeHandler = function (onChange) {
            this._onChange = onChange;
            return this;
        };
        ListenOnDataHandler.prototype.withRemoveHandler = function (onRemove) {
            this._onRemove = onRemove;
            return this;
        };
        ListenOnDataHandler.prototype.onAdd = function (data, context) {
            if ((this._onAdd != null)) {
                this._onAdd(data, context);
            }
        };
        ListenOnDataHandler.prototype.onChange = function (data, context) {
            if ((this._onChange != null)) {
                this._onChange(data, context);
            }
        };
        ListenOnDataHandler.prototype.onRemove = function (data, context) {
            if ((this._onRemove != null)) {
                this._onRemove(data, context);
            }
        };
        return ListenOnDataHandler;
    })();
    Infinicast.ListenOnDataHandler = ListenOnDataHandler;
    var ObjectChangeInformation = (function () {
        function ObjectChangeInformation() {
        }
        return ObjectChangeInformation;
    })();
    Infinicast.ObjectChangeInformation = ObjectChangeInformation;
    var HandlerRegistrationOptionsData = (function () {
        function HandlerRegistrationOptionsData() {
            this.sendingEndpointDataContext = false;
            this.dataContextPaths = null;
        }
        Object.defineProperty(HandlerRegistrationOptionsData.prototype, "isOncePerRole", {
            get: function () {
                return this._isOncePerRole;
            },
            set: function (value) {
                this._isOncePerRole = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HandlerRegistrationOptionsData.prototype, "isSticky", {
            get: function () {
                return this._isSticky;
            },
            set: function (value) {
                this._isSticky = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HandlerRegistrationOptionsData.prototype, "listenerType", {
            get: function () {
                return this._listenerType;
            },
            set: function (value) {
                this._listenerType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HandlerRegistrationOptionsData.prototype, "roleFilter", {
            get: function () {
                return this._roleFilter;
            },
            set: function (value) {
                this._roleFilter = value;
            },
            enumerable: true,
            configurable: true
        });
        return HandlerRegistrationOptionsData;
    })();
    Infinicast.HandlerRegistrationOptionsData = HandlerRegistrationOptionsData;
    var HandlerRegistrationOptions = (function (_super) {
        __extends(HandlerRegistrationOptions, _super);
        function HandlerRegistrationOptions() {
            _super.call(this);
        }
        HandlerRegistrationOptions.prototype.stickyOncePerRole = function () {
            this.isOncePerRole = true;
            this.isSticky = true;
            return this;
        };
        HandlerRegistrationOptions.prototype.oncePerRole = function () {
            this.isOncePerRole = true;
            return this;
        };
        HandlerRegistrationOptions.prototype.withSendingEndpointDataContext = function () {
            this.sendingEndpointDataContext = true;
            return this;
        };
        HandlerRegistrationOptions.prototype.withDataContext = function (path, relative) {
            if (relative === void 0) { relative = DataContextRelativeOptions.Root; }
            if ((this.dataContextPaths == null)) {
                this.dataContextPaths = new Array();
            }
            var r = new DataContextRequest();
            r.path = path;
            r.relativeTo = relative;
            this.dataContextPaths.push(r);
            return this;
        };
        return HandlerRegistrationOptions;
    })(HandlerRegistrationOptionsData);
    Infinicast.HandlerRegistrationOptions = HandlerRegistrationOptions;
    var ReminderSchedulingOptions = (function () {
        function ReminderSchedulingOptions() {
        }
        ReminderSchedulingOptions.prototype.withFixedDate = function (dateTime_) {
            this.dateTime = dateTime_;
            return this;
        };
        ReminderSchedulingOptions.prototype.toJson = function () {
            var json = new Object();
            json["fixed"] = this.dateTime;
            return json;
        };
        return ReminderSchedulingOptions;
    })();
    Infinicast.ReminderSchedulingOptions = ReminderSchedulingOptions;
    var QueryOptionsData = (function () {
        function QueryOptionsData() {
            this.noData = false;
            this.order = null;
            this.start = 0;
            this.limit = 0;
            this.dataContextPaths = null;
        }
        return QueryOptionsData;
    })();
    Infinicast.QueryOptionsData = QueryOptionsData;
    var ModifyAndGetChildrenOptions = (function (_super) {
        __extends(ModifyAndGetChildrenOptions, _super);
        function ModifyAndGetChildrenOptions() {
            _super.call(this);
        }
        ModifyAndGetChildrenOptions.prototype.withoutData = function () {
            this.noData = true;
            return this;
        };
        ModifyAndGetChildrenOptions.prototype.withOrder = function (order) {
            this.order = order;
            return this;
        };
        ModifyAndGetChildrenOptions.prototype.withStart = function (start) {
            this.start = start;
            return this;
        };
        ModifyAndGetChildrenOptions.prototype.withLimit = function (limit) {
            this.limit = limit;
            return this;
        };
        ModifyAndGetChildrenOptions.prototype.withDataContext = function (path, relative) {
            if (relative === void 0) { relative = DataContextRelativeOptions.Root; }
            if ((this.dataContextPaths == null)) {
                this.dataContextPaths = new Array();
            }
            var r = new DataContextRequest();
            r.path = path;
            r.relativeTo = relative;
            this.dataContextPaths.push(r);
            return this;
        };
        return ModifyAndGetChildrenOptions;
    })(QueryOptionsData);
    Infinicast.ModifyAndGetChildrenOptions = ModifyAndGetChildrenOptions;
    var QueryOptions = (function (_super) {
        __extends(QueryOptions, _super);
        function QueryOptions() {
            _super.call(this);
        }
        QueryOptions.prototype.withoutData = function () {
            this.noData = true;
            return this;
        };
        QueryOptions.prototype.withOrder = function (order) {
            this.order = order;
            return this;
        };
        QueryOptions.prototype.withStart = function (start) {
            this.start = start;
            return this;
        };
        QueryOptions.prototype.withLimit = function (limit) {
            this.limit = limit;
            return this;
        };
        QueryOptions.prototype.withDataContext = function (path, relative) {
            if (relative === void 0) { relative = DataContextRelativeOptions.Root; }
            if ((this.dataContextPaths == null)) {
                this.dataContextPaths = new Array();
            }
            var r = new DataContextRequest();
            r.path = path;
            r.relativeTo = relative;
            this.dataContextPaths.push(r);
            return this;
        };
        return QueryOptions;
    })(QueryOptionsData);
    Infinicast.QueryOptions = QueryOptions;
    var GetDataOptionsData = (function () {
        function GetDataOptionsData() {
            this.dataContextPaths = null;
        }
        return GetDataOptionsData;
    })();
    Infinicast.GetDataOptionsData = GetDataOptionsData;
    var GetDataOptions = (function (_super) {
        __extends(GetDataOptions, _super);
        function GetDataOptions() {
            _super.call(this);
        }
        GetDataOptions.prototype.withDataContext = function (path, relative) {
            if (relative === void 0) { relative = DataContextRelativeOptions.Root; }
            if ((this.dataContextPaths == null)) {
                this.dataContextPaths = new Array();
            }
            var r = new DataContextRequest();
            r.path = path;
            r.relativeTo = relative;
            this.dataContextPaths.push(r);
            return this;
        };
        return GetDataOptions;
    })(GetDataOptionsData);
    Infinicast.GetDataOptions = GetDataOptions;
    var DataContextRequest = (function () {
        function DataContextRequest() {
        }
        return DataContextRequest;
    })();
    Infinicast.DataContextRequest = DataContextRequest;
    var ListeningHandlerRegistrationOptionsData = (function (_super) {
        __extends(ListeningHandlerRegistrationOptionsData, _super);
        function ListeningHandlerRegistrationOptionsData() {
            _super.call(this);
        }
        return ListeningHandlerRegistrationOptionsData;
    })(HandlerRegistrationOptionsData);
    Infinicast.ListeningHandlerRegistrationOptionsData = ListeningHandlerRegistrationOptionsData;
    var ListeningHandlerRegistrationOptions = (function (_super) {
        __extends(ListeningHandlerRegistrationOptions, _super);
        function ListeningHandlerRegistrationOptions() {
            _super.call(this);
        }
        ListeningHandlerRegistrationOptions.prototype.withSendingEndpointDataContext = function () {
            this.sendingEndpointDataContext = true;
            return this;
        };
        ListeningHandlerRegistrationOptions.prototype.withDataContext = function (path, relative) {
            if (relative === void 0) { relative = DataContextRelativeOptions.Root; }
            if ((this.dataContextPaths == null)) {
                this.dataContextPaths = new Array();
            }
            var r = new DataContextRequest();
            r.path = path;
            r.relativeTo = relative;
            this.dataContextPaths.push(r);
            return this;
        };
        ListeningHandlerRegistrationOptions.prototype.withRole = function (role) {
            this.roleFilter = role;
            return this;
        };
        ListeningHandlerRegistrationOptions.prototype.oncePerRole = function () {
            this.isOncePerRole = true;
            return this;
        };
        return ListeningHandlerRegistrationOptions;
    })(ListeningHandlerRegistrationOptionsData);
    Infinicast.ListeningHandlerRegistrationOptions = ListeningHandlerRegistrationOptions;
    var ListenerRequestOptionsData = (function () {
        function ListenerRequestOptionsData() {
            this.role = "";
        }
        return ListenerRequestOptionsData;
    })();
    Infinicast.ListenerRequestOptionsData = ListenerRequestOptionsData;
    var ListenerRequestOptions = (function (_super) {
        __extends(ListenerRequestOptions, _super);
        function ListenerRequestOptions() {
            _super.call(this);
        }
        ListenerRequestOptions.prototype.withRole = function (role_) {
            this.role = role_;
            return this;
        };
        return ListenerRequestOptions;
    })(ListenerRequestOptionsData);
    Infinicast.ListenerRequestOptions = ListenerRequestOptions;
    var ErrorInfo = (function () {
        /**
         * DO NOT USE directly. Must be public only for the transpiled C++ code.
         * @param message
         * @param path
        */
        function ErrorInfo(message, path) {
            this.message = message;
            if (!(String.isNullOrEmpty(path))) {
                this.message = ((this.message + " path: ") + path);
            }
        }
        Object.defineProperty(ErrorInfo.prototype, "message", {
            get: function () {
                return this._message;
            },
            set: function (value) {
                this._message = value;
            },
            enumerable: true,
            configurable: true
        });
        ErrorInfo.fromMessage = function (message, path) {
            return new ErrorInfo(message, path);
        };
        ErrorInfo.fromJson = function (errorJson, path) {
            return new ErrorInfo(errorJson["msg"], path);
        };
        ErrorInfo.prototype.toString = function () {
            return this.message;
        };
        ErrorInfo.prototype.append = function (error) {
            this.message += error.message;
        };
        ErrorInfo.fromException = function (x, path) {
            return ErrorInfo.fromMessage(x.message, path);
        };
        return ErrorInfo;
    })();
    Infinicast.ErrorInfo = ErrorInfo;
    var InternAtomicChange = (function () {
        function InternAtomicChange() {
            this.json = new Object();
        }
        Object.defineProperty(InternAtomicChange.prototype, "jsonProperty", {
            get: function () {
                return this.json["property"];
            },
            set: function (value) {
                this.json["property"] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InternAtomicChange.prototype, "type", {
            get: function () {
                return AtomicChangeType[this.json["type"]];
            },
            set: function (value) {
                this.json["type"] = value.toString();
            },
            enumerable: true,
            configurable: true
        });
        InternAtomicChange.prototype.setData1 = function (val) {
            this.json["data"] = val;
        };
        InternAtomicChange.prototype.setData2 = function (val) {
            this.json["data"] = val;
        };
        InternAtomicChange.prototype.setData3 = function (val) {
            this.json["data"] = val;
        };
        InternAtomicChange.prototype.setData4 = function (val) {
            this.json["data"] = val;
        };
        InternAtomicChange.prototype.setData5 = function (val) {
            this.json["data"] = val;
        };
        InternAtomicChange.prototype.setData6 = function (val) {
            this.json["data"] = val;
        };
        InternAtomicChange.prototype.setData7 = function (val) {
            this.json["data"] = val;
        };
        InternAtomicChange.prototype.setData8 = function (val) {
            this.json["data"] = val;
        };
        InternAtomicChange.prototype.toJson = function () {
            return this.json;
        };
        InternAtomicChange.prototype.setData = function (val) {
            // dispatching to 'overload':
            if (val instanceof Object) {
                this.setData1(val);
            }
            else if (val instanceof Array) {
                this.setData2(val);
            }
            else if (('string' == typeof (val))) {
                this.setData3(val);
            }
            else if (('number' == typeof (val))) {
                this.setData4(val);
            }
            else if (('number' == typeof (val))) {
                this.setData5(val);
            }
            else if (('number' == typeof (val))) {
                this.setData6(val);
            }
            else if (('number' == typeof (val))) {
                this.setData7(val);
            }
            else if (('boolean' == typeof (val))) {
                this.setData8(val);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        return InternAtomicChange;
    })();
    Infinicast.InternAtomicChange = InternAtomicChange;
    var AtomicChange = (function () {
        function AtomicChange() {
            this.namedQueryList = new Array();
            this.atomicChangeList = new Array();
        }
        AtomicChange.prototype._removeProperty = function (jsonProperty) {
            var change = new InternAtomicChange();
            change.type = AtomicChangeType.RemoveProperty;
            change.jsonProperty = jsonProperty;
            this.atomicChangeList.push(change);
            return change;
        };
        AtomicChange.prototype._addToSet = function (jsonProperty) {
            var change = new InternAtomicChange();
            change.type = AtomicChangeType.AddToSet;
            change.jsonProperty = jsonProperty;
            this.atomicChangeList.push(change);
            return change;
        };
        AtomicChange.prototype._removeFromSet = function (jsonProperty) {
            var change = new InternAtomicChange();
            change.type = AtomicChangeType.RemoveFromSet;
            change.jsonProperty = jsonProperty;
            this.atomicChangeList.push(change);
            return change;
        };
        AtomicChange.prototype._addToArray = function (jsonProperty) {
            var change = new InternAtomicChange();
            change.type = AtomicChangeType.AddToArray;
            change.jsonProperty = jsonProperty;
            this.atomicChangeList.push(change);
            return change;
        };
        AtomicChange.prototype._removeFromArray = function (jsonProperty) {
            var change = new InternAtomicChange();
            change.type = AtomicChangeType.RemoveFromArray;
            change.jsonProperty = jsonProperty;
            this.atomicChangeList.push(change);
            return change;
        };
        AtomicChange.prototype._setValue = function (jsonProperty) {
            var change = new InternAtomicChange();
            change.type = AtomicChangeType.Set;
            change.jsonProperty = jsonProperty;
            this.atomicChangeList.push(change);
            return change;
        };
        AtomicChange.prototype._incValue = function (jsonProperty) {
            var change = new InternAtomicChange();
            change.type = AtomicChangeType.IncValue;
            change.jsonProperty = jsonProperty;
            this.atomicChangeList.push(change);
            return change;
        };
        AtomicChange.prototype._decValue = function (jsonProperty) {
            var change = new InternAtomicChange();
            change.type = AtomicChangeType.DecValue;
            change.jsonProperty = jsonProperty;
            this.atomicChangeList.push(change);
            return change;
        };
        AtomicChange.prototype.addToArray1 = function (jsonProperty, val) {
            this._addToArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToArray2 = function (jsonProperty, val) {
            this._addToArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToArray3 = function (jsonProperty, val) {
            this._addToArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToArray4 = function (jsonProperty, val) {
            this._addToArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToArray5 = function (jsonProperty, val) {
            this._addToArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.create = function () {
            return new AtomicChange();
        };
        AtomicChange.prototype.removeFromArray1 = function (jsonProperty, val) {
            this._removeFromArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromArray2 = function (jsonProperty, val) {
            this._removeFromArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromArray3 = function (jsonProperty, val) {
            this._removeFromArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromArray4 = function (jsonProperty, val) {
            this._removeFromArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromArray5 = function (jsonProperty, val) {
            this._removeFromArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromArray6 = function (jsonProperty, val) {
            this._removeFromArray(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToSet1 = function (jsonProperty, val) {
            this._addToSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToSet2 = function (jsonProperty, val) {
            this._addToSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToSet3 = function (jsonProperty, val) {
            this._addToSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToSet4 = function (jsonProperty, val) {
            this._addToSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToSet5 = function (jsonProperty, val) {
            this._addToSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.addToSet6 = function (jsonProperty, val) {
            this._addToSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromSet1 = function (jsonProperty, val) {
            this._removeFromSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromSet2 = function (jsonProperty, val) {
            this._removeFromSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromSet3 = function (jsonProperty, val) {
            this._removeFromSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromSet4 = function (jsonProperty, val) {
            this._removeFromSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromSet5 = function (jsonProperty, val) {
            this._removeFromSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeFromSet6 = function (jsonProperty, val) {
            this._removeFromSet(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.removeProperty = function (jsonProperty) {
            this._removeProperty(jsonProperty);
            return this;
        };
        AtomicChange.prototype.setValue1 = function (jsonProperty, val) {
            this._setValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.setValue2 = function (jsonProperty, val) {
            this._setValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.setValue3 = function (jsonProperty, val) {
            this._setValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.setValue4 = function (jsonProperty, val) {
            this._setValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.setValue5 = function (jsonProperty, val) {
            this._setValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.setValue6 = function (jsonProperty, val) {
            this._setValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.incValue1 = function (jsonProperty, val) {
            this._incValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.incValue2 = function (jsonProperty, val) {
            this._incValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.incValue3 = function (jsonProperty, val) {
            this._incValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.incValue4 = function (jsonProperty, val) {
            this._incValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.decValue1 = function (jsonProperty, val) {
            this._decValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.decValue2 = function (jsonProperty, val) {
            this._decValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.decValue3 = function (jsonProperty, val) {
            this._decValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.decValue4 = function (jsonProperty, val) {
            this._decValue(jsonProperty).setData(val);
            return this;
        };
        AtomicChange.prototype.setNamedCollectionQuery = function (name, query) {
            var named = new AfinityNamedJsonDataQuery();
            named.name = name;
            named.query = query;
            this.namedQueryList.push(named);
            return this;
        };
        AtomicChange.prototype.toJson = function () {
            var arr = new Array();
            for (var _i = 0, _a = this.atomicChangeList; _i < _a.length; _i++) {
                var change = _a[_i];
                arr.push(change.toJson());
            }
            return arr;
        };
        AtomicChange.prototype.getNamedQueryJson = function () {
            var arr = new Array();
            for (var _i = 0, _a = this.namedQueryList; _i < _a.length; _i++) {
                var named = _a[_i];
                var ob = new Object();
                ob["name"] = named.name;
                ob["query"] = named.query.toJson();
                arr.push(ob);
            }
            return arr;
        };
        AtomicChange.prototype.hasNamedQueries = function () {
            return ((this.namedQueryList != null) && (this.namedQueryList.length > 0));
        };
        AtomicChange.prototype.addToArray = function (jsonProperty, val) {
            // dispatching to 'overload':
            if ((('string' == typeof (jsonProperty)) && val instanceof Object)) {
                return this.addToArray1(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && val instanceof Array)) {
                return this.addToArray2(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('string' == typeof (val)))) {
                return this.addToArray3(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.addToArray4(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.addToArray5(jsonProperty, val);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        AtomicChange.prototype.removeFromArray = function (jsonProperty, val) {
            // dispatching to 'overload':
            if ((('string' == typeof (jsonProperty)) && val instanceof Object)) {
                return this.removeFromArray1(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && val instanceof Array)) {
                return this.removeFromArray2(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('string' == typeof (val)))) {
                return this.removeFromArray3(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.removeFromArray4(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.removeFromArray5(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.removeFromArray6(jsonProperty, val);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        AtomicChange.prototype.addToSet = function (jsonProperty, val) {
            // dispatching to 'overload':
            if ((('string' == typeof (jsonProperty)) && val instanceof Object)) {
                return this.addToSet1(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && val instanceof Array)) {
                return this.addToSet2(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('string' == typeof (val)))) {
                return this.addToSet3(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.addToSet4(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.addToSet5(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.addToSet6(jsonProperty, val);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        AtomicChange.prototype.removeFromSet = function (jsonProperty, val) {
            // dispatching to 'overload':
            if ((('string' == typeof (jsonProperty)) && val instanceof Object)) {
                return this.removeFromSet1(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && val instanceof Array)) {
                return this.removeFromSet2(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('string' == typeof (val)))) {
                return this.removeFromSet3(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.removeFromSet4(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.removeFromSet5(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.removeFromSet6(jsonProperty, val);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        AtomicChange.prototype.setValue = function (jsonProperty, val) {
            // dispatching to 'overload':
            if ((('string' == typeof (jsonProperty)) && val instanceof Object)) {
                return this.setValue1(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && val instanceof Array)) {
                return this.setValue2(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('string' == typeof (val)))) {
                return this.setValue3(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('boolean' == typeof (val)))) {
                return this.setValue4(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.setValue5(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.setValue6(jsonProperty, val);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        AtomicChange.prototype.incValue = function (jsonProperty, val) {
            // dispatching to 'overload':
            if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.incValue1(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.incValue2(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.incValue3(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.incValue4(jsonProperty, val);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        AtomicChange.prototype.decValue = function (jsonProperty, val) {
            // dispatching to 'overload':
            if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.decValue1(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.decValue2(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.decValue3(jsonProperty, val);
            }
            else if ((('string' == typeof (jsonProperty)) && ('number' == typeof (val)))) {
                return this.decValue4(jsonProperty, val);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        return AtomicChange;
    })();
    Infinicast.AtomicChange = AtomicChange;
    var ADataAndPathAndEndpointContext = (function () {
        function ADataAndPathAndEndpointContext() {
        }
        Object.defineProperty(ADataAndPathAndEndpointContext.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ADataAndPathAndEndpointContext.prototype, "context", {
            get: function () {
                return this._context;
            },
            set: function (value) {
                this._context = value;
            },
            enumerable: true,
            configurable: true
        });
        return ADataAndPathAndEndpointContext;
    })();
    Infinicast.ADataAndPathAndEndpointContext = ADataAndPathAndEndpointContext;
    var ADataAndPathContext = (function () {
        function ADataAndPathContext() {
        }
        return ADataAndPathContext;
    })();
    Infinicast.ADataAndPathContext = ADataAndPathContext;
    var APListQueryResult = (function () {
        function APListQueryResult() {
        }
        Object.defineProperty(APListQueryResult.prototype, "list", {
            get: function () {
                return this._list;
            },
            set: function (value) {
                this._list = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APListQueryResult.prototype, "fullCount", {
            get: function () {
                return this._fullCount;
            },
            set: function (value) {
                this._fullCount = value;
            },
            enumerable: true,
            configurable: true
        });
        return APListQueryResult;
    })();
    Infinicast.APListQueryResult = APListQueryResult;
    var FindOneOrAddChildResult = (function () {
        function FindOneOrAddChildResult() {
        }
        return FindOneOrAddChildResult;
    })();
    Infinicast.FindOneOrAddChildResult = FindOneOrAddChildResult;
    var ListenerListResult = (function () {
        function ListenerListResult() {
        }
        Object.defineProperty(ListenerListResult.prototype, "list", {
            get: function () {
                return this._list;
            },
            set: function (value) {
                this._list = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListenerListResult.prototype, "context", {
            get: function () {
                return this._context;
            },
            set: function (value) {
                this._context = value;
            },
            enumerable: true,
            configurable: true
        });
        return ListenerListResult;
    })();
    Infinicast.ListenerListResult = ListenerListResult;
    var OrderCriteria = (function () {
        function OrderCriteria() {
        }
        Object.defineProperty(OrderCriteria.prototype, "field", {
            get: function () {
                return this._field;
            },
            set: function (value) {
                this._field = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrderCriteria.prototype, "isAscending", {
            get: function () {
                return this._isAscending;
            },
            set: function (value) {
                this._isAscending = value;
            },
            enumerable: true,
            configurable: true
        });
        return OrderCriteria;
    })();
    Infinicast.OrderCriteria = OrderCriteria;
    var SyncTimeoutInfo = (function () {
        function SyncTimeoutInfo() {
            this.isTimedOut = false;
        }
        return SyncTimeoutInfo;
    })();
    Infinicast.SyncTimeoutInfo = SyncTimeoutInfo;
    var APEndpointContext = (function () {
        function APEndpointContext() {
        }
        Object.defineProperty(APEndpointContext.prototype, "endpoint", {
            get: function () {
                return this._endpoint;
            },
            set: function (value) {
                this._endpoint = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APEndpointContext.prototype, "endpointData", {
            get: function () {
                return this._endpointData;
            },
            set: function (value) {
                this._endpointData = value;
            },
            enumerable: true,
            configurable: true
        });
        return APEndpointContext;
    })();
    Infinicast.APEndpointContext = APEndpointContext;
    var PathAndEndpointContext = (function () {
        function PathAndEndpointContext(path_, endpointOb_, endpointData_) {
            this.path = path_;
            this.endpoint = endpointOb_;
            this.endpointData = endpointData_;
        }
        Object.defineProperty(PathAndEndpointContext.prototype, "path", {
            get: function () {
                return this._path;
            },
            set: function (value) {
                this._path = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathAndEndpointContext.prototype, "endpoint", {
            get: function () {
                return this._endpoint;
            },
            set: function (value) {
                this._endpoint = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathAndEndpointContext.prototype, "endpointData", {
            get: function () {
                return this._endpointData;
            },
            set: function (value) {
                this._endpointData = value;
            },
            enumerable: true,
            configurable: true
        });
        return PathAndEndpointContext;
    })();
    Infinicast.PathAndEndpointContext = PathAndEndpointContext;
    var APathContext = (function () {
        function APathContext() {
        }
        Object.defineProperty(APathContext.prototype, "path", {
            get: function () {
                return this._path;
            },
            set: function (value) {
                this._path = value;
            },
            enumerable: true,
            configurable: true
        });
        return APathContext;
    })();
    Infinicast.APathContext = APathContext;
    var APListeningChangedContext = (function (_super) {
        __extends(APListeningChangedContext, _super);
        function APListeningChangedContext() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(APListeningChangedContext.prototype, "endpoint", {
            get: function () {
                return this._endpoint;
            },
            set: function (value) {
                this._endpoint = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APListeningChangedContext.prototype, "endpointData", {
            get: function () {
                return this._endpointData;
            },
            set: function (value) {
                this._endpointData = value;
            },
            enumerable: true,
            configurable: true
        });
        return APListeningChangedContext;
    })(APathContext);
    Infinicast.APListeningChangedContext = APListeningChangedContext;
    var APListeningStartedContext = (function (_super) {
        __extends(APListeningStartedContext, _super);
        function APListeningStartedContext() {
            _super.apply(this, arguments);
            this.listenerCount = null;
        }
        Object.defineProperty(APListeningStartedContext.prototype, "endpoint", {
            get: function () {
                return this._endpoint;
            },
            set: function (value) {
                this._endpoint = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APListeningStartedContext.prototype, "endpointData", {
            get: function () {
                return this._endpointData;
            },
            set: function (value) {
                this._endpointData = value;
            },
            enumerable: true,
            configurable: true
        });
        APListeningStartedContext.prototype.getListenerCount = function (role) {
            if (((this.listenerCount == null) || !(Object.keys(this.listenerCount).includes(role)))) {
                return 0;
            }
            return this.listenerCount[role];
        };
        APListeningStartedContext.prototype.isFirstListenerOfRole = function (role) {
            return (this.getListenerCount(role) == 1);
        };
        return APListeningStartedContext;
    })(APathContext);
    Infinicast.APListeningStartedContext = APListeningStartedContext;
    var APListeningEndedContext = (function (_super) {
        __extends(APListeningEndedContext, _super);
        function APListeningEndedContext() {
            _super.apply(this, arguments);
            this.listenerCount = null;
        }
        Object.defineProperty(APListeningEndedContext.prototype, "endpoint", {
            get: function () {
                return this._endpoint;
            },
            set: function (value) {
                this._endpoint = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APListeningEndedContext.prototype, "endpointData", {
            get: function () {
                return this._endpointData;
            },
            set: function (value) {
                this._endpointData = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APListeningEndedContext.prototype, "isDisconnected", {
            get: function () {
                return this._isDisconnected;
            },
            set: function (value) {
                this._isDisconnected = value;
            },
            enumerable: true,
            configurable: true
        });
        APListeningEndedContext.prototype.getListenerCount = function (role) {
            if (((this.listenerCount == null) || !(Object.keys(this.listenerCount).includes(role)))) {
                return 0;
            }
            return this.listenerCount[role];
        };
        APListeningEndedContext.prototype.wasLastListenerOfRole = function (role) {
            return (this.getListenerCount(role) == 0);
        };
        return APListeningEndedContext;
    })(APathContext);
    Infinicast.APListeningEndedContext = APListeningEndedContext;
    var ErrorHandlingHelper = (function () {
        function ErrorHandlingHelper() {
        }
        ErrorHandlingHelper.checkIfHasErrorsAndCallHandlersFull = function (connector, json, completeCallback, path) {
            if ((json != null)) {
                var errorJson = json["error"];
                if (((json != null) && (errorJson != null))) {
                    if ((completeCallback != null)) {
                        var pathAddress = "";
                        if ((path != null)) {
                            path.toString();
                        }
                        completeCallback(ErrorInfo.fromJson(errorJson, pathAddress));
                    }
                    else {
                        connector.unhandeledError(path, errorJson);
                    }
                    return;
                }
            }
            else {
                ErrorHandlingHelper._logger.warn("Note: no resulting json set.");
            }
            if ((completeCallback != null)) {
                completeCallback(null);
            }
        };
        ErrorHandlingHelper.checkIfHasErrorsAndCallHandlersNew = function (connector, json, completeCallback, path) {
            if ((json != null)) {
                var errorJson = json["error"];
                if (((json != null) && (errorJson != null))) {
                    if ((completeCallback != null)) {
                        var pathAddress = "";
                        if ((path != null)) {
                            path.toString();
                        }
                        completeCallback(ErrorInfo.fromJson(errorJson, pathAddress));
                    }
                    else {
                        connector.unhandeledError(path, errorJson);
                    }
                    return true;
                }
            }
            else {
                ErrorHandlingHelper._logger.warn("Note: no resulting json set.");
            }
            return false;
        };
        ErrorHandlingHelper._logger = LoggerFactory.getLogger(typeof (ErrorHandlingHelper));
        return ErrorHandlingHelper;
    })();
    Infinicast.ErrorHandlingHelper = ErrorHandlingHelper;
    var LockObject = (function () {
        function LockObject() {
        }
        return LockObject;
    })();
    Infinicast.LockObject = LockObject;
    var ICDataFilter = (function () {
        function ICDataFilter() {
        }
        Object.defineProperty(ICDataFilter.prototype, "dataFilterType", {
            get: function () {
                return this._dataFilterType;
            },
            set: function (value) {
                this._dataFilterType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ICDataFilter.prototype, "content", {
            get: function () {
                return this._content;
            },
            set: function (value) {
                this._content = value;
            },
            enumerable: true,
            configurable: true
        });
        ICDataFilter.fromJObject = function (query) {
            var filter = new ICDataFilter();
            filter.content = query;
            filter.dataFilterType = 1;
            return filter;
        };
        ICDataFilter.fromFieldFilter = function (ff) {
            var filter = new ICDataFilter();
            filter.content = ff.toJson();
            filter.dataFilterType = 2;
            return filter;
        };
        ICDataFilter.prototype.toJson = function () {
            var json = new Object();
            json["type"] = this.dataFilterType;
            json["content"] = this.content;
            return json;
        };
        return ICDataFilter;
    })();
    Infinicast.ICDataFilter = ICDataFilter;
    var VersionHelper = (function () {
        function VersionHelper() {
        }
        Object.defineProperty(VersionHelper, "clientVersion", {
            get: function () {
                return "v1.0.15";
            },
            enumerable: true,
            configurable: true
        });
        return VersionHelper;
    })();
    Infinicast.VersionHelper = VersionHelper;
    var HandlerPool = (function () {
        function HandlerPool() {
        }
        HandlerPool.prototype.queueHandlerCall = function (call) {
            ThreadPool.QueueUserWorkItem(function (state) {
                call();
            });
        };
        return HandlerPool;
    })();
    Infinicast.HandlerPool = HandlerPool;
    var EndpointAndData = (function () {
        function EndpointAndData() {
        }
        Object.defineProperty(EndpointAndData.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EndpointAndData.prototype, "endpoint", {
            get: function () {
                return this._endpoint;
            },
            set: function (value) {
                this._endpoint = value;
            },
            enumerable: true,
            configurable: true
        });
        return EndpointAndData;
    })();
    Infinicast.EndpointAndData = EndpointAndData;
    var RequestResponder = (function () {
        function RequestResponder(messageManager, path, targetEndpoint, requestId) {
            this._messageManager = messageManager;
            this._path = path;
            this._targetEndpoint = targetEndpoint;
            this._requestId = requestId;
        }
        RequestResponder.prototype.respond = function (json) {
            this._messageManager.sendRequestAnswer(Connector2EpsMessageType.RequestResponse, this._path, json, this._targetEndpoint, this._requestId);
        };
        return RequestResponder;
    })();
    Infinicast.RequestResponder = RequestResponder;
    var BaseQueryExecutor = (function () {
        function BaseQueryExecutor(connector, path, messageManager) {
            this._connector = connector;
            this._path = path;
            this._messageManager = messageManager;
        }
        BaseQueryExecutor.prototype.getPathAndEndpointContext = function (ctx) {
            var context = new APathContext();
            context.path = ctx.path;
            return context;
        };
        BaseQueryExecutor.prototype.getPathContext = function (path) {
            var context = new APathContext();
            context.path = path;
            return context;
        };
        BaseQueryExecutor.prototype.checkIfHasErrorsAndCallHandlersNew = function (json, completeCallback) {
            return ErrorHandlingHelper.checkIfHasErrorsAndCallHandlersNew(this._connector, json, completeCallback, this._path);
        };
        BaseQueryExecutor.prototype.checkIfHasErrorsAndCallHandlersFull = function (json, completeCallback) {
            ErrorHandlingHelper.checkIfHasErrorsAndCallHandlersFull(this._connector, json, completeCallback, this._path);
        };
        BaseQueryExecutor.getRoleCountDictionary = function (json) {
            var roleCount = {};
            var roleCountArray = json["roleCount"];
            if ((roleCountArray != null)) {
                for (var _i = 0; _i < roleCountArray.length; _i++) {
                    var roleOb = roleCountArray[_i];
                    var role = roleOb["role"];
                    var handlerType = roleOb["handlerType"];
                    var count = roleOb["count"];
                    if ((handlerType == "Message")) {
                        roleCount[role] = count;
                    }
                }
            }
            return roleCount;
        };
        BaseQueryExecutor.prototype.unhandeledError = function (errorResults) {
            this._connector.unhandeledErrorInfo(this._path, errorResults);
        };
        return BaseQueryExecutor;
    })();
    Infinicast.BaseQueryExecutor = BaseQueryExecutor;
    var PathQueryWithHandlerExecutor = (function (_super) {
        __extends(PathQueryWithHandlerExecutor, _super);
        function PathQueryWithHandlerExecutor(connector, path, messageManager) {
            _super.call(this, connector, path, messageManager);
            this._logger = LoggerFactory.getLogger(typeof (PathQueryWithHandlerExecutor));
        }
        PathQueryWithHandlerExecutor.prototype.onDataChange = function (callback, options, completeCallback) {
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this._messageManager.addHandler(false, Connector2EpsMessageType.SetObjectData, this._path, function (json, context, id) {
                var newOb = null;
                var oldOb = null;
                if (json["new"]) {
                    newOb = json["new"];
                }
                if (json["old"]) {
                    oldOb = json["old"];
                }
                callback(newOb, oldOb, context);
            }, completeCallback, options);
        };
        PathQueryWithHandlerExecutor.prototype.onValidateDataChange = function (callback, options, completeCallback) {
            var _this = this;
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this._messageManager.addHandler((callback == null), Connector2EpsMessageType.DataChangeValidate, this._path, function (json, context, id) {
                var newOb = null;
                var oldOb = null;
                if (json["new"]) {
                    newOb = json["new"];
                }
                if (json["old"]) {
                    oldOb = json["old"];
                }
                callback(newOb, oldOb, new ValidationResponder(Connector2EpsMessageType.DataChangeValidated, _this._messageManager, newOb, context.path, context.endpoint), context);
            }, completeCallback, options);
        };
        PathQueryWithHandlerExecutor.prototype.onValidateMessage = function (callback, options, completeCallback) {
            var _this = this;
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this._messageManager.addHandler((callback == null), Connector2EpsMessageType.MessageValidate, this._path, function (json, context, id) {
                callback(json, new ValidationResponder(Connector2EpsMessageType.MessageValidated, _this._messageManager, json, context.path, context.endpoint), context);
            }, completeCallback, options);
        };
        PathQueryWithHandlerExecutor.prototype.onMessage = function (callback, options, completeCallback, listenTerminationHandler) {
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            if (listenTerminationHandler === void 0) { listenTerminationHandler = null; }
            this._messageManager.addHandler((callback == null), Connector2EpsMessageType.Message, this._path, function (json, context, id) {
                callback(json, context);
            }, completeCallback, options, listenTerminationHandler);
        };
        PathQueryWithHandlerExecutor.prototype.onRequest = function (callback, options, completeCallback) {
            var _this = this;
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this._messageManager.addHandler((callback == null), Connector2EpsMessageType.Request, this._path, function (json, context, requestId) {
                callback(json, new RequestResponder(_this._messageManager, context.path, context.endpoint.endpointId, requestId), context);
            }, completeCallback, options);
        };
        PathQueryWithHandlerExecutor.prototype.onReminder = function (callback, options, completeCallback) {
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this._messageManager.addHandler((callback == null), Connector2EpsMessageType.Reminder, this._path, function (json, context, id) {
                callback(json, context);
            }, completeCallback, options);
        };
        PathQueryWithHandlerExecutor.prototype.onIntroduce = function (callback, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this._messageManager.addHandler((callback == null), Connector2EpsMessageType.IntroduceObject, this._path, function (json, context, id) {
                callback(json, context);
            }, completeCallback, null);
        };
        return PathQueryWithHandlerExecutor;
    })(BaseQueryExecutor);
    Infinicast.PathQueryWithHandlerExecutor = PathQueryWithHandlerExecutor;
    var ListenerQueryExecutor = (function (_super) {
        __extends(ListenerQueryExecutor, _super);
        function ListenerQueryExecutor(connector, path, messageManager) {
            _super.call(this, connector, path, messageManager);
        }
        ListenerQueryExecutor.prototype.getListenerList = function (callback, roleFilter, listeningType) {
            var _this = this;
            var settings = new Object();
            if (!(String.isNullOrEmpty(roleFilter))) {
                settings["role"] = roleFilter;
            }
            if ((listeningType != ListeningType.Any)) {
                settings["messageType"] = listeningType.toString();
            }
            this._messageManager.sendMessageWithResponse(Connector2EpsMessageType.GetListeningList, this._path, settings, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    callback(error, null, null);
                }))) {
                    var array = json["list"];
                    if ((array != null)) {
                        var resultList = new Array();
                        for (var _i = 0; _i < array.length; _i++) {
                            var ob = array[_i];
                            var endpointObject = new Endpoint(ob["path"], ob["endpoint"], _this._connector.getRootPath());
                            var endpointData = new EndpointAndData();
                            if (ob["data"]) {
                                endpointData.data = ob["data"];
                            }
                            endpointData.endpoint = endpointObject;
                            resultList.push(endpointData);
                        }
                        callback(null, resultList, _super.prototype.getPathContext.call(_this, _this._path));
                    }
                    else {
                        throw new Exception("GetListeningList should always contain a list, even if it is empty");
                    }
                }
            });
        };
        ListenerQueryExecutor.getListeningStartedContext = function (json, ctx) {
            var context = new APListeningStartedContext();
            if ((json != null)) {
                context.listenerCount = BaseQueryExecutor.getRoleCountDictionary(json);
            }
            context.path = ctx.path;
            context.endpoint = ctx.endpoint;
            context.endpointData = ctx.endpointData;
            return context;
        };
        ListenerQueryExecutor.getListeningEndedContext = function (json, ctx) {
            var context = new APListeningEndedContext();
            if ((json != null)) {
                context.listenerCount = BaseQueryExecutor.getRoleCountDictionary(json);
            }
            context.path = ctx.path;
            context.endpoint = ctx.endpoint;
            context.endpointData = ctx.endpointData;
            context.isDisconnected = json["disconnected"];
            return context;
        };
        ListenerQueryExecutor.prototype.onListeningStarted = function (handler, options, completeCallback) {
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this._messageManager.addHandler((handler == null), Connector2EpsMessageType.ListeningStarted, this._path, function (json, ctx, id) {
                var context = ListenerQueryExecutor.getListeningStartedContext(json, ctx);
                handler(context);
            }, completeCallback, options);
        };
        ListenerQueryExecutor.prototype.onListeningChanged = function (handler, options, completeCallback) {
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this._messageManager.addHandler((handler == null), Connector2EpsMessageType.ListeningChanged, this._path, function (json, ctx, id) {
                ListenerQueryExecutor.forwardListeningChangedMessages(handler, json, ctx);
            }, completeCallback, options);
        };
        ListenerQueryExecutor.prototype.getCustomOptionsJson = function (options) {
            var customOptions = null;
            if (((options != null) && !(String.isNullOrEmpty(options.roleFilter)))) {
                if ((customOptions == null)) {
                    customOptions = new Object();
                }
                customOptions["role"] = options.roleFilter;
            }
            if (((options != null) && (options.listenerType != ListeningType.Any))) {
                if ((customOptions == null)) {
                    customOptions = new Object();
                }
                customOptions["listenerType"] = options.listenerType.toString();
            }
            return customOptions;
        };
        ListenerQueryExecutor.prototype.onListeningEnded = function (handler, options, completeCallback) {
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this._messageManager.addHandler((handler == null), Connector2EpsMessageType.ListeningEnded, this._path, function (json, ctx, id) {
                ListenerQueryExecutor.forwardListeningEndedMessages(handler, json, ctx);
            }, completeCallback, options);
        };
        ListenerQueryExecutor.prototype.getAndListenOnListeners = function (onStart, onChange, onEnd, options, registrationCompleteCallback) {
            var _this = this;
            var parameters = this.getCustomOptionsJson(options);
            if ((parameters == null)) {
                parameters = new Object();
            }
            if ((((onStart == null) && (onEnd == null)) && (onChange == null))) {
                parameters["remove"] = true;
            }
            if (((options != null) && options.isOncePerRole)) {
                parameters["once"] = true;
            }
            if (((options != null) && options.isSticky)) {
                parameters["sticky"] = true;
            }
            if ((onChange == null)) {
                parameters["noChange"] = true;
            }
            this._messageManager.sendMessageWithResponse(Connector2EpsMessageType.GetAndListenOnListeners, this._path, parameters, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    if ((registrationCompleteCallback != null)) {
                        registrationCompleteCallback(error);
                    }
                }))) {
                    var array = json["list"];
                    if ((array != null)) {
                        var rootPath = _this._connector.getRootPath();
                        for (var _i = 0; _i < array.length; _i++) {
                            var ob = array[_i];
                            var endpointObject = new Endpoint(ob["path"], ob["endpoint"], rootPath);
                            var endpointData = new EndpointAndData();
                            endpointData.data = ob["data"];
                            endpointData.endpoint = endpointObject;
                            var listeningStartedContext = new APListeningStartedContext();
                            listeningStartedContext.endpoint = endpointObject;
                            listeningStartedContext.endpointData = endpointData.data;
                            if ((onStart != null)) {
                                onStart(listeningStartedContext);
                            }
                        }
                    }
                    if ((registrationCompleteCallback != null)) {
                        registrationCompleteCallback(null);
                    }
                }
            });
            if ((((onStart != null) || (onChange != null)) || (onEnd != null))) {
                this._messageManager.registerHandler(Connector2EpsMessageType.ListeningStarted, this._path, function (json, ctx, id) {
                    var context = ListenerQueryExecutor.getListeningStartedContext(json, ctx);
                    if ((onStart != null)) {
                        onStart(context);
                    }
                });
                if ((onChange != null)) {
                    this._messageManager.registerHandler(Connector2EpsMessageType.ListeningChanged, this._path, function (json, ctx, id) {
                        onChange(ListenerQueryExecutor.getListeningChangedContext(json, ctx));
                    });
                }
                this._messageManager.registerHandler(Connector2EpsMessageType.ListeningEnded, this._path, function (json, ctx, id) {
                    var context = ListenerQueryExecutor.getListeningEndedContext(json, ctx);
                    if ((onEnd != null)) {
                        onEnd(context);
                    }
                });
            }
            else {
                this._messageManager.registerHandler(Connector2EpsMessageType.ListeningStarted, this._path, null);
                this._messageManager.registerHandler(Connector2EpsMessageType.ListeningChanged, this._path, null);
                this._messageManager.registerHandler(Connector2EpsMessageType.ListeningEnded, this._path, null);
            }
        };
        ListenerQueryExecutor.forwardListeningEndedMessages = function (handler, json, ctx) {
            var context = ListenerQueryExecutor.getListeningEndedContext(json, ctx);
            handler(context);
        };
        ListenerQueryExecutor.forwardListeningChangedMessages = function (handler, json, ctx) {
            var context = ListenerQueryExecutor.getListeningChangedContext(json, ctx);
            handler(context);
        };
        ListenerQueryExecutor.getListeningChangedContext = function (json, ctx) {
            var context = new APListeningChangedContext();
            context.path = ctx.path;
            context.endpoint = ctx.endpoint;
            context.endpointData = ctx.endpointData;
            return context;
        };
        return ListenerQueryExecutor;
    })(BaseQueryExecutor);
    Infinicast.ListenerQueryExecutor = ListenerQueryExecutor;
    var ChildQueryExecutor = (function (_super) {
        __extends(ChildQueryExecutor, _super);
        function ChildQueryExecutor(connector, path, messageManager) {
            _super.call(this, connector, path, messageManager);
        }
        ChildQueryExecutor.prototype.setChildrenData = function (query, data, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            var parameters = new Object();
            parameters["query"] = query.toJson();
            parameters["data"] = data;
            var messageManager = this._messageManager;
            messageManager.sendMessageWithResponse(Connector2EpsMessageType.SetChildData, this._path, parameters, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    if ((completeCallback != null)) {
                        completeCallback(error, 0);
                    }
                    else {
                        _this._connector.unhandeledErrorInfo(_this._path, error);
                    }
                }))) {
                    if ((completeCallback != null)) {
                        completeCallback(null, json["fullCount"]);
                    }
                }
            });
        };
        ChildQueryExecutor.prototype.findChildren = function (query, callback) {
            var _this = this;
            var data = new Object();
            data["query"] = query.toJson();
            var messageManager = this._messageManager;
            messageManager.sendMessageWithResponse(Connector2EpsMessageType.JsonQuery, this._path, data, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    callback(error, null, 0);
                }))) {
                    var list = new Array();
                    var fullCount = json["fullCount"];
                    var array = json["list"];
                    for (var _i = 0; _i < array.length; _i++) {
                        var ob = array[_i];
                        var pathAndData = new PathAndData();
                        pathAndData.path = _this._connector.getObjectStateManager().getOrCreateLocalObject(ob["path"]);
                        pathAndData.data = ob["data"];
                        list.push(pathAndData);
                    }
                    callback(null, list, fullCount);
                }
            });
        };
        ChildQueryExecutor.prototype.addChild = function (objectData, requestedIdentifier, callback) {
            var _this = this;
            var data = new Object();
            data["requestedIdentifier"] = requestedIdentifier;
            data["data"] = objectData;
            this._messageManager.sendMessageWithResponse(Connector2EpsMessageType.CreateChildRequest, this._path, data, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    callback(error, null, null);
                }))) {
                    callback(null, json["data"], _super.prototype.getPathAndEndpointContext.call(_this, context));
                }
            });
        };
        ChildQueryExecutor.prototype.findOneOrAddChild = function (query, newObjectValue, action) {
            var _this = this;
            var parameters = new Object();
            parameters["data"] = newObjectValue;
            parameters["query"] = query.toJson();
            this._messageManager.sendMessageWithResponse(Connector2EpsMessageType.GetOrCreate, this._path, parameters, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    action(error, null, null, false);
                }))) {
                    var data = json["data"];
                    action(null, data["data"], _super.prototype.getPathAndEndpointContext.call(_this, context), json["newlyCreated"]);
                }
            });
        };
        ChildQueryExecutor.prototype.modifyAndGetChildrenData = function (query, data, callback) {
            var _this = this;
            var parameters = new Object();
            parameters["query"] = query.toJson();
            parameters["changes"] = data.toJson();
            if (data.hasNamedQueries()) {
                parameters["named"] = data.getNamedQueryJson();
            }
            var messageManager = this._messageManager;
            messageManager.sendMessageWithResponse(Connector2EpsMessageType.ModifyChildData, this._path, parameters, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    callback(error, null, 0);
                }))) {
                    var list = new Array();
                    var fullCount = json["fullCount"];
                    var array = json["list"];
                    for (var _i = 0; _i < array.length; _i++) {
                        var ob = array[_i];
                        var pathAndData = new PathAndData();
                        pathAndData.path = _this._connector.getObjectStateManager().getOrCreateLocalObject(ob["path"]);
                        pathAndData.data = ob["data"];
                        list.push(pathAndData);
                    }
                    callback(null, list, fullCount);
                }
            });
        };
        ChildQueryExecutor.prototype.removeChildren = function (query, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            var parameters = new Object();
            parameters["query"] = query.toJson();
            var messageManager = this._messageManager;
            messageManager.sendMessageWithResponse(Connector2EpsMessageType.RemoveChildren, this._path, parameters, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    if ((completeCallback != null)) {
                        completeCallback(error, 0);
                    }
                    else {
                        _this._connector.unhandeledErrorInfo(_this._path, error);
                    }
                }))) {
                    if ((completeCallback != null)) {
                        completeCallback(null, json["count"]);
                    }
                }
            });
        };
        ChildQueryExecutor.prototype.getAndListenOnChilden = function (query, isRemove, onAdd, onChange, onRemove, isOncePerRole, isSticky, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            var parameters = new Object();
            parameters["query"] = query.toJson();
            if (isRemove) {
                parameters["remove"] = true;
            }
            if (isOncePerRole) {
                parameters["once"] = true;
            }
            if (isSticky) {
                parameters["sticky"] = true;
            }
            this._messageManager.sendMessageWithResponse(Connector2EpsMessageType.GetAndListenOnChildren, this._path, parameters, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    if ((registrationCompleteCallback != null)) {
                        registrationCompleteCallback(error);
                    }
                }))) {
                    var array = json["list"];
                    for (var _i = 0; _i < array.length; _i++) {
                        var ob = array[_i];
                        var ctx = new PathAndEndpointContext(_this._connector.path(ob["path"]), context.endpoint, context.endpointData);
                        var d = ob["data"];
                        onAdd(d, ctx);
                    }
                    if ((registrationCompleteCallback != null)) {
                        registrationCompleteCallback(null);
                    }
                }
            });
            if (!(isRemove)) {
                this._messageManager.registerHandler(Connector2EpsMessageType.ListAdd, this._path, function (json, context, id) {
                    if ((onAdd != null)) {
                        onAdd(json, context);
                    }
                });
                this._messageManager.registerHandler(Connector2EpsMessageType.ListChange, this._path, function (json, context, id) {
                    if ((onChange != null)) {
                        onChange(json, context);
                    }
                });
                this._messageManager.registerHandler(Connector2EpsMessageType.ListRemove, this._path, function (json, context, id) {
                    if ((onRemove != null)) {
                        onRemove(json, context);
                    }
                });
            }
            else {
                this._messageManager.registerHandler(Connector2EpsMessageType.ListAdd, this._path, null);
                this._messageManager.registerHandler(Connector2EpsMessageType.ListRemove, this._path, null);
                this._messageManager.registerHandler(Connector2EpsMessageType.ListChange, this._path, null);
            }
        };
        ChildQueryExecutor.prototype.onChildAdd = function (callback, options, completeCallback) {
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this.onChildHandler(callback, options, completeCallback, Connector2EpsMessageType.ListAdd);
        };
        ChildQueryExecutor.prototype.onChildChange = function (callback, options, completeCallback) {
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this.onChildHandler(callback, options, completeCallback, Connector2EpsMessageType.ListChange);
        };
        ChildQueryExecutor.prototype.onChildDelete = function (callback, options, completeCallback) {
            if (options === void 0) { options = null; }
            if (completeCallback === void 0) { completeCallback = null; }
            this.onChildHandler(callback, options, completeCallback, Connector2EpsMessageType.ListRemove);
        };
        ChildQueryExecutor.prototype.onChildHandler = function (callback, options, completeCallback, connector2EpsMessageType) {
            this._messageManager.addHandler((callback == null), connector2EpsMessageType, this._path, function (json, context, id) {
                if ((json != null)) {
                    //console.log(((((connector2EpsMessageType.toString() + " ") + JSON.stringify(json)) + " ") + context.path.toString()));
                }
                else {
                    //console.log(((connector2EpsMessageType.toString() + " null ") + context.path.toString()));
                }
                callback(json, context);
            }, completeCallback, options);
        };
        return ChildQueryExecutor;
    })(BaseQueryExecutor);
    Infinicast.ChildQueryExecutor = ChildQueryExecutor;
    /**
     * access to listeners on a given path.
    */
    var ListenerQuery = (function () {
        function ListenerQuery(path, executor) {
            this._path = null;
            this._executor = null;
            this._roleFilter = "";
            this._path = path;
            this._executor = executor;
            this._listeningType = ListeningType.Any;
        }
        /**
         * filters the listener query by an endpoint role
         * the query needs to be finished via e.g. ToList
        */
        ListenerQuery.prototype.filterRole = function (role) {
            this._roleFilter = role;
            return this;
        };
        /**
         * filters the listener query by listening type
         * the query needs to be finished via e.g. ToList
        */
        ListenerQuery.prototype.filterType = function (type) {
            this._listeningType = type;
            return this;
        };
        ListenerQuery.prototype.getListeningType = function () {
            return this._listeningType;
        };
        /**
         * finishs the query and returns the list of listeners on a given path filtered by role or type filters.
        */
        ListenerQuery.prototype.toList = function (callback) {
            this._executor.getListenerList(callback, this._roleFilter, this._listeningType);
        };
        /**
         * finishs the query and returns the list of listeners on a given path filtered by role or type filters.
        */
        ListenerQuery.prototype.toListAsync = function () {
            var tcs = new Promise();
            this.toList(function (error, list, context) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    var result = new ListenerListResult();
                    result.context = context;
                    result.list = list;
                    tcs.resolve(result);
                }
            });
            return tcs.getData();
        };
        ListenerQuery.prototype.getFilteredRole = function () {
            return this._roleFilter;
        };
        /**
         * adds a listener that will be informed as soon as an endpoint that fits the filters will begin to listen on this path.
        */
        ListenerQuery.prototype.onStart = function (handler, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this._executor.onListeningStarted(function (context) {
                handler(context);
            }, this.getHandlerRegistrationOptions(), function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this._executor.unhandeledError(error);
                }
            });
        };
        /**
         * adds a listener that will be informed as soon as an endpoint that fits the filters will begin to listen on this path.
        */
        ListenerQuery.prototype.onStartAsync = function (handler) {
            var tcs = new Promise();
            this.onStart(handler, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * adds a listener that will be informed as soon as the endpoint data of a listener on this path will be changed
        */
        ListenerQuery.prototype.onDataChange = function (handler, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this._executor.onListeningChanged(function (context) {
                handler(context);
            }, this.getHandlerRegistrationOptions(), function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this._executor.unhandeledError(error);
                }
            });
        };
        /**
         * adds a listener that will be informed as soon as the endpoint data of a listener on this path will be changed
        */
        ListenerQuery.prototype.onDataChangeAsync = function (handler) {
            var tcs = new Promise();
            this.onDataChange(handler, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * adds a listener that will be informed as soon as an endpoint that fits the filters will stop to listen on this path.
        */
        ListenerQuery.prototype.onEnd = function (handler, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this._executor.onListeningEnded(function (context) {
                handler(context);
            }, this.getHandlerRegistrationOptions(), function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this._executor.unhandeledError(error);
                }
            });
        };
        /**
         * adds a listener that will be informed as soon as an endpoint that fits the filters will stop to listen on this path.
        */
        ListenerQuery.prototype.onEndAsync = function (handler) {
            var tcs = new Promise();
            this.onEnd(handler, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        ListenerQuery.prototype.getHandlerRegistrationOptions = function () {
            var options = new ListeningHandlerRegistrationOptions();
            options.withRole(this.getFilteredRole());
            options.listenerType = this.getListeningType();
            return options;
        };
        /**
         * adds listeners to start, end and change of endpoint listeners on this path.
         * the onStart event will be triggered for all already existing listeners on this path.
        */
        ListenerQuery.prototype.live = function (onStart, onEnd, onChange, registrationCompleteCallback) {
            var _this = this;
            if (onChange === void 0) { onChange = null; }
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this._executor.getAndListenOnListeners(onStart, onChange, onEnd, this.getHandlerRegistrationOptions(), function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this._executor.unhandeledError(error);
                }
            });
        };
        /**
         * adds listeners to start, end and change of endpoint listeners on this path.
         * the onStart event will be triggered for all already existing listeners on this path.
        */
        ListenerQuery.prototype.liveAsync = function (onStart, onEnd, onChange) {
            if (onChange === void 0) { onChange = null; }
            var tcs = new Promise();
            this.live(onStart, onEnd, onChange, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        return ListenerQuery;
    })();
    Infinicast.ListenerQuery = ListenerQuery;
    /**
     * by using IChildrenQuery a path can be used as a collection containing other paths.
    */
    var ChildrenQuery = (function () {
        function ChildrenQuery(path, executor) {
            this._dataQuery = new ICDataQuery();
            this._path = path;
            this._executor = executor;
        }
        /**
         * filters the collection data via a Field Filter.
         * The data needs to be converted into a result by e.g. ToList();
         * example:
         * var booksForAdults = infinicast.Path("Books")
         * // Fluent Filter
         * .FilterInData(Filter.For("fromAge").Gt(18))
         * .FilterInData(Filter.For("releaseDate").Gt(DateTime.Now))
         * .ToListAsync();
        */
        ChildrenQuery.prototype.filterInData1 = function (filter) {
            this._dataQuery.dataFilters.push(ICDataFilter.fromFieldFilter(filter));
            return this;
        };
        ChildrenQuery.prototype.filterInData2 = function (jsonEquals) {
            this._dataQuery.dataFilters.push(ICDataFilter.fromJObject(jsonEquals));
            return this;
        };
        /**
         * changes the ordering of the collection query.
         * The data needs to be converted into a result by e.g. ToList();
         * @param orderCriteria
         * @return
        */
        ChildrenQuery.prototype.orderByData = function (orderCriteria) {
            this._dataQuery.orderCriteria = orderCriteria;
            return this;
        };
        ChildrenQuery.prototype.limit = function (limit) {
            this._dataQuery.limit = limit;
            return this;
        };
        ChildrenQuery.prototype.start = function (start) {
            this._dataQuery.start = start;
            return this;
        };
        /**
         * Adds a child object to the collection containing the passed data.
         * The newly added element will get a generated path id.
        */
        ChildrenQuery.prototype.add = function (objectData, callback) {
            this._executor.addChild(objectData, null, callback);
        };
        /**
         * Searches an element in the collection that fits the previously filtered Data.
         * if no result has been returned it adds a child object to the collection containing the passed data.
         * The newly added element will get a generated path id.
        */
        ChildrenQuery.prototype.addOrFindOne = function (newObjectValue, action) {
            this._executor.findOneOrAddChild(this.getQuery(), newObjectValue, action);
        };
        /**
         * sets the data of all filtered elements
        */
        ChildrenQuery.prototype.setData = function (data, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this._executor.setChildrenData(this.getQuery(), data, completeCallback);
        };
        /**
         * finishs the query and returns all element that fits the filtered query or null if no element is found
         * a callback handler or primise can be used
        */
        ChildrenQuery.prototype.toList = function (result) {
            this._executor.findChildren(this.getQuery(), result);
        };
        /**
         * modifies the data via an atomicChange object that allows to chain multiple field based atomic operations
        */
        ChildrenQuery.prototype.modifyAndGetData = function (data, callback) {
            this._executor.modifyAndGetChildrenData(this.getQuery(), data, callback);
        };
        /**
         * Adds a child object to the collection containing the passed data.
         * The newly added element will get a generated path id.
        */
        ChildrenQuery.prototype.addAsync = function (objectData) {
            var tcs = new Promise();
            this.add(objectData, function (error, data, context) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    var result = new ADataAndPathContext();
                    result.data = data;
                    result.context = context;
                    tcs.resolve(result);
                }
            });
            return tcs.getData();
        };
        /**
         * sets the data of all filtered elements
        */
        ChildrenQuery.prototype.setDataAsync = function (data) {
            var tcs = new Promise();
            this.setData(data, function (error, count) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(count);
                }
            });
            return tcs.getData();
        };
        /**
         * Searches an element in the collection that fits the previously filtered Data.
         * if no result has been returned it adds a child object to the collection containing the passed data.
         * The newly added element will get a generated path id.
        */
        ChildrenQuery.prototype.addOrFindOneAsync = function (newObjectValue) {
            var tcs = new Promise();
            this.addOrFindOne(newObjectValue, function (error, data, context, isNew) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    var result = new FindOneOrAddChildResult();
                    result.context = context;
                    result.data = data;
                    result.isNew = isNew;
                }
            });
            return tcs.getData();
        };
        /**
         * finishs the query and returns all element that fits the filtered query or null if no element is found
         * a callback handler or primise can be used
        */
        ChildrenQuery.prototype.toListAsync = function () {
            var tsc = new Promise();
            this.toList(function (error, list, count) {
                if ((error != null)) {
                    tsc.reject(new AfinityException(error));
                }
                else {
                    var listResult = new APListQueryResult();
                    listResult.fullCount = count;
                    listResult.list = list;
                    tsc.resolve(listResult);
                }
            });
            return tsc.getData();
        };
        /**
         * modifies the data via an atomicChange object that allows to chain multiple field based atomic operations
        */
        ChildrenQuery.prototype.modifyAndGetDataAsync = function (data) {
            var tcs = new Promise();
            this.modifyAndGetData(data, function (error, list, count) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    var result = new APListQueryResult();
                    result.fullCount = count;
                    result.list = list;
                    tcs.resolve(result);
                }
            });
            return tcs.getData();
        };
        /**
         * delets the elements fitting the filtered query and returns the amount of deleted elements or an error
        */
        ChildrenQuery.prototype.delete = function (completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this._executor.removeChildren(this.getQuery(), completeCallback);
        };
        /**
         * delets the elements fitting the filtered query and returns the amount of deleted elements or an error
        */
        ChildrenQuery.prototype.deleteAsync = function () {
            var tcs = new Promise();
            this.delete(function (error, count) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(count);
                }
            });
            return tcs.getData();
        };
        /**
         * finishs the query and returns the first element that fits the filtered query or null if no element is found
         * a callback handler or primise can be used
        */
        ChildrenQuery.prototype.first = function (result) {
            this._dataQuery.limit = 1;
            this.toList(function (error, list, count) {
                if ((error != null)) {
                    result(error, null);
                }
                else {
                    if (((list == null) || (list.length < 1))) {
                        result(null, null);
                    }
                    else {
                        result(null, list[0]);
                    }
                }
            });
        };
        /**
         * finishs the query and returns the first element that fits the filtered query or null if no element is found
         * a callback handler or primise can be used
        */
        ChildrenQuery.prototype.firstAsync = function () {
            var tcs = new Promise();
            this.first(function (error, ele) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(ele);
                }
            });
            return tcs.getData();
        };
        /**
         * registers a handler that will be triggered when an element is added to the collection path
        */
        ChildrenQuery.prototype.onAdd = function (handler, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            this._executor.onChildAdd(function (data, context) {
                handler(data, context);
            }, null, function (error) {
                _this.useCompletionCallback(completeCallback, error);
            });
        };
        /**
         * registers a handler that will be triggered when an element is added to the collection path
        */
        ChildrenQuery.prototype.onAddAsync = function (handler) {
            var tcs = new Promise();
            this.onAdd(handler, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * registers a handler that will be triggered when an element is changed in the collection path
        */
        ChildrenQuery.prototype.onChange = function (handler, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            this._executor.onChildChange(function (data, context) {
                handler(data, context);
            }, null, function (error) {
                _this.useCompletionCallback(completeCallback, error);
            });
        };
        /**
         * registers a handler that will be triggered when an element is changed in the collection path
        */
        ChildrenQuery.prototype.onChangeAsync = function (handler) {
            var tcs = new Promise();
            this.onChange(handler, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * registers a handler that will be triggered when an element is deleted in the collection path
        */
        ChildrenQuery.prototype.onDelete = function (handler, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            this._executor.onChildDelete(function (data, context) {
                handler(data, context);
            }, null, function (error) {
                _this.useCompletionCallback(completeCallback, error);
            });
        };
        /**
         * registers a handler that will be triggered when an element is deleted in the collection path
        */
        ChildrenQuery.prototype.onDeleteAsync = function (handler) {
            var tcs = new Promise();
            this.onDelete(handler, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * registers handlers for add, remove and change to the given collection path.
         * the add handler will be triggered for all elements that fit the Filter query.
        */
        ChildrenQuery.prototype.live = function (onAdd, onRemove, onChange, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            this._executor.getAndListenOnChilden(this.getQuery(), (((onAdd == null) && (onChange == null)) && (onRemove == null)), onAdd, onChange, onRemove, false, false, function (error) {
                _this.useCompletionCallback(completeCallback, error);
            });
        };
        /**
         * registers handlers for add, remove and change to the given collection path.
         * the add handler will be triggered for all elements that fit the Filter query.
        */
        ChildrenQuery.prototype.liveAsync = function (onAdd, onRemove, onChange) {
            var tcs = new Promise();
            this.live(onAdd, onRemove, onChange, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        ChildrenQuery.prototype.useCompletionCallback = function (completeCallback, error) {
            if ((completeCallback != null)) {
                completeCallback(error);
            }
            else if ((error != null)) {
                this._executor.unhandeledError(error);
            }
        };
        ChildrenQuery.prototype.getQuery = function () {
            if ((this._dataQuery == null)) {
                return new ICDataQuery();
            }
            return this._dataQuery;
        };
        /**
         * filters the collection data via a Field Filter.
         * The data needs to be converted into a result by e.g. ToList();
         * example:
         * var booksForAdults = infinicast.Path("Books")
         * // Fluent Filter
         * .FilterInData(Filter.For("fromAge").Gt(18))
         * .FilterInData(Filter.For("releaseDate").Gt(DateTime.Now))
         * .ToListAsync();
        */
        ChildrenQuery.prototype.filterInData = function (filter) {
            // dispatching to 'overload':
            if (filter instanceof Filter) {
                return this.filterInData1(filter);
            }
            else if (filter instanceof Object) {
                return this.filterInData2(filter);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        return ChildrenQuery;
    })();
    Infinicast.ChildrenQuery = ChildrenQuery;
    var PathRoleSettings = (function () {
        function PathRoleSettings() {
        }
        PathRoleSettings.prototype.allowAllMessage = function () {
            this.sendMessage = true;
            this.receiveMessage = true;
            this.validateMessage = true;
            this.readMessageListenerList = true;
            return this;
        };
        PathRoleSettings.prototype.allowAllRequest = function () {
            this.sendRequest = true;
            this.answerRequest = true;
            this.readRequestListenerList = true;
            return this;
        };
        PathRoleSettings.prototype.allowAllData = function () {
            this.writeData = true;
            this.readData = true;
            this.validateData = true;
            this.readDataListenerList = true;
            return this;
        };
        PathRoleSettings.prototype.allowAll = function () {
            this.allowAllMessage();
            this.allowAllRequest();
            this.allowAllData();
            return this;
        };
        PathRoleSettings.prototype.denyAllMessage = function () {
            this.sendMessage = false;
            this.receiveMessage = false;
            this.validateMessage = false;
            this.readMessageListenerList = false;
            return this;
        };
        PathRoleSettings.prototype.denyAllRequest = function () {
            this.sendRequest = false;
            this.answerRequest = false;
            this.readRequestListenerList = false;
            return this;
        };
        PathRoleSettings.prototype.denyAllData = function () {
            this.writeData = false;
            this.readData = false;
            this.validateData = false;
            this.readDataListenerList = false;
            return this;
        };
        PathRoleSettings.prototype.allowAllListenerLists = function () {
            this.readMessageListenerList = true;
            this.readDataListenerList = true;
            this.readRequestListenerList = true;
            return this;
        };
        PathRoleSettings.prototype.denyAllListenerLists = function () {
            this.readMessageListenerList = false;
            this.readDataListenerList = false;
            this.readRequestListenerList = false;
            return this;
        };
        PathRoleSettings.prototype.denyAll = function () {
            this.denyAllMessage();
            this.denyAllRequest();
            this.denyAllData();
            return this;
        };
        PathRoleSettings.prototype.toJson = function () {
            var data = new Object();
            if ((this.sendMessage != null)) {
                data["sendMessage"] = this.sendMessage;
            }
            if ((this.receiveMessage != null)) {
                data["receiveMessage"] = this.receiveMessage;
            }
            if ((this.validateMessage != null)) {
                data["validateMessage"] = this.validateMessage;
            }
            if ((this.requiresMessageValidation != null)) {
                data["requiresMessageValidation"] = this.requiresMessageValidation;
            }
            if ((this.readMessageListenerList != null)) {
                data["readMessageListenerList"] = this.readMessageListenerList;
            }
            if ((this.sendRequest != null)) {
                data["sendRequest"] = this.sendRequest;
            }
            if ((this.answerRequest != null)) {
                data["answerRequest"] = this.answerRequest;
            }
            if ((this.readRequestListenerList != null)) {
                data["readRequestListenerList"] = this.readRequestListenerList;
            }
            if ((this.writeData != null)) {
                data["writeData"] = this.writeData;
            }
            if ((this.readData != null)) {
                data["readData"] = this.readData;
            }
            if ((this.validateData != null)) {
                data["validateData"] = this.validateData;
            }
            if ((this.requiresDataValidation != null)) {
                data["requiresDataValidation"] = this.requiresDataValidation;
            }
            if ((this.readDataListenerList != null)) {
                data["readDataListenerList"] = this.readDataListenerList;
            }
            return data;
        };
        return PathRoleSettings;
    })();
    Infinicast.PathRoleSettings = PathRoleSettings;
    var RoleSettings = (function () {
        function RoleSettings() {
        }
        Object.defineProperty(RoleSettings.prototype, "allowConnectAsRole", {
            get: function () {
                return this._allowConnectAsRole;
            },
            set: function (value) {
                this._allowConnectAsRole = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RoleSettings.prototype, "allowIps", {
            get: function () {
                return this._allowIps;
            },
            set: function (value) {
                this._allowIps = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RoleSettings.prototype, "allowEps", {
            get: function () {
                return this._allowEps;
            },
            set: function (value) {
                this._allowEps = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RoleSettings.prototype, "grantDevSetup", {
            get: function () {
                return this._grantDevSetup;
            },
            set: function (value) {
                this._grantDevSetup = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RoleSettings.prototype, "grantRoleAssignments", {
            get: function () {
                return this._grantRoleAssignments;
            },
            set: function (value) {
                this._grantRoleAssignments = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RoleSettings.prototype, "timeoutInMs", {
            get: function () {
                return this._timeoutInMs;
            },
            set: function (value) {
                this._timeoutInMs = value;
            },
            enumerable: true,
            configurable: true
        });
        RoleSettings.prototype.toJson = function () {
            var result = new Object();
            if ((this.allowConnectAsRole != null)) {
                result["allowConnectAsRole"] = this.allowConnectAsRole;
            }
            if (!(String.isNullOrEmpty(this.allowEps))) {
                result["allowEps"] = this.allowEps;
            }
            if (!(String.isNullOrEmpty(this.allowIps))) {
                result["allowIps"] = this.allowIps;
            }
            if (!(String.isNullOrEmpty(this.grantRoleAssignments))) {
                result["grantRoleAssignments"] = this.grantRoleAssignments;
            }
            if ((this.grantDevSetup != null)) {
                result["grantDevSetup"] = this.grantDevSetup;
            }
            if ((this.timeoutInMs != null)) {
                result["timeoutInMs"] = this.timeoutInMs;
            }
            return result;
        };
        return RoleSettings;
    })();
    Infinicast.RoleSettings = RoleSettings;
    var PathHandlerContainer = (function () {
        function PathHandlerContainer(path) {
            this._path = path;
            this._handlersByType = {};
        }
        PathHandlerContainer.prototype.addHandler = function (type, handler) {
            if (!(Object.keys(this._handlersByType).includes(type))) {
                this._handlersByType[type] = new PathMessageHandlerContainer(this._path);
            }
            this._handlersByType[type].addHandler(handler);
        };
        PathHandlerContainer.prototype.callHandlers = function (type, data, context, requestId) {
            if (Object.keys(this._handlersByType).includes(type)) {
                this._handlersByType[type].callHandlers(data, context, requestId);
            }
        };
        PathHandlerContainer.prototype.getPath = function () {
            return this._path;
        };
        PathHandlerContainer.prototype.removeHandler = function (type) {
            delete this._handlersByType[type];
        };
        PathHandlerContainer.prototype.isEmpty = function () {
            return (Object.keys(this._handlersByType).length == 0);
        };
        return PathHandlerContainer;
    })();
    Infinicast.PathHandlerContainer = PathHandlerContainer;
    var ValidationResponder = (function () {
        function ValidationResponder(validateMessageType, messageManager, acceptJson, path, endpointInfo) {
            this._validateMessageType = validateMessageType;
            this._messageManager = messageManager;
            this._acceptJson = acceptJson;
            this._path = path;
            this._endpointInfo = endpointInfo;
        }
        ValidationResponder.prototype.accept = function () {
            this._messageManager.sendValidatedMessage(this._validateMessageType, this._path, this._acceptJson, this._endpointInfo.endpointId);
        };
        ValidationResponder.prototype.correct = function (correctedJson) {
            this._messageManager.sendValidatedMessage(this._validateMessageType, this._path, correctedJson, this._endpointInfo.endpointId);
        };
        ValidationResponder.prototype.reject = function () {
        };
        return ValidationResponder;
    })();
    Infinicast.ValidationResponder = ValidationResponder;
    var StormSettings = (function () {
        function StormSettings(messageManager) {
            this._messageManager = messageManager;
        }
        StormSettings.prototype.createOrUpdateRole = function (name, data, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            var message = new Object();
            message["data"] = data.toJson();
            message["name"] = name;
            this._messageManager.sendMessageWithResponse(Connector2EpsMessageType.CreateOrUpdateRole, null, message, function (json, context) {
                if (!(ErrorHandlingHelper.checkIfHasErrorsAndCallHandlersNew(_this._messageManager.getConnector(), json, completeCallback, context.path))) {
                    if ((completeCallback != null)) {
                        completeCallback(null);
                    }
                }
            });
        };
        StormSettings.prototype.createOrUpdateRoleAsync = function (name, roleSettings) {
            var tcs = new Promise();
            this.createOrUpdateRole(name, roleSettings, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        StormSettings.prototype.destroyRole = function (name, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            var message = new Object();
            message["name"] = name;
            this._messageManager.sendMessageWithResponse(Connector2EpsMessageType.DestroyRole, null, message, function (json, context) {
                if (!(ErrorHandlingHelper.checkIfHasErrorsAndCallHandlersNew(_this._messageManager.getConnector(), json, completeCallback, context.path))) {
                    if ((completeCallback != null)) {
                        completeCallback(null);
                    }
                }
            });
        };
        StormSettings.prototype.destroyRoleAsync = function (name) {
            var tcs = new Promise();
            this.destroyRole(name, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        return StormSettings;
    })();
    Infinicast.StormSettings = StormSettings;
    var PathMessageHandlerContainer = (function () {
        function PathMessageHandlerContainer(path) {
            this._path = path;
            this._handlers = new Array();
        }
        PathMessageHandlerContainer.prototype.addHandler = function (handler) {
            this._handlers.push(handler);
        };
        PathMessageHandlerContainer.prototype.callHandlers = function (data, context, requestId) {
            var jsonData = null;
            if ((data != null)) {
                jsonData = data;
            }
            for (var _i = 0, _a = this._handlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                if ((handler != null)) {
                    handler(jsonData, context, requestId);
                }
                else {
                    PathMessageHandlerContainer.logger.error(("null handler for request " + requestId));
                }
            }
        };
        PathMessageHandlerContainer.prototype.getPath = function () {
            return this._path;
        };
        PathMessageHandlerContainer.logger = LoggerFactory.getLogger(typeof (PathMessageHandlerContainer));
        return PathMessageHandlerContainer;
    })();
    Infinicast.PathMessageHandlerContainer = PathMessageHandlerContainer;
    var ConnectorMessageManager = (function () {
        function ConnectorMessageManager() {
            this._connector2EpsProtocol = new Connector2EpsProtocol();
            this._receiver = new ConnectorMessageReceiver();
            this._requestId = 1;
            this.requestIdLock = new LockObject();
        }
        ConnectorMessageManager.prototype.onConnect = function () {
            this.sendInitMessage(this._connector.getSpace(), this._connector.getRole(), this._connector.getCredentials());
        };
        ConnectorMessageManager.prototype.onReceiveFromServer = function (stringMessage) {
            this.getReceiver().receive(stringMessage);
        };
        ConnectorMessageManager.prototype.onDisconnect = function () {
            this._connector.triggerDisconnect();
        };
        ConnectorMessageManager.prototype.setSender = function (sender) {
            this._sender = sender;
        };
        ConnectorMessageManager.prototype.sendMessageWithResponseString = function (messageType, pathString, data, responseHandler) {
            var messageRequestId = this.getRequestId();
            this._receiver.addResponseHandler(Connector2EpsMessageType.RequestResponse, messageRequestId.toString(), function (json, context, requestedId) {
                responseHandler(json, context);
            });
            this._sender.sendMessage(this._connector2EpsProtocol.encodeMessageWithResponse(messageType, pathString, data, messageRequestId));
        };
        ConnectorMessageManager.prototype.sendMessageWithResponse = function (messageType, path, data, responseHandler) {
            var strPath = "";
            if ((path != null)) {
                strPath = path.toString();
            }
            this.sendMessageWithResponseString(messageType, strPath, data, responseHandler);
        };
        ConnectorMessageManager.prototype.getRequestId = function () {
            var id;
            id = ++(this._requestId);
            return id;
        };
        ConnectorMessageManager.prototype.sendInitMessage = function (space, type, credentials) {
            this._sender.sendMessage(this._connector2EpsProtocol.encodeInitConnector(space, type, credentials));
        };
        ConnectorMessageManager.prototype.sendRequestAnswer = function (messageType, path, data, targetEndpoint, requestId) {
            this._sender.sendMessage(this._connector2EpsProtocol.encodeMessageWithRequestId(messageType, path.toString(), data, targetEndpoint, requestId));
        };
        ConnectorMessageManager.prototype.sendMessageString = function (messageType, pathStr, data) {
            this._sender.sendMessage(this._connector2EpsProtocol.encodeMessage(messageType, pathStr, data));
        };
        ConnectorMessageManager.prototype.sendMessage = function (messageType, path, data) {
            this.sendMessageString(messageType, path.toString(), data);
        };
        ConnectorMessageManager.prototype.sendValidatedMessage = function (messageType, path, data, originalEndpoint) {
            this._sender.sendMessage(this._connector2EpsProtocol.encodeValidatedMessage(messageType, path.toString(), data, originalEndpoint));
        };
        ConnectorMessageManager.prototype.addHandler = function (isDelete, messageType, path, handler, completeCallback, options, listenTerminationHandler) {
            var _this = this;
            if (listenTerminationHandler === void 0) { listenTerminationHandler = null; }
            var consomeOnePerRole = null;
            if ((options != null)) {
                consomeOnePerRole = options.isOncePerRole;
            }
            var sticky = null;
            if (((options != null) && options.isSticky)) {
                sticky = true;
            }
            var terminationHandler = (listenTerminationHandler != null);
            var listeningType = ListeningType.Any;
            if ((options != null)) {
                listeningType = options.listenerType;
            }
            var roleFilter = "";
            if (((options != null) && !(String.isNullOrEmpty(options.roleFilter)))) {
                roleFilter = options.roleFilter;
            }
            var messageRequestId = this.getRequestId();
            this._receiver.addResponseHandler(Connector2EpsMessageType.RequestResponse, messageRequestId.toString(), function (json, context, requestedId) {
                var errorJson = null;
                if ((json != null)) {
                    errorJson = json["error"];
                }
                if (((json != null) && (errorJson != null))) {
                    if ((completeCallback != null)) {
                        completeCallback(ErrorInfo.fromJson(errorJson, path.toString()));
                    }
                    else {
                        _this.getConnector().unhandeledError(path, errorJson);
                    }
                }
                else {
                    if ((completeCallback != null)) {
                        completeCallback(null);
                    }
                }
            });
            if (!(isDelete)) {
                this._sender.sendMessage(this._connector2EpsProtocol.encodeRegisterHandlerMessage(messageType, path.toString(), messageRequestId, consomeOnePerRole, sticky, listeningType, roleFilter, terminationHandler));
                this._receiver.addHandler(messageType.toString(), path, handler);
                if ((listenTerminationHandler != null)) {
                    this._receiver.addHandler((messageType.toString() + "_ListenTerminate"), path, function (json, context, id) {
                        //console.log(("Listenterminate received " + JSON.stringify(json)));
                        var ctx = new APathContext();
                        ctx.path = context.path;
                        var reason = ListenTerminateReason[json["reason"]];
                        listenTerminationHandler(reason, ctx);
                    });
                }
            }
            else {
                this._sender.sendMessage(this._connector2EpsProtocol.encodeRemoveHandlerMessage(path.toString(), messageType, messageRequestId, ""));
                this._receiver.removeHandlers(messageType.toString(), path.toString());
                this._receiver.removeHandlers((messageType.toString() + "_ListenTerminate"), path.toString());
            }
        };
        ConnectorMessageManager.prototype.registerHandler = function (messageType, path, handler) {
            if ((handler != null)) {
                this._receiver.addHandler(messageType.toString(), path, handler);
            }
            else {
                this._receiver.removeHandlers(messageType.toString(), path.toString());
            }
        };
        ConnectorMessageManager.prototype.getReceiver = function () {
            return this._receiver;
        };
        ConnectorMessageManager.prototype.setConnector = function (connector) {
            this._connector = connector;
            this.getReceiver().setConnector(connector);
        };
        ConnectorMessageManager.prototype.getConnector = function () {
            return this._connector;
        };
        ConnectorMessageManager.prototype.sendDebugPingInfo = function (iaPath, pingInMs) {
            this._sender.sendMessage(this._connector2EpsProtocol.encodeDebugPingInfo(iaPath.toString(), pingInMs));
        };
        ConnectorMessageManager.prototype.sendDebugMessage = function (iaPath, level, data) {
        };
        ConnectorMessageManager.prototype.sendUpdateDebugStatistics = function (filters, handler) {
            var messageRequestId = this.getRequestId();
            this._receiver.addResponseHandler(Connector2EpsMessageType.RequestResponse, messageRequestId.toString(), function (json, context, requestedId) {
                handler(json);
            });
            this._sender.sendMessage(this._connector2EpsProtocol.encodeMessageWithResponse(Connector2EpsMessageType.DebugStatistics, "", filters, messageRequestId));
        };
        return ConnectorMessageManager;
    })();
    Infinicast.ConnectorMessageManager = ConnectorMessageManager;
    var ConnectorMessageReceiver = (function () {
        function ConnectorMessageReceiver() {
            this._handlerMap = {};
            this._logger = LoggerFactory.getLogger(typeof (ConnectorMessageReceiver));
            this._receiveProtocol = new Eps2ConnectorProtocol();
            this.handlerPool = new HandlerPool();
        }
        ConnectorMessageReceiver.prototype.onInitConnector = function (data, senderEndpoint) {
            this._connector.onInitConnector(data, senderEndpoint);
        };
        ConnectorMessageReceiver.prototype.onReceiveRequestResponse = function (data, requestId, senderEndpointObject) {
            var endpointOb = this.getEndpointContext(senderEndpointObject, "");
            this.callHandlersLimited("", Connector2EpsMessageType.RequestResponse, data, endpointOb, requestId, 1);
        };
        ConnectorMessageReceiver.prototype.onReceiveRequest = function (data, path, requestId, senderEndpointObject) {
            var endpointOb = this.getEndpointContext(senderEndpointObject, path);
            this.callHandlers(path, Connector2EpsMessageType.Request, data, endpointOb, requestId);
        };
        ConnectorMessageReceiver.prototype.onReceiveJsonQueryResult = function (list, fullCount, requestId) {
            var data = new Object();
            data["list"] = list;
            data["fullCount"] = fullCount;
            this.callHandlersLimited("", Connector2EpsMessageType.RequestResponse, data, new PathAndEndpointContext(null, null, null), requestId, 1);
        };
        ConnectorMessageReceiver.prototype.onCreateChildSuccess = function (data, path, requestId) {
            this.callHandlersLimited("", Connector2EpsMessageType.RequestResponse, data, this.getEndpointContext(null, ""), requestId, 1);
        };
        ConnectorMessageReceiver.prototype.onGetOrCreate = function (data, path, requestId, newlyCreated) {
            var parameters = new Object();
            parameters["data"] = data;
            parameters["newlyCreated"] = newlyCreated;
            this.callHandlersLimited("", Connector2EpsMessageType.RequestResponse, parameters, this.getEndpointContext(null, path), requestId, 1);
        };
        ConnectorMessageReceiver.prototype.onCreateOrUpdateRole = function (data, requestId) {
            this.callHandlersLimited("", Connector2EpsMessageType.RequestResponse, data, this.getEndpointContext(null, ""), requestId, 1);
        };
        ConnectorMessageReceiver.prototype.onDestroyRole = function (data, requestId) {
            this.callHandlersLimited("", Connector2EpsMessageType.RequestResponse, data, this.getEndpointContext(null, ""), requestId, 1);
        };
        ConnectorMessageReceiver.prototype.onGetRoleForPathResult = function (list, data, requestId) {
            if ((data == null)) {
                data = new Object();
            }
            data["list"] = list;
            this.callHandlersLimited("", Connector2EpsMessageType.RequestResponse, data, this.getEndpointContext(null, ""), requestId, 1);
        };
        ConnectorMessageReceiver.prototype.onIntroduceObject = function (data, path, endpointObject) {
            var endpointOb = this.getEndpointContext(endpointObject, path);
            this.callHandlers(PathUtils.getObjectListPath(path), Connector2EpsMessageType.IntroduceObject, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onListeningEnded = function (path, endpointObject, disconnected, data) {
            data["disconnected"] = disconnected;
            var endpointOb = this.getEndpointContext(endpointObject, path);
            this.callHandlers(path, Connector2EpsMessageType.ListeningEnded, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onListeningStarted = function (path, endpointObject, data) {
            var endpointOb = this.getEndpointContext(endpointObject, path);
            this.callHandlers(path, Connector2EpsMessageType.ListeningStarted, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onListeningChanged = function (path, endpointObject, data) {
            data["path"] = PathUtils.getEndpointPath(data["endpoint"]);
            var endpointOb = this.getEndpointContext(data, path);
            this.callHandlers(path, Connector2EpsMessageType.ListeningChanged, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onReceiveMessage = function (data, path, endpointObject) {
            var endpointOb = this.getEndpointContext(endpointObject, path);
            this.callHandlers(path, Connector2EpsMessageType.Message, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onReceiveMessageValidate = function (data, path, endpointObject) {
            var endpointOb = this.getEndpointContext(endpointObject, path);
            this.callHandlers(path, Connector2EpsMessageType.MessageValidate, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onReceiveDataChangeValidate = function (data, path, endpointObject) {
            var endpointOb = this.getEndpointContext(endpointObject, path);
            this.callHandlers(path, Connector2EpsMessageType.DataChangeValidate, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onListAdd = function (data, listPath, path, senderEndpointObject) {
            var endpointOb = this.getEndpointContext(senderEndpointObject, path);
            this.callHandlers(listPath, Connector2EpsMessageType.ListAdd, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onListChange = function (data, listPath, path, senderEndpointObject) {
            var endpointOb = this.getEndpointContext(senderEndpointObject, path);
            this.callHandlers(listPath, Connector2EpsMessageType.ListChange, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onListRemove = function (data, listPath, path, senderEndpointObject) {
            var endpointOb = this.getEndpointContext(senderEndpointObject, path);
            this.callHandlers(listPath, Connector2EpsMessageType.ListRemove, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onSetObjectData = function (data, path, endpointObject) {
            var objManager = this._connector.getObjectStateManager();
            var endpointOb = this.getEndpointContext(endpointObject, path);
            this.callHandlers(path, Connector2EpsMessageType.SetObjectData, data, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onDebugStatistics = function (json, requestId) {
            this.callHandlersLimited("", Connector2EpsMessageType.RequestResponse, json, this.getEndpointContext(null, ""), requestId, 1);
        };
        ConnectorMessageReceiver.prototype.onPathRoleSetup = function (data, requestId) {
            this.callHandlersLimited("", Connector2EpsMessageType.RequestResponse, data, this.getEndpointContext(null, ""), requestId, 1);
        };
        ConnectorMessageReceiver.prototype.onReminderTriggered = function (path, data) {
            this.callHandlers(path, Connector2EpsMessageType.Reminder, data, null, 0);
        };
        ConnectorMessageReceiver.prototype.onListenTerminate = function (data) {
            var paths = data["paths"];
            var handlerType = data["handlerType"];
            if (!(String.isNullOrEmpty(handlerType))) {
                this.callListenTerminate(data, paths, handlerType);
            }
            else {
                this.callListenTerminate(data, paths, "Message");
                this.callListenTerminate(data, paths, "MessageValidate");
                this.callListenTerminate(data, paths, "Request");
                this.callListenTerminate(data, paths, "SetObjectData");
                this.callListenTerminate(data, paths, "SetObjectDataValidate");
            }
        };
        ConnectorMessageReceiver.prototype.onEndpointDisconnected = function (path, endpointObject) {
            var endpointOb = this.getEndpointContext(endpointObject, path);
            this.callHandlers(path, Connector2EpsMessageType.EndpointDisconnected, null, endpointOb, 0);
        };
        ConnectorMessageReceiver.prototype.onDebugObserverMessage = function (path, data) {
            this.callHandlers(path, Connector2EpsMessageType.DebugObserverMessage, data, null, 0);
        };
        ConnectorMessageReceiver.prototype.callListenTerminate = function (data, paths, handlerType) {
            for (var _i = 0; _i < paths.length; _i++) {
                var path = paths[_i];
                var pathString = path;
                this.callHandlersByString(pathString, ((handlerType + "_") + Connector2EpsMessageType.ListenTerminate.toString()), data, this.getEndpointContext(null, pathString), 0);
            }
        };
        ConnectorMessageReceiver.prototype.addHandler = function (messageType, path, handler) {
            var messageHandlerBag = this.ensureMessageHandlerBag(messageType, path);
            messageHandlerBag.addHandler(messageType, handler);
        };
        ConnectorMessageReceiver.prototype.removeHandlers = function (messageType, path) {
            if (Object.keys(this._handlerMap).includes(path)) {
                var bag = this._handlerMap[path];
                if ((bag != null)) {
                    bag.removeHandler(messageType);
                    if (bag.isEmpty()) {
                        delete this._handlerMap[path];
                    }
                }
            }
        };
        ConnectorMessageReceiver.prototype.addResponseHandler = function (messageType, requestId, handler) {
            var messageHandlerBag = this.ensureMessageHandlerBag(((messageType + "_") + requestId), null);
            messageHandlerBag.addHandler(messageType.toString(), handler);
        };
        ConnectorMessageReceiver.prototype.receive = function (msg) {
            if (this._logger.isDebugEnabled) {
                this._logger.debug(("received " + msg.DataAsString));
            }
            try {
                this._receiveProtocol.decodeStringMessage(msg, this);
            }
            catch (ex) {
                this._logger.error(((("Exception in decode message " + msg.DataAsString) + " ") + ex.message));
            }
        };
        ConnectorMessageReceiver.prototype.setConnector = function (connector) {
            this._connector = connector;
        };
        ConnectorMessageReceiver.prototype.ensureMessageHandlerBag = function (name, path) {
            if ((path != null)) {
                name = path.toString();
            }
            var bag = new PathHandlerContainer(path);
            bag = getOrAdd(this._handlerMap, name, bag);
            return bag;
        };
        ConnectorMessageReceiver.prototype.getMessageHandlerBags = function (name, path) {
            var bags = new Array();
            for (var _i = 0, _a = PathUtils.getWildCardedPaths(path); _i < _a.length; _i++) {
                var p = _a[_i];
                var n = name;
                if (!(String.isNullOrEmpty(p))) {
                    n = p;
                }
                var bag = this._handlerMap[n];
                if ((bag != null)) {
                    bags.push(bag);
                }
            }
            return bags;
        };
        ConnectorMessageReceiver.prototype.callHandlersLimitedByString = function (path, type, data, context, requestId, handlerCount) {
            var _this = this;
            var callCount = 0;
            var bags;
            if (((requestId != 0) && String.isNullOrEmpty(path))) {
                bags = this.getMessageHandlerBags(((type + "_") + requestId), "");
                delete this._handlerMap[((type + "_") + requestId)];
            }
            else {
                bags = this.getMessageHandlerBags(type.toString(), path);
            }
            var useBag = function (bag) {
                _this.handlerPool.queueHandlerCall(function () {
                    bag.callHandlers(type.toString(), data, context, requestId);
                });
            };
            for (var _i = 0; _i < bags.length; _i++) {
                var bag = bags[_i];
                if (((handlerCount == 0) || (callCount < handlerCount))) {
                    callCount++;
                    try {
                        useBag(bag);
                    }
                    catch (ex) {
                        var errorInfo = ErrorInfo.fromMessage(((ex.message + "\r\n") + ex.stack), path);
                        this._connector.unhandeledErrorInfo(null, errorInfo);
                    }
                }
            }
            if ((bags.length == 0)) {
                this._logger.warn((((("request without handler " + path) + " '") + type) + "'"));
            }
        };
        ConnectorMessageReceiver.prototype.callHandlersLimited = function (path, type, data, context, requestId, handlerCount) {
            this.callHandlersLimitedByString(path, type.toString(), data, context, requestId, handlerCount);
        };
        ConnectorMessageReceiver.prototype.callHandlers = function (path, type, data, context, requestId) {
            this.callHandlersLimited(path, type, data, context, requestId, 0);
        };
        ConnectorMessageReceiver.prototype.callHandlersByString = function (path, type, data, context, requestId) {
            this.callHandlersLimitedByString(path, type, data, context, requestId, 0);
        };
        ConnectorMessageReceiver.prototype.getEndpointContext = function (senderEndpointObject, pathStr) {
            var endpoint = null;
            if ((senderEndpointObject != null)) {
                endpoint = new Endpoint(senderEndpointObject["path"], senderEndpointObject["endpoint"], this._connector.getRootPath());
            }
            var endpointData = null;
            if (((senderEndpointObject != null) && (senderEndpointObject["data"] != null))) {
                endpointData = senderEndpointObject["data"];
            }
            var path = null;
            if (!(String.isNullOrEmpty(pathStr))) {
                path = this.getConnector().path(pathStr);
            }
            return new PathAndEndpointContext(path, endpoint, endpointData);
        };
        ConnectorMessageReceiver.prototype.getConnector = function () {
            return this._connector;
        };
        return ConnectorMessageReceiver;
    })();
    Infinicast.ConnectorMessageReceiver = ConnectorMessageReceiver;
    var MessageSender = (function () {
        function MessageSender(connection) {
            this._logger = LoggerFactory.getLogger(typeof (MessageSender));
            this._connection = connection;
        }
        MessageSender.prototype.sendMessage = function (data) {
            var convertedMsg = data.buildStringMessage();
            if (this._logger.isDebugEnabled) {
                var messageAsString = convertedMsg.DataAsString;
                this._logger.debug(("Send Message " + messageAsString));
            }
            try {
                this._connection.SendToServer(convertedMsg);
            }
            catch (ex) {
                this._logger.error("Could not send ", ex);
            }
        };
        return MessageSender;
    })();
    Infinicast.MessageSender = MessageSender;
    var ObjectStateManager = (function () {
        function ObjectStateManager(apServiceStormConnector) {
            this._localObjects = {};
            this._connector = apServiceStormConnector;
        }
        ObjectStateManager.prototype.getOrCreateLocalObject = function (path) {
            if (!(Object.keys(this._localObjects).includes(path))) {
                var obj = this._connector.path(path);
                this._localObjects[path] = obj;
            }
            return this._localObjects[path];
        };
        return ObjectStateManager;
    })();
    Infinicast.ObjectStateManager = ObjectStateManager;
    /**
     * Everything in Infinicast is using paths. Paths are the way to share anything:
     * paths can be used to store data, send requests and send messages.
     * all data, requests, messages can be listened on and live updates can be received.
    */
    var PathImpl = (function () {
        function PathImpl(path) {
            this._childQueryExecutor = null;
            this._pathQueryWithHandlerExecutor = null;
            this._logger = LoggerFactory.getLogger(typeof (PathImpl));
            this._listenerQueryExecutor = null;
            this._advancedOptions = null;
            this._internalPath = path;
        }
        Object.defineProperty(PathImpl.prototype, "executorForPathHandler", {
            get: function () {
                if ((this._pathQueryWithHandlerExecutor == null)) {
                    this._pathQueryWithHandlerExecutor = new PathQueryWithHandlerExecutor(this.getRoot().getConnector(), this, this.messageManager);
                }
                return this._pathQueryWithHandlerExecutor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathImpl.prototype, "children", {
            /**
             * basically allows to use this path as a collection.
             * returns the reference to a IChildrenQuery element that can be used to modify, query, delete.. children of this path.
            */
            get: function () {
                if ((this._childQueryExecutor == null)) {
                    this._childQueryExecutor = new ChildQueryExecutor(this.getRoot().getConnector(), this, this.messageManager);
                }
                return new ChildrenQuery(this, this._childQueryExecutor);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathImpl.prototype, "listeners", {
            /**
             * returns the reference to a IListenerQuery element that can be used to get informations about the listening endpoints on a given path.
            */
            get: function () {
                if ((this._listenerQueryExecutor == null)) {
                    this._listenerQueryExecutor = new ListenerQueryExecutor(this.getRoot().getConnector(), this, this.messageManager);
                }
                return new ListenerQuery(this, this._listenerQueryExecutor);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathImpl.prototype, "parentPathAddress", {
            /**
             * returns the string representation of the parent path
             * Example: on a path /my/foo/bar/ the result would be a string containing '/my/foo/'
            */
            get: function () {
                return PathUtils.getObjectListPath(this.getPathAddress());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathImpl.prototype, "id", {
            /**
             * returns the id part of this path.
             * Example: on a path /my/foo/bar/ the id would be the stirng 'bar'
            */
            get: function () {
                return PathUtils.getLastPathPart(this.getPathAddress());
            },
            enumerable: true,
            configurable: true
        });
        PathImpl.prototype.getPathAddress = function () {
            return PathUtils.cleanup(this._internalPath);
        };
        PathImpl.prototype.copy = function () {
            var path = new PathImpl(this._internalPath);
            path.setMessageManager(this.messageManager);
            path.setRoot(this.getRoot());
            path._advancedOptions = this._advancedOptions;
            return path;
        };
        PathImpl.prototype.path = function (pathAddress) {
            var path = new PathImpl(this.combinePath(pathAddress));
            path.setMessageManager(this.messageManager);
            path.setRoot(this.getRoot());
            path.setConnector(this.getConnector());
            return path;
        };
        PathImpl.prototype.setConnector = function (connector) {
            this._connector = connector;
        };
        PathImpl.prototype.combinePath = function (path) {
            return PathUtils.combine(this._internalPath, path);
        };
        PathImpl.prototype.setMessageManager = function (messageManager) {
            this.messageManager = messageManager;
        };
        PathImpl.prototype.getConnector = function () {
            if ((this._root == null)) {
                return this._connector;
            }
            return this.getRoot().getConnector();
        };
        PathImpl.prototype.setRoot = function (root) {
            this._root = root;
            this.messageManager = root.messageManager;
        };
        PathImpl.prototype.getRoot = function () {
            if ((this._root == null)) {
                return this;
            }
            return this._root;
        };
        /**
         * returns a path reference to the parent collection of this path.
         * Example: on a path /my/foo/bar/ the result would be a reference to /my/foo/
         * @return  returns a path reference to the parent collection of this path.
        */
        PathImpl.prototype.parentPath = function () {
            return this.parentPathWithDepth(1);
        };
        PathImpl.prototype.parentPathWithDepth = function (depth) {
            var parentPath = this._internalPath;
            for (var i = 0; (i < depth); i++) {
                parentPath = PathUtils.getParentPath(parentPath);
                if (String.isNullOrEmpty(parentPath)) {
                    return null;
                }
            }
            var newPath = new PathImpl(parentPath);
            newPath.setMessageManager(this.messageManager);
            newPath.setRoot(this.getRoot());
            return newPath;
        };
        /**
         * Sets the data of this path.
         * @param json the data to be assigned
         * @param completeCallback a result that indicates success or failure
        */
        PathImpl.prototype.setData = function (json, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            this.messageManager.sendMessageWithResponse(Connector2EpsMessageType.SetObjectData, this, json, function (resultJson, context) {
                if (!(_this.checkIfHasErrorsAndCallHandlersNew(resultJson, completeCallback))) {
                    if ((completeCallback != null)) {
                        completeCallback(null);
                    }
                }
            });
        };
        /**
         * Sets the data of this path.
         * @param json the data to be assigned
         * @return a result that indicates success or failure
        */
        PathImpl.prototype.setDataAsync = function (json) {
            var tsc = new Promise();
            this.setData(json, function (error) {
                PathImpl.handleCompleteHandlerAsyncVoid(tsc, error);
            });
            return tsc.getData();
        };
        /**
         * Modify Path Data by providing an AtomicChange object that allows to chain operations into one atomic operation.
         * The callback function will return the resulting json
         * @param data an AtomicChange object that can chain multiple atomic changes into one big atomic change
         * @param completeCallback a callback function that indicates if the function was successfull(error=null) or failed(error contains the error in that case)
        */
        PathImpl.prototype.modifyDataAtomicAndGetResult = function (data, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            var json = new Object();
            json["changes"] = data.toJson();
            if (data.hasNamedQueries()) {
                json["named"] = data.getNamedQueryJson();
            }
            this.messageManager.sendMessageWithResponse(Connector2EpsMessageType.UpdateData, this, json, function (resultJson, context) {
                if (!(_this.checkIfHasErrorsAndCallHandlersNew(resultJson, function (error) {
                    if ((completeCallback != null)) {
                        completeCallback(error, null);
                    }
                    else {
                        _this.getConnector().unhandeledErrorInfo(_this, error);
                    }
                }))) {
                    if ((completeCallback != null)) {
                        completeCallback(null, resultJson["data"]);
                    }
                }
            });
        };
        PathImpl.prototype.modifyDataAtomicAndGetResultAsync = function (atomicChangeChange) {
            var tsc = new Promise();
            this.modifyDataAtomicAndGetResult(atomicChangeChange, function (error, data) {
                if ((error != null)) {
                    tsc.reject(new AfinityException(error));
                }
                else {
                    tsc.resolve(data);
                }
            });
            return tsc.getData();
        };
        /**
         * Modify Path Data by providing an AtomicChange object that allows to chain operations into one atomic operation.
         * The callback function will return if the operation was successfull or not
         * @param data an AtomicChange object that can chain multiple atomic changes into one big atomic change
         * @param completeCallback a callback function that indicates if the function was successfull(error=null) or failed(error contains the error in that case)
        */
        PathImpl.prototype.modifyDataAtomic = function (data, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            var json = new Object();
            json["changes"] = data.toJson();
            if (data.hasNamedQueries()) {
                json["named"] = data.getNamedQueryJson();
            }
            json["returnData"] = false;
            this.messageManager.sendMessageWithResponse(Connector2EpsMessageType.UpdateData, this, json, function (resultJson, context) {
                if (!(_this.checkIfHasErrorsAndCallHandlersNew(resultJson, function (error) {
                    if ((completeCallback != null)) {
                        completeCallback(error);
                    }
                    else {
                        _this.getConnector().unhandeledErrorInfo(_this, error);
                    }
                }))) {
                    if ((completeCallback != null)) {
                        completeCallback(null);
                    }
                }
            });
        };
        PathImpl.prototype.modifyDataAtomicAsync = function (atomicChangeChange) {
            var tsc = new Promise();
            this.modifyDataAtomic(atomicChangeChange, function (error) {
                if ((error != null)) {
                    tsc.reject(new AfinityException(error));
                }
                else {
                    tsc.resolve(null);
                }
            });
            return tsc.getData();
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @param completeCallback a callback function that indicates if the function was successfull(error=null) or failed(error contains the error in that case)
        */
        PathImpl.prototype.modifyDataSetValue1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().setValue(field, value), completeCallback);
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @return a Promise indicating failure or success of the operation
        */
        PathImpl.prototype.modifyDataSetValueAsync1 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @param completeCallback a callback function that indicates if the function was successfull(error=null) or failed(error contains the error in that case)
        */
        PathImpl.prototype.modifyDataSetValue2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().setValue(field, value), completeCallback);
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @return a Promise indicating failure or success of the operation
        */
        PathImpl.prototype.modifyDataSetValueAsync2 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @param completeCallback a callback function that indicates if the function was successfull(error=null) or failed(error contains the error in that case)
        */
        PathImpl.prototype.modifyDataSetValue3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().setValue(field, value), completeCallback);
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @return a Promise indicating failure or success of the operation
        */
        PathImpl.prototype.modifyDataSetValueAsync3 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @param completeCallback a callback function that indicates if the function was successfull(error=null) or failed(error contains the error in that case)
        */
        PathImpl.prototype.modifyDataSetValue4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().setValue(field, value), completeCallback);
        };
        PathImpl.prototype.modifyDataSetValueAsync4 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @param completeCallback a callback function that indicates if the function was successfull(error=null) or failed(error contains the error in that case)
        */
        PathImpl.prototype.modifyDataSetValue5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().setValue(field, value), completeCallback);
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @return a Promise indicating failure or success of the operation
        */
        PathImpl.prototype.modifyDataSetValueAsync5 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataIncValue1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().incValue(field, value), completeCallback);
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataIncValueAsync1 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().incValue(field, value));
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataIncValue2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().incValue(field, value), completeCallback);
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataIncValueAsync2 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().incValue(field, value));
        };
        /**
         * Modifies the data by decrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataDecValue1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().decValue(field, value), completeCallback);
        };
        /**
         * Modifies the data by decrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataDecValueAsync1 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().decValue(field, value));
        };
        /**
         * Modifies the data by decrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataDecValue2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().decValue(field, value), completeCallback);
        };
        /**
         * Modifies the data by decrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataDecValueAsync2 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().decValue(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSet1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAsync1 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSet2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAsync2 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSet3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAsync3 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSet4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAsync4 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSet5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAsync5 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSet1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAsync1 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSet2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAsync2 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSet3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAsync3 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSet4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAsync4 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSet5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAsync5 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArray1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAsync1 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArray2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAsync2 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArray3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAsync3 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArray4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAsync4 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArray5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAsync5 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArray1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAsync1 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArray2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAsync2 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArray3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAsync3 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArray4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAsync4 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArray5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomic(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAsync5 = function (field, value) {
            return this.modifyDataAtomicAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResult1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().setValue(field, value), completeCallback);
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResultAsync1 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResult2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().setValue(field, value), completeCallback);
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResultAsync2 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResult3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().setValue(field, value), completeCallback);
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResultAsync3 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResult4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().setValue(field, value), completeCallback);
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResultAsync4 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResult5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().setValue(field, value), completeCallback);
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResultAsync5 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().setValue(field, value));
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataIncValueAndGetResult1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().incValue(field, value), completeCallback);
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataIncValueAndGetResultAsync1 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().incValue(field, value));
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataIncValueAndGetResult2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().incValue(field, value), completeCallback);
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataIncValueAndGetResultAsync2 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().incValue(field, value));
        };
        /**
         * Modifies the data by decrement the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataDecValueAndGetResult1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().decValue(field, value), completeCallback);
        };
        /**
         * Modifies the data by decrement the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataDecValueAndGetResultAsync1 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().decValue(field, value));
        };
        /**
         * Modifies the data by decrement the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataDecValueAndGetResult2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().decValue(field, value), completeCallback);
        };
        /**
         * Modifies the data by decrement the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataDecValueAndGetResultAsync2 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().decValue(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResult1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResultAsync1 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResult2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResultAsync2 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResult3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResultAsync3 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResult4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResultAsync4 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResult5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResultAsync5 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResult1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResultAsync1 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResult2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResultAsync2 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResult3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResultAsync3 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResult4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResultAsync4 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResult5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromSet(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResultAsync5 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromSet(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResult1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResultAsync1 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResult2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResultAsync2 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResult3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResultAsync3 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResult4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResultAsync4 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResult5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().addToArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResultAsync5 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().addToArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResult1 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResultAsync1 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResult2 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResultAsync2 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResult3 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResultAsync3 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResult4 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResultAsync4 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResult5 = function (field, value, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.modifyDataAtomicAndGetResult(new AtomicChange().removeFromArray(field, value), completeCallback);
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResultAsync5 = function (field, value) {
            return this.modifyDataAtomicAndGetResultAsync(new AtomicChange().removeFromArray(field, value));
        };
        /**
         * returns the data stored in the path
         * @param callback the returned json or an error
         * @param options  optional parameter to add additional datacontext to the path (Note: deprecated)
        */
        PathImpl.prototype.getData = function (callback, options) {
            var _this = this;
            if (options === void 0) { options = null; }
            var data = null;
            if ((options != null)) {
                data = new Object();
            }
            data = this.applyAdvancedOptions(data);
            this.messageManager.sendMessageWithResponse(Connector2EpsMessageType.GetObjectData, this, data, function (json, context) {
                if (!(_this.checkIfHasErrorsAndCallHandlersNew(json, function (error) {
                    callback(error, null, null);
                }))) {
                    callback(null, json, _this.getPathAndEndpointContext(context));
                }
            });
        };
        PathImpl.prototype.applyAdvancedOptions = function (data) {
            var realData = data;
            if ((this._advancedOptions != null)) {
                if ((realData == null)) {
                    realData = new Object();
                }
                if ((this._advancedOptions["accessId"] != null)) {
                    data["accessId"] = this._advancedOptions["accessId"];
                }
            }
            return realData;
        };
        /**
         * returns the data stored in the path
         * @param options  optional parameter to add additional datacontext to the path (Note: deprecated)
         * @return the returned json or an error
        */
        PathImpl.prototype.getDataAsync = function (options) {
            if (options === void 0) { options = null; }
            var tsc = new Promise();
            this.getData(function (error, json, context) {
                if ((error != null)) {
                    tsc.reject(new AfinityException(error));
                }
                else {
                    var resultContext = new ADataAndPathContext();
                    resultContext.data = json;
                    resultContext.context = context;
                    tsc.resolve(resultContext);
                }
            }, options);
            return tsc.getData();
        };
        /**
         * deletes the path and child paths
         * @param completeCallback called with success or error
        */
        PathImpl.prototype.delete = function (completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            this.messageManager.sendMessageWithResponse(Connector2EpsMessageType.DeleteFromCollection, this, new Object(), function (json, context) {
                _this.checkIfHasErrorsAndCallHandlersFull(json, completeCallback);
            });
        };
        /**
         * deletes the path and child paths
         * @return promise containg success or error
        */
        PathImpl.prototype.deleteAsync = function () {
            var tcs = new Promise();
            this.delete(function (error) {
                PathImpl.handleCompleteHandlerAsyncVoid(tcs, error);
            });
            return tcs.getData();
        };
        /**
         * Experimental feature:
         * adds a reminder in the cloud. exactly one of the services that is registered via OnReminder will receive the reminder
         * @param schedulingOptions scheduling options to define when the timer should be fired
         * @param json data to be added to the reminder
         * @param completeCallback called with success or error
        */
        PathImpl.prototype.addReminder = function (schedulingOptions, json, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            this.addOrReplaceReminder(null, schedulingOptions, json, completeCallback);
        };
        /**
         * Experimental feature:
         * adds a reminder in the cloud. exactly one of the services that is registered via OnReminder will receive the reminder
         * @param schedulingOptions scheduling options to define when the timer should be fired
         * @param json data to be added to the reminder
         * @return success or error
        */
        PathImpl.prototype.addReminderAsync = function (schedulingOptions, json) {
            return this.addOrReplaceReminderAsync(null, schedulingOptions, json);
        };
        PathImpl.prototype.addOrReplaceReminder = function (queryJson, schedulingOptions, json, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            var data = new Object();
            if ((queryJson != null)) {
                data["query"] = queryJson;
            }
            data["data"] = json;
            data["scheduled"] = schedulingOptions.toJson();
            this.messageManager.sendMessageWithResponse(Connector2EpsMessageType.AddReminder, this, data, function (resultJson, context) {
                _this.checkIfHasErrorsAndCallHandlersFull(resultJson, completeCallback);
            });
        };
        PathImpl.prototype.addOrReplaceReminderAsync = function (queryJson, schedulingOptions, json) {
            var tcs = new Promise();
            this.addReminder(schedulingOptions, json, function (error) {
                PathImpl.handleCompleteHandlerAsyncVoid(tcs, error);
            });
            return tcs.getData();
        };
        PathImpl.prototype.deleteReminder = function (queryJson, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            this.messageManager.sendMessageWithResponse(Connector2EpsMessageType.DeleteReminder, this, queryJson, function (resultJson, context) {
                _this.checkIfHasErrorsAndCallHandlersFull(resultJson, completeCallback);
            });
        };
        PathImpl.prototype.deleteReminderAsync = function (queryJson) {
            var tcs = new Promise();
            this.deleteReminder(queryJson, function (error) {
                PathImpl.handleCompleteHandlerAsyncVoid(tcs, error);
            });
            return tcs.getData();
        };
        PathImpl.prototype.sendRequest = function (data, answer) {
            var _this = this;
            this.messageManager.sendMessageWithResponse(Connector2EpsMessageType.Request, this, data, function (json, context) {
                if (!(_this.checkIfHasErrorsAndCallHandlersNew(json, function (error) {
                    answer(error, null, null);
                }))) {
                    answer(null, json, context);
                }
            });
        };
        PathImpl.prototype.sendRequestAsync = function (data) {
            var tcs = new Promise();
            this.sendRequest(data, function (error, json, context) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    var res = new ADataAndPathAndEndpointContext();
                    res.context = context;
                    res.data = json;
                    tcs.resolve(res);
                }
            });
            return tcs.getData();
        };
        /**
         * Sends a Json Message to a Path. All Endpoints currently listening on Messages on this path will receive it.
         * @param json the Message payload
         * @param completeCallback a callback triggered when the message  has been received by the cloud
        */
        PathImpl.prototype.sendMessage = function (json, completeCallback) {
            var _this = this;
            if (completeCallback === void 0) { completeCallback = null; }
            this.messageManager.sendMessageWithResponse(Connector2EpsMessageType.Message, this, json, function (resultJson, context) {
                _this.checkIfHasErrorsAndCallHandlersFull(resultJson, completeCallback);
            });
        };
        /**
         * Sends a Json Message to a Path. All Endpoints currently listening on Messages on this path will receive it.
         * @param json the Message payload
         * @return a promise that completes when the message has been received by the cloud
        */
        PathImpl.prototype.sendMessageAsync = function (json) {
            var tcs = new Promise();
            this.sendMessage(json, function (error) {
                PathImpl.handleCompleteHandlerAsyncVoid(tcs, error);
            });
            return tcs.getData();
        };
        PathImpl.prototype.addDebugPingInfo = function (pingInMs) {
            this.messageManager.sendDebugPingInfo(this, pingInMs);
        };
        PathImpl.prototype.addDebugMessage1 = function (level, message) {
            var json = new Object();
            json["text"] = message;
            this.addDebugMessage(level, json);
        };
        PathImpl.prototype.addDebugMessage2 = function (level, message) {
            var data = new Object();
            data["level"] = level;
            data["info"] = message;
            this.messageManager.sendDebugMessage(this, level, data);
        };
        PathImpl.prototype.withAdvancedOptions = function (obj) {
            var path = this.copy();
            path._advancedOptions = obj;
            return path;
        };
        PathImpl.handleCompleteHandlerAsyncVoid = function (tcs, error) {
            if ((error != null)) {
                tcs.reject(new AfinityException(error));
            }
            else {
                tcs.resolve(null);
            }
        };
        PathImpl.getRoleCountDictionary = function (json) {
            var roleCount = {};
            var roleCountArray = json["roleCount"];
            if ((roleCountArray != null)) {
                for (var _i = 0; _i < roleCountArray.length; _i++) {
                    var roleOb = roleCountArray[_i];
                    var role = roleOb["role"];
                    var handlerType = roleOb["handlerType"];
                    var count = roleOb["count"];
                    if ((handlerType == "Message")) {
                        roleCount[role] = count;
                    }
                }
            }
            return roleCount;
        };
        /**
         * returns an element of this path address as a string.
         * Example: on a path /my/foo/bar/ idx = 0 would return my, idx = 1 would return foo and idx = 2 would return bar
         * @param idx
         * @return
        */
        PathImpl.prototype.pathAddressElement = function (idx) {
            return PathUtils.getPathAddressElement(this.getPathAddress(), idx);
        };
        /**
         * registers a listener on data changes on this path
         * @param callback callback when the data changed
         * @param registrationCompleteCallback sucessfull registration(error = null) or error
        */
        PathImpl.prototype.onDataChange = function (callback, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this.executorForPathHandler.onDataChange(callback, null, function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this.executorForPathHandler.unhandeledError(error);
                }
            });
        };
        /**
         * registers a listener on data changes on this path
         * @param callback callback when the data changed
         * @return a promise indicating success or error
        */
        PathImpl.prototype.onDataChangeAsync = function (callback) {
            var tcs = new Promise();
            this.onDataChange(callback, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * registers a message handler on this path. Messages sent to this path will  cause the callback handler to be triggered
         * the EndpointAndPath context can be used to get the sending endpoint of th received messages
         * @param callback the callback to be called when a message is sent to this path
         * @param registrationCompleteCallback sucessfull registration(error = null) or error
         * @param listenTerminationHandler an optional parameter to get informed when the listening has been ended by the server.
        */
        PathImpl.prototype.onMessage = function (callback, registrationCompleteCallback, listenTerminationHandler) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            if (listenTerminationHandler === void 0) { listenTerminationHandler = null; }
            this.executorForPathHandler.onMessage(callback, null, function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this.executorForPathHandler.unhandeledError(error);
                }
            }, listenTerminationHandler);
        };
        /**
         * registers a message handler on this path. Messages sent to this path will  cause the callback handler to be triggered
         * the EndpointAndPath context can be used to get the sending endpoint of th received messages
         * @param callback the callback to be called when a message is sent to this path
         * @param listenTerminationHandler an optional parameter to get informed when the listening has been ended by the server.
         * @return a promise indicating success or error
        */
        PathImpl.prototype.onMessageAsync = function (callback, listenTerminationHandler) {
            if (listenTerminationHandler === void 0) { listenTerminationHandler = null; }
            var tcs = new Promise();
            this.onMessage(callback, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            }, listenTerminationHandler);
            return tcs.getData();
        };
        /**
         * registers a data validator on this path. A validator will be called before the data change is applied to the system
         * the validtor needs to accept, change or reject the change via the responder object
         * @param callback callback when the validation occurs
         * @param registrationCompleteCallback sucessfull registration(error = null) or error
        */
        PathImpl.prototype.onValidateDataChange = function (callback, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this.executorForPathHandler.onValidateDataChange(callback, null, function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this.executorForPathHandler.unhandeledError(error);
                }
            });
        };
        /**
         * registers a data validator on this path. A validator will be called before the data change is applied to the system
         * the validator needs to accept, change or reject the change via the responder object
         * @param callback callback when the data changed
         * @return a promise indicating success or error
        */
        PathImpl.prototype.onValidateDataChangeAsync = function (callback) {
            var tcs = new Promise();
            this.onValidateDataChange(callback, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * registers a message validator on this path. A validator will be called before the message is actually sent to the system
         * the validtor needs to accept, change or reject the change via the responder object
         * @param callback callback when the validation occurs
         * @param registrationCompleteCallback sucessfull registration(error = null) or error
        */
        PathImpl.prototype.onValidateMessage = function (callback, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this.executorForPathHandler.onValidateMessage(callback, null, function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this.executorForPathHandler.unhandeledError(error);
                }
            });
        };
        /**
         * registers a message validator on this path. A validator will be called before the message is actually sent to the system
         * the validtor needs to accept, change or reject the change via the responder object
         * @param callback callback when the validation occurs
         * @return a promise indicating success or error
        */
        PathImpl.prototype.onValidateMessageAsync = function (callback) {
            var tcs = new Promise();
            this.onValidateMessage(callback, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * registers a request handler that will be called on one of the listeners as soon as a request on this path is sent.
         * the responder object needs to be used to respond to the sender.
         * @param callback callback that handels the request
         * @param registrationCompleteCallback sucessfull registration(error = null) or error
        */
        PathImpl.prototype.onRequest = function (callback, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this.executorForPathHandler.onRequest(function (json, responder, context) {
                callback(json, responder, context);
            }, null, function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this.executorForPathHandler.unhandeledError(error);
                }
            });
        };
        /**
         * registers a request handler that will be called on one of the listeners as soon as a request on this path is sent.
         * the responder object needs to be used to respond to the sender.
         * @param callback callback that handels the request
         * @return a promise indicating success or error
        */
        PathImpl.prototype.onRequestAsync = function (callback) {
            var tcs = new Promise();
            this.onRequest(callback, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * Experimental feature:
         * registers a reminder handler that will be called on one of the listeners as soon as a reminder on this path is triggered by the system.
         * @param callback callback that handels the reminder event
         * @param registrationCompleteCallback sucessfull registration(error = null) or error
        */
        PathImpl.prototype.onReminder = function (callback, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this.executorForPathHandler.onReminder(callback, null, function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this.executorForPathHandler.unhandeledError(error);
                }
            });
        };
        /**
         * Experimental feature:
         * registers a reminder handler that will be called on one of the listeners as soon as a reminder on this path is triggered by the system.
         * @param callback callback that handels the reminder event
         * @return a promise indicating success or error
        */
        PathImpl.prototype.onReminderAsync = function (callback) {
            var tcs = new Promise();
            this.onReminder(callback, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * this method is deprecated and should no longer be used
         * @param callback
         * @param registrationCompleteCallback
        */
        PathImpl.prototype.onIntroduce = function (callback, registrationCompleteCallback) {
            var _this = this;
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this.executorForPathHandler.onIntroduce(function (data, context) {
                callback(data, context);
            }, function (error) {
                if ((registrationCompleteCallback != null)) {
                    registrationCompleteCallback(error);
                }
                else if ((error != null)) {
                    _this.executorForPathHandler.unhandeledError(error);
                }
            });
        };
        /**
         * this method is deprecated and should no longer be used
         * @param callback
        */
        PathImpl.prototype.onIntroduceAsync = function (callback) {
            var tcs = new Promise();
            this.onIntroduce(callback, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        PathImpl.prototype.checkIfHasErrorsAndCallHandlersNew = function (json, completeCallback) {
            return ErrorHandlingHelper.checkIfHasErrorsAndCallHandlersNew(this.getConnector(), json, completeCallback, this);
        };
        PathImpl.prototype.checkIfHasErrorsAndCallHandlersFull = function (json, completeCallback) {
            ErrorHandlingHelper.checkIfHasErrorsAndCallHandlersFull(this.getConnector(), json, completeCallback, this);
        };
        PathImpl.prototype.getPathAndEndpointContext = function (ctx) {
            var context = new APathContext();
            context.path = ctx.path;
            return context;
        };
        PathImpl.prototype.getPathContext = function (path) {
            var context = new APathContext();
            context.path = path;
            return context;
        };
        /**
         * returns a string representation of the current path e.g. /root/my/path/
         * @return the string representation of this path
        */
        PathImpl.prototype.toString = function () {
            return this.getPathAddress();
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @param completeCallback a callback function that indicates if the function was successfull(error=null) or failed(error contains the error in that case)
        */
        PathImpl.prototype.modifyDataSetValue = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataSetValue1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataSetValue2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('boolean' == typeof (value)))) {
                this.modifyDataSetValue3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataSetValue4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataSetValue5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modify Path Data by setting the field to the passed value
         * @param field
         * @param value
         * @return a Promise indicating failure or success of the operation
        */
        PathImpl.prototype.modifyDataSetValueAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataSetValueAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataSetValueAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('boolean' == typeof (value)))) {
                return this.modifyDataSetValueAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataSetValueAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataSetValueAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataIncValue = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataIncValue1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataIncValue2(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataIncValueAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataIncValueAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataIncValueAsync2(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by decrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataDecValue = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataDecValue1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataDecValue2(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by decrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about success or failure.
        */
        PathImpl.prototype.modifyDataDecValueAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataDecValueAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataDecValueAsync2(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSet = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataAddToSet1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                this.modifyDataAddToSet2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataAddToSet3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataAddToSet4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataAddToSet5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataAddToSetAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                return this.modifyDataAddToSetAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataAddToSetAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataAddToSetAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataAddToSetAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSet = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataRemoveFromSet1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                this.modifyDataRemoveFromSet2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataRemoveFromSet3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataRemoveFromSet4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataRemoveFromSet5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the set
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataRemoveFromSetAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                return this.modifyDataRemoveFromSetAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataRemoveFromSetAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataRemoveFromSetAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataRemoveFromSetAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArray = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataAddToArray1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                this.modifyDataAddToArray2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataAddToArray3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataAddToArray4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataAddToArray5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added.
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataAddToArrayAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                return this.modifyDataAddToArrayAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataAddToArrayAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataAddToArrayAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataAddToArrayAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArray = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataRemoveFromArray1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                this.modifyDataRemoveFromArray2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataRemoveFromArray3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataRemoveFromArray4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataRemoveFromArray5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataRemoveFromArrayAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                return this.modifyDataRemoveFromArrayAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataRemoveFromArrayAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataRemoveFromArrayAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataRemoveFromArrayAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResult = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataSetValueAndGetResult1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataSetValueAndGetResult2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('boolean' == typeof (value)))) {
                this.modifyDataSetValueAndGetResult3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataSetValueAndGetResult4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataSetValueAndGetResult5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * sets the data of a given field to the value.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataSetValueAndGetResultAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataSetValueAndGetResultAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataSetValueAndGetResultAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('boolean' == typeof (value)))) {
                return this.modifyDataSetValueAndGetResultAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataSetValueAndGetResultAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataSetValueAndGetResultAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataIncValueAndGetResult = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataIncValueAndGetResult1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataIncValueAndGetResult2(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by incrementing the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataIncValueAndGetResultAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataIncValueAndGetResultAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataIncValueAndGetResultAsync2(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by decrement the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataDecValueAndGetResult = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataDecValueAndGetResult1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataDecValueAndGetResult2(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by decrement the given field of the data in this path.
         * if the data field is not existing or not a number it will be initialized as 0.
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataDecValueAndGetResultAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataDecValueAndGetResultAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataDecValueAndGetResultAsync2(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResult = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataAddToSetAndGetResult1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                this.modifyDataAddToSetAndGetResult2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataAddToSetAndGetResult3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataAddToSetAndGetResult4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataAddToSetAndGetResult5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be added only once
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToSetAndGetResultAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataAddToSetAndGetResultAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                return this.modifyDataAddToSetAndGetResultAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataAddToSetAndGetResultAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataAddToSetAndGetResultAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataAddToSetAndGetResultAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResult = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataRemoveFromSetAndGetResult1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                this.modifyDataRemoveFromSetAndGetResult2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataRemoveFromSetAndGetResult3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataRemoveFromSetAndGetResult4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataRemoveFromSetAndGetResult5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and ensures that the json will be removed from the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromSetAndGetResultAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataRemoveFromSetAndGetResultAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                return this.modifyDataRemoveFromSetAndGetResultAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataRemoveFromSetAndGetResultAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataRemoveFromSetAndGetResultAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataRemoveFromSetAndGetResultAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResult = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataAddToArrayAndGetResult1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                this.modifyDataAddToArrayAndGetResult2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataAddToArrayAndGetResult3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataAddToArrayAndGetResult4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataAddToArrayAndGetResult5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and adds the value to the array
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataAddToArrayAndGetResultAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataAddToArrayAndGetResultAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                return this.modifyDataAddToArrayAndGetResultAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataAddToArrayAndGetResultAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataAddToArrayAndGetResultAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataAddToArrayAndGetResultAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResult = function (field, value, completeCallback) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                this.modifyDataRemoveFromArrayAndGetResult1(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                this.modifyDataRemoveFromArrayAndGetResult2(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                this.modifyDataRemoveFromArrayAndGetResult3(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataRemoveFromArrayAndGetResult4(field, value, completeCallback);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                this.modifyDataRemoveFromArrayAndGetResult5(field, value, completeCallback);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        /**
         * Modifies the data by converting the given field in the data to an array and removes the value from the array one time
         * if the data field is not existing or not a json array it will be initialized as [].
         * a completion callback or a promise can be used to get an information about the complete data after the change or error.
        */
        PathImpl.prototype.modifyDataRemoveFromArrayAndGetResultAsync = function (field, value) {
            // dispatching to 'overload':
            if ((('string' == typeof (field)) && value instanceof Object)) {
                return this.modifyDataRemoveFromArrayAndGetResultAsync1(field, value);
            }
            else if ((('string' == typeof (field)) && value instanceof Array)) {
                return this.modifyDataRemoveFromArrayAndGetResultAsync2(field, value);
            }
            else if ((('string' == typeof (field)) && ('string' == typeof (value)))) {
                return this.modifyDataRemoveFromArrayAndGetResultAsync3(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataRemoveFromArrayAndGetResultAsync4(field, value);
            }
            else if ((('string' == typeof (field)) && ('number' == typeof (value)))) {
                return this.modifyDataRemoveFromArrayAndGetResultAsync5(field, value);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        PathImpl.prototype.addDebugMessage = function (level, message) {
            // dispatching to 'overload':
            if ((level instanceof AMessageLevel && ('string' == typeof (message)))) {
                this.addDebugMessage1(level, message);
            }
            else if ((level instanceof AMessageLevel && message instanceof Object)) {
                this.addDebugMessage2(level, message);
            }
            else {
                throw new RangeError('Bad combination of parameter types');
            }
        };
        return PathImpl;
    })();
    Infinicast.PathImpl = PathImpl;
    var InfinicastClient = (function (_super) {
        __extends(InfinicastClient, _super);
        function InfinicastClient() {
            _super.call(this, "");
            this._role = "";
            this._space = "";
            this._credentials = null;
            this._ClientLogger = LoggerFactory.getLogger(typeof (InfinicastClient));
            this._ClientLogger.info(("Infinicast Client " + VersionHelper.clientVersion));
        }
        InfinicastClient.prototype.setCredentials = function (credentials) {
            this._credentials = credentials;
        };
        InfinicastClient.prototype.connectWithCredentials = function (address, space, conntectRole, credentials, onConnect_) {
            this.init();
            try {
                this._onConnect = onConnect_;
                var connector = this;
                var e2SNetLayer = new TcpEndpoint2ServerNetLayer();
                var netSettings = new Endpoint2ServerNetSettings();
                netSettings.ServerAddress = NetFactory.createServerAddress(address);
                connector.setSpace(space);
                connector.setRole(conntectRole);
                connector.setCredentials(credentials);
                netSettings.Handler = this.messageManager;
                this._endpoint2ServerNetLayer = e2SNetLayer;
                this.messageManager.setSender(new MessageSender(e2SNetLayer));
                this.messageManager.setConnector(this);
                var result = e2SNetLayer.Open(netSettings);
                if (!(String.isNullOrEmpty(result))) {
                    onConnect_(ErrorInfo.fromMessage(result, ""));
                }
            }
            catch (e) {
                this._onConnect(ErrorInfo.fromMessage(((e.message + "\r\n") + e.stack), ""));
            }
        };
        /**
         * Connects to Infinicast cloud to a given @see {@link space} via the specified @see {@link conntectRole} and the provided @see {@link credentials}
         * @param address Adress of Infinicast Cloud. This specifies if you want to use the staging or live cloud. E.g. service.aplaypowered.com:7771
         * @param space Your Space name. A space is similar to a database name in usual databases.
         * @param conntectRole The connection Role this client should be connected to. Article:ConnectRole
         * @param credentials Json credentials that can be passed to the authorisation service you defined
         * @return Promise that will complete as soon as the connection has been established or throw an  if not.
        */
        InfinicastClient.prototype.connectWithCredentialsAsync = function (address, space, conntectRole, credentials) {
            var tcs = new Promise();
            this.connectWithCredentials(address, space, conntectRole, credentials, function (errorInfo) {
                if ((errorInfo != null)) {
                    tcs.reject(new AfinityException(errorInfo));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        InfinicastClient.prototype.connect = function (address, space, conntectRole, onConnect_) {
            this.connectWithCredentials(address, space, conntectRole, null, onConnect_);
        };
        /**
         * Connects to Infinicast cloud to a given @see {@link space} via the specified @see {@link conntectRole}
         * @param address Adress of Infinicast Cloud. This specifies if you want to use the staging or live cloud. E.g. service.aplaypowered.com:7771
         * @param space Your Space name. A space is similar to a database name in usual databases.
         * @param conntectRole The connection Role this client should be connected to. Article:ConnectRole
         * @return Promise that will complete as soon as the connection has been established or throw an  if not.
        */
        InfinicastClient.prototype.connectAsync = function (address, space, conntectRole) {
            return this.connectWithCredentialsAsync(address, space, conntectRole, null);
        };
        /**
         * Registers a @see {@link handler} to be informed when the Client has been disconnected.
         * @param handler Handler to be informed when the Client has been disconnected.
        */
        InfinicastClient.prototype.onDisconnect = function (handler) {
            this._onDisconnect = handler;
        };
        /**
         * Registers a @see {@link handler} to be informed when the Client has been disconnected.
         * @param handler Handler to be informed when the Client has been disconnected.
         * @return a promise that completes after the handler has been registered
        */
        InfinicastClient.prototype.onDisconnectAsync = function (handler) {
            var tcs = new Promise();
            this.onDisconnect(handler);
            tcs.resolve(null);
            return tcs.getData();
        };
        /**
         * Disconnects the client from the cloud.
        */
        InfinicastClient.prototype.disconnect = function () {
            if ((this._endpoint2ServerNetLayer != null)) {
                this._endpoint2ServerNetLayer.Close();
            }
        };
        /**
         * Disconnects the client from the cloud.
         * @return a promise that completes after the disconnect has been successfull
        */
        InfinicastClient.prototype.disconnectAsync = function () {
            var tcs = new Promise();
            this.disconnect();
            tcs.resolve(null);
            return tcs.getData();
        };
        /**
         * get a reference to your own @see {@link Infinicast.Client.Api.IEndpoint}
         * @return an  that represents this clients Endpoint({@link http://infinicast.io/docs/Endpoint)}
        */
        InfinicastClient.prototype.getOwnEndpoint = function () {
            return this._thisEndpoint;
        };
        /**
         * get a reference to an @see {@link Infinicast.Client.Api.IEndpoint} by its @see {@link endpointId}
         * @param endpointId The Id the Endpoint is represented by see {@link http://infinicast.io/docs/EndpointId}
         * @return an  that represents the Endpoint({@link http://infinicast.io/docs/Endpoint)}
        */
        InfinicastClient.prototype.getEndpointById = function (endpointId) {
            var path = PathUtils.getEndpointPath(endpointId);
            var endpointObject = new Endpoint(path, endpointId, this);
            return endpointObject;
        };
        /**
         * get a reference to an @see {@link Infinicast.Client.Api.IEndpoint} by its @see {@link endpointPath}
         * @param endpointPath The PathImpl the Endpoint is represented by see {@link http://infinicast.io/docs/EndpointPath}
         * @return an  that represents the Endpoint({@link http://infinicast.io/docs/Endpoint)}
        */
        InfinicastClient.prototype.getEndpointByPath = function (endpointPath) {
            var path = endpointPath.toString();
            if (!(path.startsWith("/~endpoints/"))) {
                throw new Exception("not a valid Endpoint path!");
            }
            var endpointId = path.substr(12);
            endpointId = endpointId.remove(endpointId.lastIndexOf("/"));
            var endpointObject = new Endpoint(path, endpointId, this);
            return endpointObject;
        };
        /**
         * get a reference to an @see {@link Infinicast.Client.Api.IEndpoint} by its @see {@link endpointPath}
         * @param endpointPath The PathImpl the Endpoint is represented by see {@link http://infinicast.io/docs/EndpointPath}
         * @return an  that represents the Endpoint({@link http://infinicast.io/docs/Endpoint)}
        */
        InfinicastClient.prototype.getEndpointByPathString = function (endpointPath) {
            var path = endpointPath;
            if (!(endpointPath.startsWith("/~endpoints/"))) {
                throw new Exception("not a valid Endpoint path!");
            }
            var endpointId = endpointPath.substr(12);
            endpointId = endpointId.remove(endpointId.lastIndexOf("/"));
            var endpointObject = new Endpoint(path, endpointId, this);
            return endpointObject;
        };
        /**
         * Returns Infinicast PathImpl for Endpoints see {@link http://infinicast.io/docs/EndpointPath}
         * @return The Infinicast PathImpl for Endpoints see {@link http://infinicast.io/docs/EndpointPath}
        */
        InfinicastClient.prototype.getEndpointListPath = function () {
            return _super.prototype.path.call(this, "/~endpoints/");
        };
        InfinicastClient.prototype.systemCommand = function (path, data, result) {
            this.messageManager.sendMessageWithResponseString(Connector2EpsMessageType.SystemCommand, path, data, function (json, context) {
                result(json);
            });
        };
        InfinicastClient.prototype.systemCommandWithHandler = function (path, data, onEvent, registrationCompleteHandler) {
            if (data["type"]) {
                var type = data["type"];
                if ((!(String.isNullOrEmpty(type)) && (type == "registerMsgDebugger"))) {
                    if ((onEvent == null)) {
                        data["remove"] = true;
                        this.messageManager.registerHandler(Connector2EpsMessageType.DebugObserverMessage, _super.prototype.path.call(this, PathUtils.infinicastInternStart), null);
                    }
                    else {
                        this.messageManager.registerHandler(Connector2EpsMessageType.DebugObserverMessage, _super.prototype.path.call(this, PathUtils.infinicastInternStart), function (json, context, id) {
                            onEvent(json);
                        });
                    }
                    this.messageManager.sendMessageWithResponseString(Connector2EpsMessageType.SystemCommand, path, data, function (json, context) {
                        if (((json == null) || json["error"])) {
                            registrationCompleteHandler(ErrorInfo.fromMessage(json["error"], ""));
                        }
                        else {
                            registrationCompleteHandler(null);
                        }
                    });
                }
            }
        };
        InfinicastClient.prototype.pathRoleSetup = function (path, role, pathSettings, onComplete) {
            var _this = this;
            if (onComplete === void 0) { onComplete = null; }
            if (!(String.isNullOrEmpty(path))) {
                path = PathUtils.cleanup(path);
            }
            var message = new Object();
            if ((pathSettings != null)) {
                message["data"] = pathSettings.toJson();
            }
            message["role"] = role;
            this.messageManager.sendMessageWithResponseString(Connector2EpsMessageType.PathRoleSetup, path, message, function (json, context) {
                ErrorHandlingHelper.checkIfHasErrorsAndCallHandlersFull(_super.prototype.getConnector.call(_this), json, onComplete, context.path);
            });
        };
        InfinicastClient.prototype.pathRoleSetupAsync = function (path, role, pathSettings) {
            var tcs = new Promise();
            this.pathRoleSetup(path, role, pathSettings, function (info) {
                if ((info != null)) {
                    tcs.reject(new AfinityException(info));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        InfinicastClient.prototype.introduceObjectToEndpoint = function (address, objekt) {
            var data = new Object();
            data["target"] = address;
            this.messageManager.sendMessage(Connector2EpsMessageType.IntroduceObject, objekt, data);
        };
        InfinicastClient.prototype.introduceObjectToEndpointAsync = function (address, objekt) {
            var tcs = new Promise();
            this.introduceObjectToEndpoint(address, objekt);
            tcs.resolve(null);
            return tcs.getData();
        };
        InfinicastClient.prototype.updateDebugStatistics = function (filters, handler) {
            this.messageManager.sendUpdateDebugStatistics(filters, handler);
        };
        InfinicastClient.prototype.updateDebugStatisticsAsync = function (filters) {
            var tcs = new Promise();
            this.updateDebugStatistics(filters, function (json) {
                tcs.resolve(json);
            });
            return tcs.getData();
        };
        /**
         * allows to set the @see {@link logLevel} of internal infinicast log functions
         * @param logLevel
        */
        InfinicastClient.prototype.setLogLevel = function (logLevel) {
            LoggerSettings.CurrentLogLevel = logLevel;
        };
        InfinicastClient.prototype.getRole = function () {
            return this._role;
        };
        InfinicastClient.prototype.getSpace = function () {
            return this._space;
        };
        InfinicastClient.prototype.triggerDisconnect = function () {
            this._ClientLogger.info("disconnected");
            //console.log("Disconnect triggered");
            if ((this._onDisconnect != null)) {
                this._onDisconnect();
            }
        };
        InfinicastClient.prototype.unhandeledError = function (iaPath, errorJson) {
            var text = "";
            if ((errorJson != null)) {
                text = JSON.stringify(errorJson);
            }
            if ((this._unhandeledErrorHandler != null)) {
                this._unhandeledErrorHandler(iaPath, text);
                return;
            }
            if ((iaPath != null)) {
                text = (" path: " + iaPath.toString());
            }
            this._ClientLogger.error(("an Unhandeled Error occured: " + text));
        };
        InfinicastClient.prototype.unhandeledErrorInfo = function (iaPath, errorJson) {
            if ((this._unhandeledErrorHandler != null)) {
                this._unhandeledErrorHandler(iaPath, errorJson.message);
                return;
            }
            var text = errorJson.message;
            if ((iaPath != null)) {
                text = (" path: " + iaPath.toString());
            }
            this._ClientLogger.error(("an Unhandeled Error occured: " + text));
        };
        InfinicastClient.prototype.getCredentials = function () {
            return this._credentials;
        };
        InfinicastClient.prototype.onInitConnector = function (data, endPoint) {
            if (((data != null) && (data["error"] != null))) {
                this._onConnect(ErrorInfo.fromJson(data["error"], ""));
            }
            else {
                this._thisEndpoint = new Endpoint(endPoint["path"], endPoint["endpoint"], this);
                this._onConnect(null);
            }
        };
        InfinicastClient.prototype.getObjectStateManager = function () {
            return this._objectStateManager;
        };
        InfinicastClient.prototype.getRootPath = function () {
            return this;
        };
        InfinicastClient.prototype.init = function () {
            if ((this._objectStateManager == null)) {
                this.messageManager = new ConnectorMessageManager();
                this._objectStateManager = new ObjectStateManager(this);
                _super.prototype.setConnector.call(this, this);
            }
        };
        /**
         * registers a listener that will be called when infinicast catches errors that should have been caught by the app.
         * @param errorHandler
        */
        InfinicastClient.prototype.onUnhandeledError = function (errorHandler) {
            this._unhandeledErrorHandler = errorHandler;
        };
        /**
         * registers a listener that will be triggered as soon as an endpoint of the givven @see {@link role} is disconnected
         * @param role
         * @param callback
         * @param registrationCompleteCallback
        */
        InfinicastClient.prototype.onOtherEndpointDisconnected = function (role, callback, registrationCompleteCallback) {
            if (registrationCompleteCallback === void 0) { registrationCompleteCallback = null; }
            this.messageManager.addHandler(false, Connector2EpsMessageType.EndpointDisconnected, _super.prototype.path.call(this, PathUtils.endpointDisconnectedByRolePath(role)), function (json, context, id) {
                var endpointContext = new APEndpointContext();
                endpointContext.endpoint = context.endpoint;
                endpointContext.endpointData = context.endpointData;
                callback(endpointContext);
            }, registrationCompleteCallback, null);
        };
        /**
         * registers a listener that will be triggered as soon as an endpoint of the givven @see {@link role} is disconnected
         * @param role
         * @param callback
         * @return
        */
        InfinicastClient.prototype.onOtherEndpointDisconnectedAsync = function (role, callback) {
            var tsc = new Promise();
            this.onOtherEndpointDisconnected(role, callback, function (error) {
                if ((error != null)) {
                    tsc.reject(new AfinityException(error));
                }
                else {
                    tsc.resolve(null);
                }
            });
            return tsc.getData();
        };
        InfinicastClient.prototype.setRole = function (role) {
            this._role = role;
        };
        InfinicastClient.prototype.setSpace = function (space) {
            this._space = space;
        };
        InfinicastClient.prototype.getEndpointHandler = function () {
            return this.messageManager;
        };
        InfinicastClient.prototype.settings = function () {
            return new StormSettings(this.messageManager);
        };
        InfinicastClient.prototype.getEndpointPath = function (address) {
            return _super.prototype.path.call(this, (("/~endpoints/" + address) + "/"));
        };
        return InfinicastClient;
    })(PathImpl);
    Infinicast.InfinicastClient = InfinicastClient;
    /**
     * An endpoint is a connected client in the infinicast cloud.
     * via this interface services can modify roles of the endpoints, disconnect them or simply get the id of an endpoint.
    */
    var Endpoint = (function (_super) {
        __extends(Endpoint, _super);
        function Endpoint(path, targetAddress, root) {
            _super.call(this, path);
            _super.prototype.setRoot.call(this, root);
            this.endpointId = targetAddress;
        }
        Object.defineProperty(Endpoint.prototype, "endpointId", {
            /**
             * endpoint Id of this endpoint
            */
            get: function () {
                return this._endpointId;
            },
            /**
             * endpoint Id of this endpoint
            */
            set: function (value) {
                this._endpointId = value;
            },
            enumerable: true,
            configurable: true
        });
        Endpoint.prototype.introduce = function (objekt, infoJson) {
            if (infoJson === void 0) { infoJson = null; }
            var data = new Object();
            data["target"] = this.endpointId;
            this.messageManager.sendMessage(Connector2EpsMessageType.IntroduceObject, objekt, data);
        };
        /**
         * adds a role to the given @see {@link path}.
         * multiple roles cann be passed by a comma seperated list in the @see {@link role} parameter.
         * note: path wildcards are valid paths for roles
         * @param path
         * @param role
         * @param onComplete
        */
        Endpoint.prototype.addRole = function (path, role, onComplete) {
            if (onComplete === void 0) { onComplete = null; }
            this.addRoleToStringPath(path.toString(), role, onComplete);
        };
        /**
         * adds a role to the given @see {@link pathString}.
         * multiple roles cann be passed by a comma seperated list in the @see {@link role} parameter
         * note: path wildcards are valid paths for roles
         * @param pathString
         * @param role
         * @param onComplete
        */
        Endpoint.prototype.addRoleToStringPath = function (pathString, role, onComplete) {
            if (onComplete === void 0) { onComplete = null; }
            this.sendModifyRole("add", pathString, role, onComplete);
        };
        /**
         * adds a role to the given @see {@link path}.
         * multiple roles cann be passed by a comma seperated list in the @see {@link role} parameter
         * note: path wildcards are valid paths for roles
         * @param path
         * @param role
        */
        Endpoint.prototype.addRoleAsync = function (path, role) {
            var tcs = new Promise();
            this.addRole(path, role, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * adds a role to the given @see {@link pathString}.
         * multiple roles cann be passed by a comma seperated list in the @see {@link role} parameter
         * note: path wildcards are valid paths for roles
         * @param pathString
         * @param role
        */
        Endpoint.prototype.addRoleToStringPathAsync = function (pathString, role) {
            var tcs = new Promise();
            this.addRoleToStringPath(pathString, role, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * removes a role to the given @see {@link path}.
         * multiple roles cann be passed by a comma seperated list in the @see {@link role} parameter
         * note: path wildcards are valid paths for roles
         * note: for removing roles wildcards can be used. for example RemoveRole(...,"*",...)
         * @param path
         * @param role
         * @param onComplete
        */
        Endpoint.prototype.removeRole = function (path, role, onComplete) {
            if (onComplete === void 0) { onComplete = null; }
            this.removeRoleFromStringPath(path.toString(), role, onComplete);
        };
        /**
         * removes a role to the given @see {@link pathString}.
         * multiple roles cann be passed by a comma seperated list in the @see {@link role} parameter
         * note: path wildcards are valid paths for roles
         * note: for removing roles wildcards can be used. for example RemoveRole(...,"*",...)
         * @param pathString
         * @param role
         * @param onComplete
        */
        Endpoint.prototype.removeRoleFromStringPath = function (pathString, role, onComplete) {
            if (onComplete === void 0) { onComplete = null; }
            this.sendModifyRole("remove", pathString, role, onComplete);
        };
        /**
         * removes a role to the given @see {@link path}.
         * multiple roles cann be passed by a comma seperated list in the @see {@link role} parameter
         * note: path wildcards are valid paths for roles
         * note: for removing roles wildcards can be used. for example RemoveRole(...,"*",...)
         * @param path
         * @param role
        */
        Endpoint.prototype.removeRoleAsync = function (path, role) {
            var tcs = new Promise();
            this.removeRole(path, role, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        /**
         * removes a role to the given @see {@link pathString}.
         * multiple roles cann be passed by a comma seperated list in the @see {@link role} parameter
         * note: path wildcards are valid paths for roles
         * note: for removing roles wildcards can be used. for example RemoveRole(...,"*",...)
         * @param pathString
         * @param role
        */
        Endpoint.prototype.removeRoleFromStringPathAsync = function (pathString, role) {
            var tcs = new Promise();
            this.removeRoleFromStringPath(pathString, role, function (error) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(null);
                }
            });
            return tcs.getData();
        };
        Endpoint.prototype.getRoles = function (rolePath, roleListHandler) {
            this.getRolesForStringPath(rolePath.toString(), roleListHandler);
        };
        /**
         * returns a list of the roles the endpoint fullfills for the given @see {@link pathString}
         * @param pathString
         * @param roleListHandler
        */
        Endpoint.prototype.getRolesForStringPath = function (pathString, roleListHandler) {
            var _this = this;
            var message = new Object();
            message["target"] = this.endpointId;
            this.messageManager.sendMessageWithResponseString(Connector2EpsMessageType.GetRoleForPath, pathString, message, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    roleListHandler(error, null);
                }))) {
                    var list = getStringArray(json, "list");
                    roleListHandler(null, list);
                }
            });
        };
        /**
         * returns a list of the roles the endpoint fullfills for the given @see {@link path}
         * @param path
        */
        Endpoint.prototype.getRolesAsync = function (path) {
            return this.getRolesForStringPathAsync(path.toString());
        };
        /**
         * returns a list of the roles the endpoint fullfills for the given @see {@link pathString}
         * @param pathString
        */
        Endpoint.prototype.getRolesForStringPathAsync = function (pathString) {
            var tcs = new Promise();
            this.getRolesForStringPath(pathString, function (error, roles) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(roles);
                }
            });
            return tcs.getData();
        };
        Endpoint.prototype.setDebugName = function (name) {
            var data = new Object();
            data["target"] = this.endpointId;
            data["name"] = name;
            this.messageManager.sendMessageString(Connector2EpsMessageType.SetDebugName, "", data);
        };
        /**
         * returns the endpointconnectinfo of the given endpoint.
         * The IPAdress is an example of the information available.
         * @param result
        */
        Endpoint.prototype.getEndpointConnectionInfo = function (result) {
            var _this = this;
            var message = new Object();
            message["target"] = this.endpointId;
            this.messageManager.sendMessageWithResponseString(Connector2EpsMessageType.GetEndpointConnectionInfo, "", message, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, function (error) {
                    result(error, null);
                }))) {
                    var info = new EndpointConnectionInfo();
                    info.ipAddress = json["ipAddress"];
                    result(null, info);
                }
            });
        };
        /**
         * returns the endpointconnectinfo of the given endpoint.
         * The IPAdress is an example of the information available.
        */
        Endpoint.prototype.getEndpointConnectionInfoAsync = function () {
            var tcs = new Promise();
            this.getEndpointConnectionInfo(function (error, info) {
                if ((error != null)) {
                    tcs.reject(new AfinityException(error));
                }
                else {
                    tcs.resolve(info);
                }
            });
            return tcs.getData();
        };
        Endpoint.prototype.sendModifyRole = function (modifier, pathString, role, onComplete) {
            var _this = this;
            if (onComplete === void 0) { onComplete = null; }
            var data = new Object();
            data["modifier"] = modifier;
            data["role"] = role;
            data["target"] = this.endpointId;
            this.messageManager.sendMessageWithResponseString(Connector2EpsMessageType.ModifyRoleForPath, pathString, data, function (json, context) {
                if (!(_super.prototype.checkIfHasErrorsAndCallHandlersNew.call(_this, json, onComplete))) {
                    if ((onComplete != null)) {
                        onComplete(null);
                    }
                }
            });
        };
        return Endpoint;
    })(PathImpl);
    Infinicast.Endpoint = Endpoint;
    var PathAndData = (function () {
        function PathAndData() {
        }
        Object.defineProperty(PathAndData.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathAndData.prototype, "path", {
            get: function () {
                return this._path;
            },
            set: function (value) {
                this._path = value;
            },
            enumerable: true,
            configurable: true
        });
        return PathAndData;
    })();
    Infinicast.PathAndData = PathAndData;
    var Connector2EpsProtocol = (function () {
        function Connector2EpsProtocol() {
        }
        Connector2EpsProtocol.prototype.encodeInitConnector = function (space, type, credentials) {
            var msg = new Connector2EpsMessage();
            msg.type = (Connector2EpsMessageType.InitConnector);
            msg.role = (type);
            msg.space = space;
            if ((credentials != null)) {
                msg.data = new Object();
                msg.data["credentials"] = credentials;
            }
            msg.version = VersionHelper.clientVersion;
            return msg;
        };
        Connector2EpsProtocol.prototype.encodeRegisterHandlerMessage = function (messageType, path, requestId, consomeOnePerRole, sticky, listeningType, roleFilter, terminationHandler) {
            var msg = new Connector2EpsMessage();
            msg.type = (Connector2EpsMessageType.RegisterHandler);
            msg.requestId = requestId;
            msg.handlerType = (messageType);
            msg.path = (path);
            var settings = null;
            if (((consomeOnePerRole != null) && (consomeOnePerRole == true))) {
                if ((settings == null)) {
                    settings = new Object();
                }
                settings["once"] = true;
                if (((sticky != null) && (sticky == true))) {
                    settings["sticky"] = true;
                }
            }
            if ((listeningType != ListeningType.Any)) {
                if ((settings == null)) {
                    settings = new Object();
                }
                settings["listenerType"] = listeningType.toString();
            }
            if (!(String.isNullOrEmpty(roleFilter))) {
                if ((settings == null)) {
                    settings = new Object();
                }
                settings["role"] = roleFilter;
            }
            if (terminationHandler) {
                if ((settings == null)) {
                    settings = new Object();
                }
                settings["terminationHandler"] = true;
            }
            msg.data = settings;
            return msg;
        };
        Connector2EpsProtocol.prototype.encodeMessage = function (messageType, path, jsonData) {
            var msg = new Connector2EpsMessage();
            msg.type = (messageType);
            if (!(String.isNullOrEmpty(path))) {
                msg.path = (path);
            }
            msg.data = (jsonData);
            return msg;
        };
        Connector2EpsProtocol.prototype.encodeValidatedMessage = function (messageType, path, jsonData, originalEndpoint) {
            var msg = new Connector2EpsMessage();
            msg.type = messageType;
            if (!(String.isNullOrEmpty(path))) {
                msg.path = (path);
            }
            msg.data = (jsonData);
            msg.originalEndpoint = (originalEndpoint);
            return msg;
        };
        Connector2EpsProtocol.prototype.encodeMessageWithRequestId = function (messageType, path, jsonData, answerTarget, requestId) {
            var msg = new Connector2EpsMessage();
            msg.type = (messageType);
            if (!(String.isNullOrEmpty(path))) {
                msg.path = (path);
            }
            msg.data = (jsonData);
            msg.requestId = (requestId);
            msg.answerTarget = (answerTarget);
            return msg;
        };
        Connector2EpsProtocol.prototype.encodeRemoveHandlerMessage = function (path, handlerType, messageRequestId, endpoint) {
            var msg = new Connector2EpsMessage();
            msg.type = (Connector2EpsMessageType.RemoveHandlers);
            msg.path = (path);
            msg.requestId = messageRequestId;
            msg.handlerType = handlerType;
            msg.endpoint = endpoint;
            return msg;
        };
        Connector2EpsProtocol.prototype.encodeMessageWithResponse = function (messageType, path, jsonData, messageRequestId) {
            var msg = new Connector2EpsMessage();
            msg.type = (messageType);
            if (!(String.isNullOrEmpty(path))) {
                msg.path = (path);
            }
            msg.data = (jsonData);
            msg.requestId = (messageRequestId);
            return msg;
        };
        Connector2EpsProtocol.prototype.encodeDebugPingInfo = function (path, pingInMs) {
            var msg = new Connector2EpsMessage();
            msg.type = Connector2EpsMessageType.DebugPingInfo;
            var ob = new Object();
            ob["ping"] = pingInMs;
            msg.path = path;
            msg.data = ob;
            return msg;
        };
        Connector2EpsProtocol.prototype.encodeDebugMesssageInfo = function (path, level, json) {
            var msg = new Connector2EpsMessage();
            msg.type = Connector2EpsMessageType.DebugInfoMessage;
            var ob = new Object();
            ob["level"] = level;
            ob["info"] = json;
            msg.path = path;
            msg.data = ob;
            return msg;
        };
        return Connector2EpsProtocol;
    })();
    Infinicast.Connector2EpsProtocol = Connector2EpsProtocol;
    var Eps2ConnectorProtocol = (function () {
        function Eps2ConnectorProtocol() {
        }
        Eps2ConnectorProtocol.prototype.decodeStringMessage = function (message, handler) {
            var ob = Eps2ConnectorMessage.parseString(message);
            this.handleMessage(handler, ob);
        };
        Eps2ConnectorProtocol.prototype.handleMessage = function (handler, ob) {
            var messageType = ob.type;
            var endpointObject = null;
            if ((ob.endpointObject != null)) {
                endpointObject = ob.endpointObject;
            }
            var data = null;
            if ((ob.data != null)) {
                data = ob.data;
            }
            switch (messageType) {
                case Eps2ConnectorMessageType.InitConnector:
                    {
                        handler.onInitConnector(data, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.IntroduceObject:
                    {
                        handler.onIntroduceObject(data, ob.path, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.Message:
                    {
                        handler.onReceiveMessage(data, ob.path, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.MessageValidate:
                    {
                        handler.onReceiveMessageValidate(data, ob.path, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.DataChangeValidate:
                    {
                        handler.onReceiveDataChangeValidate(data, ob.path, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.Request:
                    {
                        handler.onReceiveRequest(data, ob.path, ob.requestId, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.RequestResponse:
                    {
                        handler.onReceiveRequestResponse(data, ob.requestId, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.JsonQueryResult:
                    {
                        handler.onReceiveJsonQueryResult(ob.list, ob.fullCount, ob.requestId);
                        break;
                    }
                case Eps2ConnectorMessageType.CreateChildSuccess:
                    {
                        handler.onCreateChildSuccess(data, ob.path, ob.requestId);
                        break;
                    }
                case Eps2ConnectorMessageType.SetObjectData:
                    {
                        handler.onSetObjectData(data, ob.path, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.ListAdd:
                    {
                        handler.onListAdd(data, PathUtils.getParentPath(ob.path), ob.path, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.ListRemove:
                    {
                        handler.onListRemove(data, PathUtils.getParentPath(ob.path), ob.path, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.ListChange:
                    {
                        handler.onListChange(data, PathUtils.getParentPath(ob.path), ob.path, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.GetOrCreate:
                    {
                        handler.onGetOrCreate(data, ob.path, ob.requestId, ob.newlyCreated);
                        break;
                    }
                case Eps2ConnectorMessageType.PathRoleSetup:
                    {
                        handler.onPathRoleSetup(data, ob.requestId);
                        break;
                    }
                case Eps2ConnectorMessageType.CreateOrUpdateRole:
                    {
                        // this should be ob?
                        handler.onCreateOrUpdateRole(data, ob.requestId);
                        break;
                    }
                case Eps2ConnectorMessageType.DestroyRole:
                    {
                        // this should be ob?
                        handler.onDestroyRole(data, ob.requestId);
                        break;
                    }
                case Eps2ConnectorMessageType.GetRoleForPathResult:
                    {
                        // this should be ob?
                        handler.onGetRoleForPathResult(ob.list, data, ob.requestId);
                        break;
                    }
                case Eps2ConnectorMessageType.ListeningStarted:
                    {
                        handler.onListeningStarted(ob.path, endpointObject, ob.data);
                        break;
                    }
                case Eps2ConnectorMessageType.ListeningEnded:
                    {
                        handler.onListeningEnded(ob.path, endpointObject, ob.disconnected, ob.data);
                        break;
                    }
                case Eps2ConnectorMessageType.EndpointDisconnected:
                    {
                        handler.onEndpointDisconnected(ob.path, endpointObject);
                        break;
                    }
                case Eps2ConnectorMessageType.ListenTerminate:
                    {
                        handler.onListenTerminate(ob.data);
                        break;
                    }
                case Eps2ConnectorMessageType.DebugObserverMessage:
                    {
                        handler.onDebugObserverMessage(ob.path, ob.data);
                        break;
                    }
                case Eps2ConnectorMessageType.ListeningChanged:
                    {
                        handler.onListeningChanged(ob.path, endpointObject, ob.data);
                        break;
                    }
                case Eps2ConnectorMessageType.Reminder:
                    {
                        handler.onReminderTriggered(ob.path, ob.data);
                        break;
                    }
                case Eps2ConnectorMessageType.DebugStatistics:
                    {
                        handler.onDebugStatistics(ob.data, ob.requestId);
                        break;
                    }
                default:
                    throw new NotImplementedException(("not yet implemented messageType " + messageType));
            }
        };
        return Eps2ConnectorProtocol;
    })();
    Infinicast.Eps2ConnectorProtocol = Eps2ConnectorProtocol;
    var BaseMessage = (function () {
        function BaseMessage() {
        }
        Object.defineProperty(BaseMessage.prototype, "role", {
            get: function () {
                return this._role;
            },
            set: function (value) {
                this._role = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMessage.prototype, "path", {
            get: function () {
                return this._path;
            },
            set: function (value) {
                this._path = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMessage.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMessage.prototype, "originalEndpoint", {
            get: function () {
                return this._originalEndpoint;
            },
            set: function (value) {
                this._originalEndpoint = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMessage.prototype, "requestId", {
            get: function () {
                return this._requestId;
            },
            set: function (value) {
                this._requestId = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMessage.prototype, "answerTarget", {
            get: function () {
                return this._answerTarget;
            },
            set: function (value) {
                this._answerTarget = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMessage.prototype, "endpoint", {
            get: function () {
                return this._endpoint;
            },
            set: function (value) {
                this._endpoint = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseMessage.prototype._setDataByMessage = function (data) {
            if ((data["role"] != null)) {
                this.role = data["role"];
            }
            if ((data["path"] != null)) {
                this.path = data["path"];
            }
            if ((data["data"] != null)) {
                this.data = data["data"];
            }
            if ((data["originalEndpoint"] != null)) {
                this.originalEndpoint = data["originalEndpoint"];
            }
            if ((data["requestId"] != null)) {
                this.requestId = data["requestId"];
            }
            else {
                this.requestId = null;
            }
            if ((data["answerTarget"] != null)) {
                this.answerTarget = data["answerTarget"];
            }
            if ((data["endpoint"] != null)) {
                this.endpoint = data["endpoint"];
            }
        };
        BaseMessage.prototype._setDataByClone = function (original) {
            this.role = original.role;
            this.path = (original.path);
            this.data = (original.data);
            this.originalEndpoint = (original.originalEndpoint);
            this.requestId = (original.requestId);
            this.answerTarget = (original.answerTarget);
            this.endpoint = (original.endpoint);
        };
        BaseMessage.prototype._fillJson = function (result) {
            if (!(String.isNullOrEmpty(this.role))) {
                result["role"] = this.role;
            }
            if (!(String.isNullOrEmpty(this.path))) {
                result["path"] = this.path;
            }
            if ((this.data != null)) {
                result["data"] = this.data;
            }
            if (!(String.isNullOrEmpty(this.originalEndpoint))) {
                result["originalEndpoint"] = this.originalEndpoint;
            }
            if ((this.requestId != null)) {
                result["requestId"] = this.requestId;
            }
            if (!(String.isNullOrEmpty(this.answerTarget))) {
                result["answerTarget"] = this.answerTarget;
            }
            if (!(String.isNullOrEmpty(this.endpoint))) {
                result["endpoint"] = this.endpoint;
            }
        };
        return BaseMessage;
    })();
    Infinicast.BaseMessage = BaseMessage;
    var Connector2EpsMessage = (function (_super) {
        __extends(Connector2EpsMessage, _super);
        function Connector2EpsMessage() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(Connector2EpsMessage.prototype, "space", {
            get: function () {
                return this._space;
            },
            set: function (value) {
                this._space = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Connector2EpsMessage.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Connector2EpsMessage.prototype, "handlerType", {
            get: function () {
                return this._handlerType;
            },
            set: function (value) {
                this._handlerType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Connector2EpsMessage.prototype, "version", {
            get: function () {
                return this._version;
            },
            set: function (value) {
                this._version = value;
            },
            enumerable: true,
            configurable: true
        });
        Connector2EpsMessage.parseString = function (stringMessage) {
            var data = JSON.parse(stringMessage.DataAsString);
            return Connector2EpsMessage.parseInternal(data);
        };
        Connector2EpsMessage.parseInternal = function (data) {
            var msg = new Connector2EpsMessage();
            msg._setDataByMessage(data);
            msg.type = Connector2EpsMessageType[data["type"]];
            if ((data["handlerType"] != null)) {
                msg.handlerType = Connector2EpsMessageType[data["handlerType"]];
            }
            return msg;
        };
        Connector2EpsMessage.prototype.buildStringMessage = function () {
            var result = new Object();
            if (!(String.isNullOrEmpty(this.space))) {
                result["space"] = this.space.toString();
            }
            result["type"] = this.type.toString();
            if ((this.handlerType != null)) {
                result["handlerType"] = this.handlerType.toString();
            }
            if (!(String.isNullOrEmpty(this.version))) {
                if ((this.data == null)) {
                    this.data = new Object();
                }
                this.data["version"] = this.version;
            }
            _super.prototype._fillJson.call(this, result);
            var msg = new APlayStringMessage();
            msg.DataAsString = JSON.stringify(result);
            return msg;
        };
        Connector2EpsMessage.clone = function (original) {
            var newMsg = new Connector2EpsMessage();
            newMsg._setDataByClone(original);
            newMsg.type = original.type;
            newMsg.handlerType = original.handlerType;
            return newMsg;
        };
        Connector2EpsMessage.parseInner = function (data) {
            return Connector2EpsMessage.parseInternal(data);
        };
        return Connector2EpsMessage;
    })(BaseMessage);
    Infinicast.Connector2EpsMessage = Connector2EpsMessage;
    var Eps2ConnectorMessage = (function (_super) {
        __extends(Eps2ConnectorMessage, _super);
        function Eps2ConnectorMessage() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(Eps2ConnectorMessage.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Eps2ConnectorMessage.prototype, "endpointObject", {
            get: function () {
                return this._endpointObject;
            },
            set: function (value) {
                this._endpointObject = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Eps2ConnectorMessage.prototype, "fullCount", {
            get: function () {
                return this._fullCount;
            },
            set: function (value) {
                this._fullCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Eps2ConnectorMessage.prototype, "newlyCreated", {
            get: function () {
                return this._newlyCreated;
            },
            set: function (value) {
                this._newlyCreated = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Eps2ConnectorMessage.prototype, "errorCode", {
            get: function () {
                return this._errorCode;
            },
            set: function (value) {
                this._errorCode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Eps2ConnectorMessage.prototype, "errorData", {
            get: function () {
                return this._errorData;
            },
            set: function (value) {
                this._errorData = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Eps2ConnectorMessage.prototype, "disconnected", {
            get: function () {
                return this._disconnected;
            },
            set: function (value) {
                this._disconnected = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Eps2ConnectorMessage.prototype, "list", {
            get: function () {
                return this._list;
            },
            set: function (value) {
                this._list = value;
            },
            enumerable: true,
            configurable: true
        });
        Eps2ConnectorMessage.parseString = function (message) {
            var data = JSON.parse(message.DataAsString);
            return Eps2ConnectorMessage.parseFromJson(data);
        };
        Eps2ConnectorMessage.parseFromJson = function (data) {
            var result = new Eps2ConnectorMessage();
            result._setDataByMessage(data);
            result.type = Eps2ConnectorMessageType[data["type"]];
            if ((data["endpointObject"] != null)) {
                result.endpointObject = data["endpointObject"];
            }
            if ((data["fullCount"] != null)) {
                result.fullCount = data["fullCount"];
            }
            if ((data["newlyCreated"] != null)) {
                result.newlyCreated = data["newlyCreated"];
            }
            if ((data["errorCode"] != null)) {
                result.errorCode = data["errorCode"];
            }
            if ((data["errorData"] != null)) {
                result.errorData = data["errorData"];
            }
            if ((data["disconnected"] != null)) {
                result.disconnected = data["disconnected"];
            }
            if ((data["list"] != null)) {
                result.list = data["list"];
            }
            return result;
        };
        Eps2ConnectorMessage.prototype.buildStringMessage = function () {
            var result = new Object();
            _super.prototype._fillJson.call(this, result);
            result["type"] = this.type.toString();
            if ((this.endpointObject != null)) {
                result["Endpoint"] = this.endpointObject;
            }
            if ((this.fullCount != null)) {
                result["fullCount"] = this.fullCount;
            }
            if ((this.newlyCreated != null)) {
                result["newlyCreated"] = this.newlyCreated;
            }
            if ((this.errorCode != null)) {
                result["errorCode"] = this.errorCode;
            }
            if ((this.errorData != null)) {
                result["errorData"] = this.errorData;
            }
            if ((this.disconnected != null)) {
                result["disconnected"] = this.disconnected;
            }
            if ((this.list != null)) {
                result["list"] = this.list;
            }
            var msg = new APlayStringMessage();
            msg.DataAsString = JSON.stringify(result);
            return msg;
        };
        Eps2ConnectorMessage.mapFromConnectorMessage = function (msg) {
            return Eps2ConnectorMessage.parseString(msg.buildStringMessage());
        };
        Eps2ConnectorMessage.parseInner = function (data) {
            return Eps2ConnectorMessage.parseFromJson(data);
        };
        return Eps2ConnectorMessage;
    })(BaseMessage);
    Infinicast.Eps2ConnectorMessage = Eps2ConnectorMessage;
    var NetFactory = (function () {
        function NetFactory() {
        }
        NetFactory.createMessage = function () {
            return new APlayStringMessage();
        };
        NetFactory.createServerAddress = function (address) {
            var result = new ServerAddress();
            result.Address = address;
            return result;
        };
        return NetFactory;
    })();
    Infinicast.NetFactory = NetFactory;
    var PathUtils = (function () {
        function PathUtils() {
        }
        PathUtils.cleanup = function (path) {
            while (path.contains("//")) {
                path = path.replace("//", "/");
            }
            if (!(path.startsWith("/"))) {
                path = ("/" + path);
            }
            if ((!(path.endsWith("/")) && !(path.endsWith("*")))) {
                path = (path + "/");
            }
            return path;
        };
        PathUtils.getObjectListPath = function (path) {
            path = PathUtils.cleanup(path);
            return PathUtils.getParentPath(path);
        };
        PathUtils.createWildcardSubElement = function (str, splitted, index, results) {
            if ((index == splitted.length)) {
                results.push((str + "/"));
            }
            else {
                PathUtils.createWildcardSubElement(((str + "/") + splitted[index]), splitted, (index + 1), results);
                PathUtils.createWildcardSubElement((str + "/*"), splitted, (index + 1), results);
            }
        };
        PathUtils.getWildCardedPaths = function (path) {
            var list = new Array();
            if (String.isNullOrEmpty(path)) {
                list.push("");
                return list;
            }
            path = PathUtils.cleanup(path);
            // for c# splitted returns also the last element as empty. This is a difference between java and c# - MAX: how about the overload with StringSplitOptions?
            path = path.butLast();
            var splitted = path.splitAsPath();
            PathUtils.createWildcardSubElement("", splitted, 1, list);
            return list;
        };
        PathUtils.combine = function (path1, path2) {
            return PathUtils.cleanup(((path1 + "/") + path2));
        };
        PathUtils.combineId = function (path, id) {
            return PathUtils.combine(path, id);
        };
        PathUtils.getParentPath = function (path) {
            path = PathUtils.cleanup(path);
            // all paths will end with / !
            path = path.butLast();
            if (path.contains("/")) {
                path = path.substr(0, (path.lastIndexOf("/") + 1));
                return path;
            }
            return "";
        };
        PathUtils.getLastPathPart = function (key) {
            var str = PathUtils.cleanup(key);
            if (str.endsWith("/")) {
                str = str.substr(0, (str.length - 1));
            }
            if ((str.lastIndexOf("/") != -1)) {
                str = str.substr((str.lastIndexOf("/") + 1));
            }
            return str;
        };
        PathUtils.getEndpointPath = function (endpointId) {
            return (("/~endpoints/" + endpointId) + "/");
        };
        PathUtils.endpointDisconnectedByRolePath = function (role) {
            return PathUtils.infinicastIntern(("roleDc/" + role));
        };
        PathUtils.infinicastIntern = function (s) {
            return (("/~IC/" + s) + "/");
        };
        PathUtils.escape = function (str) {
            return str;
        };
        PathUtils.getPathAddressElement = function (path, idx) {
            if (String.isNullOrEmpty(path)) {
                return "";
            }
            path = PathUtils.cleanup(path);
            return StringUtils.GetStringPathEleByIdx(path, idx);
        };
        PathUtils.infinicastInternStart = "/~IC/";
        return PathUtils;
    })();
    Infinicast.PathUtils = PathUtils;
})(Infinicast || (Infinicast = {}));
