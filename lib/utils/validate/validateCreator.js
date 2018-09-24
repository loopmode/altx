'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.creatorConstraints = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = validateCreator;

var _validate = require('validate.js');

var _validate2 = _interopRequireDefault(_validate);

var _loggerConstraints = require('./loggerConstraints');

var _loggerConstraints2 = _interopRequireDefault(_loggerConstraints);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var creatorConstraints = exports.creatorConstraints = function creatorConstraints() {
    return (0, _extends3.default)({
        name: {
            presence: true
        },
        actions: {
            presence: true
        }
    }, _loggerConstraints2.default);
};
function validateCreator(call) {
    return (0, _validate2.default)(call, creatorConstraints(call));
}