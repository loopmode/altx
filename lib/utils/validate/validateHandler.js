'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handlerConstraints = undefined;
exports.default = validateHandler;

var _validate = require('validate.js');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handlerConstraints = exports.handlerConstraints = function handlerConstraints() {
    return {
        sideEffect: {
            presence: false
        },
        reducer: {
            presence: true
        },
        name: {
            presence: true
        }
    };
};
function validateHandler(handler) {
    return (0, _validate2.default)(handler, handlerConstraints(handler));
}