import {bind} from 'alt-utils/lib/decorators';
import flatten from '../utils/flatten';
import {getLevel as getLogLevel, logLevel} from '../utils/logging';
/**
 * Decorates a store with any number of call definitions.
 */
export default function bindCalls(...args) {
    return function decorate(storeClass) {
        const calls = flatten(args);
        calls.forEach(call => decorateStoreWithCall(storeClass, call));
        return storeClass;
    };
}

/**
 * Decorates a store with a single call definition.
 * Attaches the dataSource specified in the call definition using alt's datasource decorator.
 * Creates and binds a handler function for all reducers and actions specified in the call definition.
 */
function decorateStoreWithCall(storeClass, callDefinition) {
    const actionNames = Object.keys(callDefinition.actions).reduce((result, key) => {
        // remove ACTION_CONSTANT variants generated by alt
        if (result.indexOf(key.toLowerCase()) === -1) {
            result.push(key);
        }
        return result;
    }, []);
    actionNames.forEach(reducerName => {
        bindReducerHandler(reducerName, storeClass, callDefinition);
    });
}

/**
 * Attaches a single reducer handling to the store.
 * A new handler method will be created on the store for each action associated
 * with a reducer (default: started, error, success). Each handler will pass
 * the current state and the action payload to the reducer with the same name
 * and mutate the store with the new state returned by the reducer.
 * Any sideEffects defined in the call will be executed with a ({state, prevState, payload}) signature.
 */
function bindReducerHandler(reducerName, storeClass, callDefinition) {

    const handlerName = `_${callDefinition.name}_${reducerName}`;

    if (storeClass.prototype[handlerName]) throw new Error(`Duplicate handler "${handlerName}"`);

    storeClass.prototype[handlerName] = function handleCallAction(payload) {

        const reducer = callDefinition.hasOwnProperty('reducers') && callDefinition.reducers[reducerName];
        const sideEffect = callDefinition.hasOwnProperty('sideEffects') && callDefinition.sideEffects[reducerName];
        const logging = callDefinition.hasOwnProperty('logging') && callDefinition.logging;
        const logger = callDefinition.hasOwnProperty('logger') && callDefinition.logger;
        const isError = payload instanceof Error;
        if (isError) {
            if (payload.response && payload.response.body && payload.response.body.message) {
                logger.error(reducerName, payload.response.body.message);
            }
            // logger.debug(payload);
        }
        else if (logging || getLogLevel() === logLevel.FORCE) {
            logger[isError ? 'error' : 'log'](reducerName, payload && payload.toJS ? payload.toJS() : payload);
        }

        const currentState = this.state;
        let nextState = currentState;

        if (reducer) {
            //console.log(`[${handlerName}]`, payload, callDefinition);
            try {
                nextState = reducer(currentState, payload);
            }
            catch (error) {
                console.error(`Error in reducer (${callDefinition.name}, ${reducerName})`, error);
            }
        }

        if (CONFIG.debug && reducer && !nextState) console.warn(`reducer "${reducerName}" in call "${callDefinition.name}" did not return a new state. Either you forgot to return it, or you should consider using a sideEffect instead of a reducer if no retun value is needed.`);

        if (nextState) {
            this.setState(nextState);
        }

        if (sideEffect) {
            try {
                sideEffect({state: nextState, prevState: currentState, payload});
            }
            catch (error) {
                console.error(`Error in sideEffect (${callDefinition.name}, ${reducerName})`, error);
            }
        }
    };

    const action = callDefinition.actions[reducerName];
    const bindActionHandler = bind(action);

    bindActionHandler(
        storeClass,
        handlerName,
        Object.getOwnPropertyDescriptor(storeClass.prototype, handlerName)
    );

};
