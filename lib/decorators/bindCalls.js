'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = bindCalls;

var _decorators = require('alt-utils/lib/decorators');

var _flatten = require('../utils/flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _logging = require('../utils/logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bindCalls() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return function decorateStore(Store) {
        var calls = (0, _flatten2.default)(args);
        calls.forEach(function (call) {
            return decorateStoreWithCall(Store, call);
        });
        return Store;
    };
}

function decorateStoreWithCall(Store, call) {
    var names = (0, _keys2.default)(call.actions).reduce(function (result, key) {
        if (key === 'name') {
            return result;
        }

        if (result.indexOf(key.toLowerCase()) === -1) {
            result.push(key);
        }
        return result;
    }, []);
    names.forEach(function (reducerName) {
        createStoreHandler(reducerName, Store, call);
    });
}

function createStoreHandler(reducerName, Store, call) {
    var handlerName = '_' + call.name + '_' + reducerName;

    if (Store.prototype[handlerName]) throw new Error('Duplicate handler "' + handlerName + '"');

    Store.prototype[handlerName] = function handleCallAction(payload) {
        var reducer = call.hasOwnProperty('reducers') && call.reducers[reducerName];
        var sideEffect = call.hasOwnProperty('sideEffects') && call.sideEffects[reducerName];
        var logging = call.hasOwnProperty('logging') && call.logging;
        var logger = call.hasOwnProperty('logger') && call.logger;
        var isError = payload instanceof Error;
        if (isError) {
            if (payload.response && payload.response.body && payload.response.body.message) {
                logger.error(reducerName, payload.response.body.message);
            }
        } else if (logging || (0, _logging.getLevel)() === _logging.logLevel.FORCE) {
            logger[isError ? 'error' : 'log'](reducerName, payload && payload.toJS ? payload.toJS() : payload);
        }

        var currentState = this.state;
        var nextState = currentState;

        if (reducer) {
            try {
                nextState = reducer(currentState, payload);
            } catch (error) {
                console.error('Error in reducer (' + call.name + ', ' + reducerName + ')', error);
            }
        }

        if (reducer && !nextState) console.warn('reducer "' + reducerName + '" in call "' + call.name + '" did not return a new state. Either you forgot to return it, or you should consider using a sideEffect instead of a reducer if no return value is needed.');

        if (nextState) {
            this.setState(nextState);
        }

        if (sideEffect) {
            setTimeout(function () {
                try {
                    sideEffect({ state: nextState, prevState: currentState, payload: payload });
                } catch (error) {
                    console.error('Error in sideEffect (' + call.name + ', ' + reducerName + ')', error);
                }
            });
        }
    };

    var bindHandler = (0, _decorators.bind)(call.actions[reducerName]);
    var descriptor = (0, _getOwnPropertyDescriptor2.default)(Store.prototype, handlerName);
    bindHandler(Store, handlerName, descriptor);
}