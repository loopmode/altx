'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = bindHandlers;

var _decorators = require('alt-utils/lib/decorators');

var _flatten = require('../utils/flatten');

var _flatten2 = _interopRequireDefault(_flatten);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bindHandlers(actions) {
    for (var _len = arguments.length, handlers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        handlers[_key - 1] = arguments[_key];
    }

    return function decorateStore(storeClass) {
        (0, _flatten2.default)(handlers).forEach(function (handler) {
            return attachBoundHandler(storeClass, actions[handler.name], handler);
        });
        return storeClass;
    };
}

function attachBoundHandler(storeClass, action, handler) {

    var methodName = '__handle_' + handler.name;

    if (storeClass.prototype[methodName]) throw new Error('Duplicate method "' + methodName + '"');

    storeClass.prototype[methodName] = function handleAction(payload) {
        var reducer = handler.hasOwnProperty('reducer') && handler.reducer;
        var sideEffect = handler.hasOwnProperty('sideEffect') && handler.sideEffect;

        var currentState = this.state;

        var nextState = currentState;
        if (reducer) {
            try {
                nextState = reducer(currentState, payload);
            } catch (error) {
                console.error('Error in reducer (' + handler.name + ', ' + handler.name + ')', error);
            }
        }
        if (nextState) {
            this.setState(nextState);
        } else if (reducer) {
            console.warn('reducer "' + handler.name + '" in call "' + handler.name + '" did not return a new state.\n                Either you forgot to return it, or if no state change is required, maybe you should use a sideEffect instead of a reducer.\n            ');
        }

        if (sideEffect) {
            try {
                sideEffect({ state: nextState, prevState: currentState, payload: payload });
            } catch (error) {
                console.error('Error in sideEffect (' + handler.name + ', ' + handler.name + ')', error);
            }
        }
    };

    var bindhandler = (0, _decorators.bind)(action);

    bindhandler(storeClass, methodName, Object.getOwnPropertyDescriptor(storeClass.prototype, methodName));
}