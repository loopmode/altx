import { bind as bindAlt } from 'alt-utils/lib/decorators';

// DEPRECATED
// replace with "calls and viewActions!"

/**
 * Creates a decorator for binding action handlers to a store.
 * A binding is created for each action that has a matching handler method mapping.
 *
 * The decorator takes any number of action handler definitions as arguments and applies their
 * bindings after concatinating them to a flat list, so you can pass either of these:
 * - an array of handler definitions
 * - any number of array of handler definitions
 * - any number of handlerdefinitions without arrays
 * - any mixed variation
 *
 * See manual/usage/action-handlers.md for more on this topic.
 */
export default function BindHandlers(...args) {
    const definitions = args.reduce((result, def) => {
        if (Array.isArray(def)) {
            def.forEach(d => result.push(d));
        } else {
            result.push(def);
        }
        return result;
    }, []);
    return function decorateStore(StoreClass) {
        definitions.forEach(function bindActions({ handler, bindings }, i) {
            if (!handler || !handler.prototype) {
                throw new Error('Invalid action handler');
            }
            // we need unique prefixes for the potentionally same method names
            // using handler.prototype.constructor.name alone is useless after mangling/uglifying!
            const name = `$${i}_${handler.prototype.constructor.name}`;
            // collect the names of the methods defined in the handler decorator
            const methodNames = Object.keys(bindings);
            // now for each decorator method that has an action by the same name...
            methodNames.forEach(function bindAction(methodName) {
                if (typeof bindings[methodName] !== 'function') {
                    throw new Error(`bindings.${methodName} is not a function (handler: ${name})`);
                }
                if (typeof handler.prototype[methodName] !== 'function') {
                    throw new Error(`${name}.${methodName} is not a function`);
                }
                const storeMethodName = `${name}_${methodName}`;
                // ...copy the method from the decorator class to the store class
                StoreClass.prototype[storeMethodName] = handler.prototype[methodName];
                // and bind the action to it, using Alt's 'bind' util
                const applyBinding = bindAlt(bindings[methodName]);
                applyBinding(
                    StoreClass,
                    storeMethodName,
                    Object.getOwnPropertyDescriptor(StoreClass.prototype, storeMethodName)
                );
            });
        });
        return StoreClass;
    };
}
