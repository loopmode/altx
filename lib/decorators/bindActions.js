'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = bindActions;

var _decorators = require('alt-utils/lib/decorators');

var _flatten = require('../utils/flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _logging = require('../utils/logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bindActions() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return function decorate(storeClass) {
        var calls = (0, _flatten2.default)(args);
        calls.forEach(function (call) {
            return bindViewActionHandler(storeClass, call);
        });
        return storeClass;
    };
}

function bindViewActionHandler(storeClass, definition) {
    var name = definition.name,
        action = definition.action,
        reducer = definition.reducer,
        sideEffect = definition.sideEffect,
        logger = definition.logger,
        logging = definition.logging;


    var handlerName = '' + name;

    if (storeClass.prototype[handlerName]) throw new Error('Duplicate handler "' + handlerName + '"');

    storeClass.prototype[handlerName] = function handleViewAction(payload) {
        if (logging || (0, _logging.getLevel)() === _logging.logLevel.FORCE) {
            logger[payload instanceof Error ? 'error' : 'log'](payload && payload.toJS ? payload.toJS() : payload);
        }

        var currentState = this.state;
        var nextState = currentState;

        try {
            nextState = reducer && reducer(currentState, payload);
        } catch (error) {
            console.error(handlerName + ': error executing reducer', error);
        }

        if (nextState && nextState !== currentState) {
            this.setState(nextState);
        }

        if (sideEffect) {
            setTimeout(function () {
                try {
                    sideEffect({ state: nextState, prevState: currentState, payload: payload });
                } catch (error) {
                    console.error(handlerName + ': error executing sideEffect', error);
                }
            });
        }
    };

    var bindActionHandler = (0, _decorators.bind)(action);

    bindActionHandler(storeClass, handlerName, Object.getOwnPropertyDescriptor(storeClass.prototype, handlerName));
}