"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getSources;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getSources(calls) {
    return calls.reduce(function (dataSource, call) {
        return Object.assign(dataSource, _defineProperty({}, call.name, function () {
            return call.dataSource;
        }));
    }, {});
}