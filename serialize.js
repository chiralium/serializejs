"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serialize = exports.SerializeModel = void 0;
var SerializeModel = /** @class */ (function () {
    function SerializeModel() {
    }
    return SerializeModel;
}());
exports.SerializeModel = SerializeModel;
var Serialize = /** @class */ (function () {
    function Serialize(_a) {
        var data = _a.data, root = _a.root, instanceConstructor = _a.instanceConstructor;
        var _this = this;
        this.replaceKeys = function (data) {
            if (!_this.replacingMap) {
                return data;
            }
            return Object.keys(data)
                .reduce(function (acc, key) {
                var _a, _b;
                var newKey = _this.replacingMap[key];
                var newPair = newKey ? (_a = {},
                    _a[newKey] = data[key],
                    _a) : (_b = {}, _b[key] = data[key], _b);
                return __assign(__assign({}, acc), newPair);
            }, {});
        };
        this.getRoot = function () {
            if (!_this.root) {
                return {};
            }
            var pathItemList = _this.root.split('->')
                .map(function (pathItem) { return pathItem.trim(); });
            return pathItemList.reduce(function (acc, pathItem) {
                return acc[pathItem];
            }, _this.data);
        };
        this.createModel = function () {
            try {
                _this.data = _this.getRoot();
                if (Array.isArray(_this.data)) {
                    _this.model = _this.data.map(function (dataItem) { return new _this.instanceConstructor(_this.replaceKeys(dataItem)); });
                    return;
                }
                _this.model = new _this.instanceConstructor(_this.replaceKeys(_this.data));
            }
            catch (e) {
                console.error(e);
            }
        };
        this.getModel = function () {
            _this.createModel();
            return _this.model;
        };
        this.data = data;
        this.root = root;
        this.replacingMap = instanceConstructor.replacingMap;
        this.instanceConstructor = instanceConstructor;
    }
    return Serialize;
}());
exports.Serialize = Serialize;
