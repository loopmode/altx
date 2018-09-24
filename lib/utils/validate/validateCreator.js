'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.creatorConstraints = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = validateCreator;

var _validate = require('validate.js');

var _validate2 = _interopRequireDefault(_validate);

var _loggerConstraints = require('./loggerConstraints');

var _loggerConstraints2 = _interopRequireDefault(_loggerConstraints);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var creatorConstraints = exports.creatorConstraints = function creatorConstraints() {
    return _extends({
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