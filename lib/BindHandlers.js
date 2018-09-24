'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = BindHandlers;

var _decorators = require('alt-utils/lib/decorators');

function BindHandlers() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var definitions = args.reduce(function (result, def) {
        if (Array.isArray(def)) {
            def.forEach(function (d) {
                return result.push(d);
            });
        } else {
            result.push(def);
        }
        return result;
    }, []);
    return function decorateStore(StoreClass) {
        definitions.forEach(function bindActions(_ref, i) {
            var handler = _ref.handler,
                bindings = _ref.bindings;

            if (!handler || !handler.prototype) {
                throw new Error('Invalid action handler');
            }

            var name = '$' + i + '_' + handler.prototype.constructor.name;

            var methodNames = Object.keys(bindings);

            methodNames.forEach(function bindAction(methodName) {
                if (typeof bindings[methodName] !== 'function') {
                    throw new Error('bindings.' + methodName + ' is not a function (handler: ' + name + ')');
                }
                if (typeof handler.prototype[methodName] !== 'function') {
                    throw new Error(name + '.' + methodName + ' is not a function');
                }
                var storeMethodName = name + '_' + methodName;

                StoreClass.prototype[storeMethodName] = handler.prototype[methodName];

                var applyBinding = (0, _decorators.bind)(bindings[methodName]);
                applyBinding(StoreClass, storeMethodName, Object.getOwnPropertyDescriptor(StoreClass.prototype, storeMethodName));
            });
        });
        return StoreClass;
    };
}