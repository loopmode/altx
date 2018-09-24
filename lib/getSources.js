"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

exports.default = getSources;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSources(calls) {
    return calls.reduce(function (dataSource, call) {
        return (0, _assign2.default)(dataSource, (0, _defineProperty3.default)({}, call.name, function () {
            return call.dataSource;
        }));
    }, {});
}