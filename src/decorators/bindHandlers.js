import {bind} from 'alt-utils/lib/decorators';
import flattenArrays from '../utils/flatten';

/**
 * Decorates a store with any number of action handlers.
 */
export default function bindHandlers(actions, ...handlers) {
    return function decorateStore(storeClass) {
        // attach bound handler methods to the store class for each handler definition
        flattenArrays(handlers).forEach(handler => attachBoundHandler(storeClass, actions[handler.name], handler));
        return storeClass;
    };
}
/**
 * Attaches a single reducer handling to the store.
 *
 * A new handler method will be created on the store class.
 * The handler method invokes the reducer giving it the current store state.
 * It then sets the reducer result as the new store state.
 *
 * If a sideEffect function is defined, it will be called with the signature `{state, prevState, payload}`
 *
 * @param {object} storeClass - The class of the store to be decorated
 * @param {object} action - An altjs action
 * @param {object} handler - An handler object with `{name[, reducer, sideEffect]}`
 */
function attachBoundHandler(storeClass, action, handler) {
    // name is required

    const methodName = `__handle_${handler.name}`;

    if (storeClass.prototype[methodName]) throw new Error(`Duplicate method "${methodName}"`);

    /**
     * Handles an action call and sets the next state of the store.
     *
     * @param {any} payload - the single argument that can be specified when calling an action.
     *                      If you need to use more than one argument, use an object with any properties you need.
     */
    storeClass.prototype[methodName] = function handleAction(payload) {

        const reducer = handler.hasOwnProperty('reducer') && handler.reducer;
        const sideEffect = handler.hasOwnProperty('sideEffect') && handler.sideEffect;

        const currentState = this.state;


        // the actual operation: run the reducer and set its result as state
        let nextState = currentState;
        if (reducer) {
            try {
                nextState = reducer(currentState, payload);
            }
            catch (error) {
                console.error(`Error in reducer (${handler.name}, ${handler.name})`, error);
            }
        }
        if (nextState) {
            this.setState(nextState);
        }
        else if (CONFIG.debug && reducer) {
            console.warn(`reducer "${handler.name}" in call "${handler.name}" did not return a new state.
                Either you forgot to return it, or if no state change is required, maybe you should use a sideEffect instead of a reducer.
            `);
        }



        if (sideEffect) {
            try {
                sideEffect({state: nextState, prevState: currentState, payload});
            }
            catch (error) {
                console.error(`Error in sideEffect (${handler.name}, ${handler.name})`, error);
            }
        }
    };

    const bindhandler = bind(action);

    bindhandler(
        storeClass,
        methodName,
        Object.getOwnPropertyDescriptor(storeClass.prototype, methodName)
    );

};
