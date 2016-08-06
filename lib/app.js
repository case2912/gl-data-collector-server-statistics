"use strict";

require("babel-polyfill");

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require("koa-router");

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaBodyparser = require("koa-bodyparser");

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _db = require("./db");

var _cron = require("cron");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var app = new _koa2.default();
var router = new _koaRouter2.default({ prefix: '/list' });
router.get('/', function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        ctx.response.set("Access-Control-Allow-Origin", "*");
                        _context.next = 3;
                        return next();

                    case 3:
                        _context.next = 5;
                        return (0, _db.sendAllData)();

                    case 5:
                        ctx.response.body = _context.sent;

                    case 6:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());
router.get('/:key', function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        ctx.response.set("Access-Control-Allow-Origin", "*");
                        _context2.next = 3;
                        return next();

                    case 3:
                        _context2.next = 5;
                        return (0, _db.query)(ctx.params.key);

                    case 5:
                        ctx.response.body = _context2.sent;

                    case 6:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());
router.get('/:key/:key2', function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        ctx.response.set("Access-Control-Allow-Origin", "*");
                        _context3.next = 3;
                        return next();

                    case 3:
                        _context3.next = 5;
                        return (0, _db.query)(ctx.params.key + ctx.params.key2);

                    case 5:
                        ctx.response.body = _context3.sent;

                    case 6:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());
router.get('/:key/:key2/:key3', function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx, next) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        ctx.response.set("Access-Control-Allow-Origin", "*");
                        _context4.next = 3;
                        return next();

                    case 3:
                        _context4.next = 5;
                        return (0, _db.query)(ctx.params.key + ctx.params.key2 + ctx.params.key3);

                    case 5:
                        ctx.response.body = _context4.sent;

                    case 6:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}());
router.get('/:key/:key2/:key3/:key4', function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx, next) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        ctx.response.set("Access-Control-Allow-Origin", "*");
                        _context5.next = 3;
                        return next();

                    case 3:
                        _context5.next = 5;
                        return (0, _db.query)(ctx.params.key + ctx.params.key2 + ctx.params.key3 + ctx.params.key4);

                    case 5:
                        ctx.response.body = _context5.sent;

                    case 6:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}());
app.listen(process.env.PORT || 3000, function () {
    console.log("listening on port " + (process.env.PORT || 3000));
});
app.use((0, _koaBodyparser2.default)()).use(router.routes()).use(router.allowedMethods());
var init = function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return (0, _db.update)();

                    case 2:
                        _context6.next = 4;
                        return console.log("table is updated!");

                    case 4:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function init() {
        return _ref6.apply(this, arguments);
    };
}();
init();