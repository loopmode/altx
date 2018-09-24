'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.definitionConstraints = undefined;
exports.default = validateDefinition;

var _validate = require('validate.js');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitionConstraints = exports.definitionConstraints = function definitionConstraints() {
    return {
        sideEffects: {
            presence: false
        },
        dataSource: {
            presence: true
        },
        reducers: {
            presence: false
        }
    };
};
function validateDefinition(definition) {
    return (0, _validate2.default)(definition, definitionConstraints(definition));
}