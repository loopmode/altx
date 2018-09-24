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

    return function decorate(storeClass) {
        var calls = (0, _flatten2.default)(args);
        calls.forEach(function (call) {
            return decorateStoreWithCall(storeClass, call);
        });
        return storeClass;
    };
}

function decorateStoreWithCall(storeClass, callDefinition) {
    var actionNames = (0, _keys2.default)(callDefinition.actions).reduce(function (result, key) {
        if (result.indexOf(key.toLowerCase()) === -1) {
            result.push(key);
        }
        return result;
    }, []);
    actionNames.forEach(function (reducerName) {
        bindReducerHandler(reducerName, storeClass, callDefinition);
    });
}

function bindReducerHandler(reducerName, storeClass, callDefinition) {
    var handlerName = '_' + callDefinition.name + '_' + reducerName;

    if (storeClass.prototype[handlerName]) throw new Error('Duplicate handler "' + handlerName + '"');

    storeClass.prototype[handlerName] = function handleCallAction(payload) {
        var reducer = callDefinition.hasOwnProperty('reducers') && callDefinition.reducers[reducerName];
        var sideEffect = callDefinition.hasOwnProperty('sideEffects') && callDefinition.sideEffects[reducerName];
        var logging = callDefinition.hasOwnProperty('logging') && callDefinition.logging;
        var logger = callDefinition.hasOwnProperty('logger') && callDefinition.logger;
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
                console.error('Error in reducer (' + callDefinition.name + ', ' + reducerName + ')', error);
            }
        }

        if (reducer && !nextState) console.warn('reducer "' + reducerName + '" in call "' + callDefinition.name + '" did not return a new state. Either you forgot to return it, or you should consider using a sideEffect instead of a reducer if no return value is needed.');

        if (nextState) {
            this.setState(nextState);
        }

        if (sideEffect) {
            setTimeout(function () {
                try {
                    sideEffect({ state: nextState, prevState: currentState, payload: payload });
                } catch (error) {
                    console.error('Error in sideEffect (' + callDefinition.name + ', ' + reducerName + ')', error);
                }
            });
        }
    };

    var action = callDefinition.actions[reducerName];
    var bindActionHandler = (0, _decorators.bind)(action);

    bindActionHandler(storeClass, handlerName, (0, _getOwnPropertyDescriptor2.default)(storeClass.prototype, handlerName));
}