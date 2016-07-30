"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sendData = undefined;

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
        data_type: _joi2.default.string(),
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
var createTables = function createTables() {
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
var query = function query(key) {
    return new Promise(function (resolve, reject) {
        table.query(key).exec(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};
var scanAll = function scanAll() {
    return new Promise(function (resolve, reject) {
        statistics.scan().loadAll().exec(function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};
var updateDomain = function updateDomain(item) {
    var t = _lodash2.default.uniq(item.map(function (data) {
        return data.attrs.domain;
    }));
    table.create({
        name: "domain",
        index: t
    }, function (err) {
        err && console.log(err);
    });
};
var test = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(item) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.t0 = table;
                        _context.next = 3;
                        return (0, _statistics.max)(item);

                    case 3:
                        _context.t1 = _context.sent;
                        _context.next = 6;
                        return (0, _statistics.min)(item);

                    case 6:
                        _context.t2 = _context.sent;
                        _context.next = 9;
                        return (0, _statistics.count)(item);

                    case 9:
                        _context.t3 = _context.sent;
                        _context.t4 = {
                            name: "all",
                            max: _context.t1,
                            min: _context.t2,
                            count: _context.t3
                        };

                        _context.t5 = function (err) {
                            err && console.log(err);
                        };

                        _context.t0.create.call(_context.t0, _context.t4, _context.t5);

                    case 13:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function test(_x) {
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
scanAll().then(function (result) {
    updateDomain(result.Items);
    test(result.Items);
    (0, _statistics.count)(result.Items);
    (0, _statistics.min)(result.Items);
    (0, _statistics.max)(result.Items);
    console.log((0, _statistics.count)(result.Items));
    console.log((0, _statistics.min)(result.Items));
    console.log((0, _statistics.max)(result.Items));
});