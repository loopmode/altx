'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createActions;

var _altInstance = require('./altInstance');

function createActions(namespace, actions) {
    return (0, _altInstance.getAltInstance)().createActions(_extends({
        name: namespace
    }, [].concat(actions).reduce(function (result, action) {
        result[action] = function () {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return data;
        };
        return result;
    }, {})));
}