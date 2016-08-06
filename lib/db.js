"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.update = exports.sendAllData = exports.scanAll = exports.query = exports.createTables = undefined;

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
                resolve(data.Items.map(function (data) {
                    return data.attrs;
                }));
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
                            table.update(element, function (err) {
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
var sendAllData = exports.sendAllData = function sendAllData() {
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
            return data[name];
        })));
    });
};
var update = exports.update = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var result, browser_name, domain, platform_name;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return scanAll();

                    case 2:
                        result = _context4.sent;
                        _context4.next = 5;
                        return list(result, "browser_name");

                    case 5:
                        browser_name = _context4.sent;
                        _context4.next = 8;
                        return list(result, "domain");

                    case 8:
                        domain = _context4.sent;
                        _context4.next = 11;
                        return list(result, "platform_name");

                    case 11:
                        platform_name = _context4.sent;

                        create({ name: "browser_name", index: browser_name });
                        create({ name: "domain", index: domain });
                        create({ name: "platform_name", index: platform_name });
                        _context4.next = 17;
                        return (0, _statistics.max)(result);

                    case 17:
                        _context4.t0 = _context4.sent;
                        _context4.next = 20;
                        return (0, _statistics.min)(result);

                    case 20:
                        _context4.t1 = _context4.sent;
                        _context4.next = 23;
                        return (0, _statistics.count)(result);

                    case 23:
                        _context4.t2 = _context4.sent;
                        _context4.t3 = {
                            name: "all",
                            max: _context4.t0,
                            min: _context4.t1,
                            count: _context4.t2
                        };
                        create(_context4.t3);

                        browser_name.map(function () {
                            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(name) {
                                var t, s, u;
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                _context3.next = 2;
                                                return _lodash2.default.filter(result, function (data) {
                                                    return data.browser_name === name;
                                                });

                                            case 2:
                                                t = _context3.sent;
                                                _context3.next = 5;
                                                return list(t, "browser_version");

                                            case 5:
                                                s = _context3.sent;
                                                _context3.next = 8;
                                                return _lodash2.default.chain(s).map(function (v) {
                                                    return versionReplace(v);
                                                }).uniq().value();

                                            case 8:
                                                u = _context3.sent;

                                                u.map(function () {
                                                    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(version) {
                                                        var v;
                                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                            while (1) {
                                                                switch (_context2.prev = _context2.next) {
                                                                    case 0:
                                                                        _context2.next = 2;
                                                                        return _lodash2.default.filter(t, function (data) {
                                                                            return versionReplace(data.browser_version) === version;
                                                                        });

                                                                    case 2:
                                                                        v = _context2.sent;
                                                                        _context2.t0 = name + version;
                                                                        _context2.next = 6;
                                                                        return (0, _statistics.max)(v);

                                                                    case 6:
                                                                        _context2.t1 = _context2.sent;
                                                                        _context2.next = 9;
                                                                        return (0, _statistics.min)(v);

                                                                    case 9:
                                                                        _context2.t2 = _context2.sent;
                                                                        _context2.next = 12;
                                                                        return (0, _statistics.count)(v);

                                                                    case 12:
                                                                        _context2.t3 = _context2.sent;
                                                                        _context2.t4 = {
                                                                            name: _context2.t0,
                                                                            max: _context2.t1,
                                                                            min: _context2.t2,
                                                                            count: _context2.t3
                                                                        };
                                                                        create(_context2.t4);
                                                                        _context2.next = 17;
                                                                        return createPlatformItems(platform_name, v, name, version);

                                                                    case 17:
                                                                    case "end":
                                                                        return _context2.stop();
                                                                }
                                                            }
                                                        }, _callee2, undefined);
                                                    }));

                                                    return function (_x3) {
                                                        return _ref4.apply(this, arguments);
                                                    };
                                                }());
                                                _context3.t0 = name;
                                                _context3.next = 13;
                                                return (0, _statistics.max)(t);

                                            case 13:
                                                _context3.t1 = _context3.sent;
                                                _context3.next = 16;
                                                return (0, _statistics.min)(t);

                                            case 16:
                                                _context3.t2 = _context3.sent;
                                                _context3.next = 19;
                                                return (0, _statistics.count)(t);

                                            case 19:
                                                _context3.t3 = _context3.sent;
                                                _context3.t4 = {
                                                    name: _context3.t0,
                                                    max: _context3.t1,
                                                    min: _context3.t2,
                                                    count: _context3.t3
                                                };
                                                create(_context3.t4);
                                                _context3.next = 24;
                                                return createPlatformItems(platform_name, t, name, "");

                                            case 24:
                                            case "end":
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, undefined);
                            }));

                            return function (_x2) {
                                return _ref3.apply(this, arguments);
                            };
                        }());
                        createPlatformItems(platform_name, result, "", "");

                    case 28:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function update() {
        return _ref2.apply(this, arguments);
    };
}();
var versionReplace = function versionReplace(s) {
    return s.replace(/(?![0-9])(.*)/, "");
};
var createPlatformItems = function createPlatformItems(platform_name, result, browser_name, browser_version) {
    _lodash2.default.map(platform_name, function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(name) {
            var t, s, u;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return _lodash2.default.filter(result, function (data) {
                                return data.platform_name === name;
                            });

                        case 2:
                            t = _context6.sent;
                            _context6.next = 5;
                            return list(t, "platform_version");

                        case 5:
                            s = _context6.sent;
                            _context6.next = 8;
                            return _lodash2.default.chain(s).map(function (v) {
                                return versionReplace(v);
                            }).uniq().value();

                        case 8:
                            u = _context6.sent;

                            u.map(function () {
                                var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(version) {
                                    var v;
                                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                        while (1) {
                                            switch (_context5.prev = _context5.next) {
                                                case 0:
                                                    _context5.next = 2;
                                                    return _lodash2.default.filter(t, function (data) {
                                                        return versionReplace(data.platform_version) === version;
                                                    });

                                                case 2:
                                                    v = _context5.sent;
                                                    _context5.t0 = browser_name + browser_version + name + version;
                                                    _context5.next = 6;
                                                    return (0, _statistics.max)(v);

                                                case 6:
                                                    _context5.t1 = _context5.sent;
                                                    _context5.next = 9;
                                                    return (0, _statistics.min)(v);

                                                case 9:
                                                    _context5.t2 = _context5.sent;
                                                    _context5.next = 12;
                                                    return (0, _statistics.count)(v);

                                                case 12:
                                                    _context5.t3 = _context5.sent;
                                                    _context5.t4 = {
                                                        name: _context5.t0,
                                                        max: _context5.t1,
                                                        min: _context5.t2,
                                                        count: _context5.t3
                                                    };
                                                    create(_context5.t4);

                                                case 15:
                                                case "end":
                                                    return _context5.stop();
                                            }
                                        }
                                    }, _callee5, undefined);
                                }));

                                return function (_x5) {
                                    return _ref6.apply(this, arguments);
                                };
                            }());
                            _context6.t0 = browser_name + browser_version + name;
                            _context6.next = 13;
                            return (0, _statistics.max)(t);

                        case 13:
                            _context6.t1 = _context6.sent;
                            _context6.next = 16;
                            return (0, _statistics.min)(t);

                        case 16:
                            _context6.t2 = _context6.sent;
                            _context6.next = 19;
                            return (0, _statistics.count)(t);

                        case 19:
                            _context6.t3 = _context6.sent;
                            _context6.t4 = {
                                name: _context6.t0,
                                max: _context6.t1,
                                min: _context6.t2,
                                count: _context6.t3
                            };
                            create(_context6.t4);

                        case 22:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined);
        }));

        return function (_x4) {
            return _ref5.apply(this, arguments);
        };
    }());
};