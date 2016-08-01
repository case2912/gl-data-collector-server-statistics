"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.update = exports.sendData = exports.scanAll = exports.query = exports.createTables = undefined;

require("babel-polyfill");

var _vogels = require("vogels");

var _vogels2 = _interopRequireDefault(_vogels);

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _statistics = require("./statistics");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

_vogels2.default.AWS.config.loadFromPath("credentials.json");
var table = _vogels2.default.define("webgl_result", {
    hashKey: "name",
    timestamps: true,
    schema: {
        name: _joi2.default.string(),
        platform_name: _joi2.default.string(),
        platform_version: _joi2.default.string(),
        browser_name: _joi2.default.string(),
        browser_version: _joi2.default.string(),
        max: _joi2.default.array(),
        min: _joi2.default.array(),
        count: _joi2.default.array(),
        index: _joi2.default.array()
    }
});
var statistics = _vogels2.default.define("webgl_statistic", {
    hashKey: "id",
    timestamps: true,
    schema: {
        id: _joi2.default.string(),
        extensions: _joi2.default.object(),
        parameters: _joi2.default.object(),
        platform_name: _joi2.default.string(),
        platform_version: _joi2.default.string(),
        browser_name: _joi2.default.string(),
        browser_version: _joi2.default.string(),
        domain: _joi2.default.string()
    }
});
var createTables = exports.createTables = function createTables() {
    return new Promise(function (resolve, reject) {
        _vogels2.default.createTables(function (err) {
            if (err) {
                reject("Initializing DynamoDB tables was failed", err);
            } else {
                console.log("DynamoDB tables was initialized without any error");
                resolve();
            }
        });
    });
};
var query = exports.query = function query(key) {
    return new Promise(function (resolve, reject) {
        table.query(key).exec(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Items.map(function (data) {
                    return data.attrs;
                })[0]);
            }
        });
    });
};
var scanAll = exports.scanAll = function scanAll() {
    return new Promise(function (resolve, reject) {
        statistics.scan().loadAll().exec(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Items);
            }
        });
    });
};
var create = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(element) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt("return", new Promise(function (resolve, reject) {
                            table.create(element, function (err) {
                                err ? reject(err) : resolve();
                            });
                        }));

                    case 1:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function create(_x) {
        return _ref.apply(this, arguments);
    };
}();
var sendData = exports.sendData = function sendData() {
    return new Promise(function (resolve, reject) {
        table.scan().loadAll().exec(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Items.map(function (data) {
                    return data.attrs;
                }));
            }
        });
    });
};
var list = function list(item, name) {
    return new Promise(function (resolve, reject) {
        resolve(_lodash2.default.uniq(item.map(function (data) {
            return data.attrs[name];
        })));
    });
};
var update = exports.update = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var result, browser_name, domain;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return scanAll();

                    case 2:
                        result = _context2.sent;

                        console.log(result);
                        _context2.next = 6;
                        return list(result, "browser_name");

                    case 6:
                        browser_name = _context2.sent;
                        _context2.next = 9;
                        return list(result, "domain");

                    case 9:
                        domain = _context2.sent;

                        create({ name: "browser_name", index: domain });
                        create({ name: "domain", index: domain });
                        _context2.next = 14;
                        return (0, _statistics.max)(result);

                    case 14:
                        _context2.t0 = _context2.sent;
                        _context2.next = 17;
                        return (0, _statistics.min)(result);

                    case 17:
                        _context2.t1 = _context2.sent;
                        _context2.next = 20;
                        return (0, _statistics.count)(result);

                    case 20:
                        _context2.t2 = _context2.sent;
                        _context2.t3 = {
                            name: "all",
                            max: _context2.t0,
                            min: _context2.t1,
                            count: _context2.t2
                        };
                        create(_context2.t3);

                        browser_name.map(function (name) {});

                    case 24:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function update() {
        return _ref2.apply(this, arguments);
    };
}();