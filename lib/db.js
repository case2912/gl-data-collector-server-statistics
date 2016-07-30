"use strict";

require("babel-polyfill");

var _vogels = require("vogels");

var _vogels2 = _interopRequireDefault(_vogels);

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _statistics = require("./statistics");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        data: _joi2.default.array()
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
        data_type: "domain",
        data: t
    }, function (err) {
        err && console.log(err);
    });
};
scanAll().then(function (result) {
    (0, _statistics.count)(result.Items);
    (0, _statistics.min)(result.Items);
    (0, _statistics.max)(result.Items);
    console.log((0, _statistics.count)(result.Items));
    console.log((0, _statistics.min)(result.Items));
    console.log((0, _statistics.max)(result.Items));
});