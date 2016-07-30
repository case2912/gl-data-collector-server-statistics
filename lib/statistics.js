"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.min = exports.max = exports.count = undefined;

require("babel-polyfill");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _statisticsTarget = require("./statistics-target");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var count = exports.count = function count(item) {
    var t = [];
    t[_statisticsTarget.extensions.length - 1] = 0;
    t = _lodash2.default.map(t, function (v) {
        return 0;
    });
    item.map(function (data) {
        _lodash2.default.each(_statisticsTarget.extensions, function (element, index) {
            data.attrs.extensions[element] && (t[index] += 1);
        });
    });
    t = _lodash2.default.map(t, function (v) {
        return parseInt(v / item.length * 100);
    });
    return t;
};
var max = exports.max = function max(item) {
    var t = [];
    t[_statisticsTarget.parameters.length - 1] = 0;
    t = _lodash2.default.map(t, function (v) {
        return 0;
    });
    item.map(function (data) {
        _lodash2.default.each(_statisticsTarget.parameters, function (element, index) {
            t[index] = Math.max(t[index], data.attrs.parameters[element]);
        });
    });
    return t;
};
var min = exports.min = function min(item) {
    var t = [];
    t[_statisticsTarget.parameters.length - 1] = 0;
    t = _lodash2.default.map(t, function (v) {
        return 9E12;
    });
    item.map(function (data) {
        _lodash2.default.each(_statisticsTarget.parameters, function (element, index) {
            t[index] = Math.min(t[index], data.attrs.parameters[element]);
        });
    });
    t = _lodash2.default.map(t, function (v) {
        if (v === 9E12) {
            return 0;
        } else {
            return v;
        }
    });
    return t;
};