'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = createActions;

var _altInstance = require('./altInstance');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createActions(namespace, actions) {
    return (0, _altInstance.getAltInstance)().createActions((0, _extends3.default)({
        name: namespace
    }, [].concat(actions).reduce(function (result, action) {
        result[action] = function () {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return data;
        };
        return result;
    }, {})));
}