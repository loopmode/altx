import {bind} from 'alt-utils/lib/decorators';
import flatten from '../utils/flatten';
import {getLevel as getLogLevel, logLevel} from '../utils/logging';

/**
 * Decorates a store with any number of viewAction definitions.
 */
export default function bindViewActions(...args) {
    return function decorate(storeClass) {
        const calls = flatten(args);
        calls.forEach(call => bindViewActionHandler(storeClass, call));
        return storeClass;
    };
}


function bindViewActionHandler(storeClass, definition) {

    const {name, action, reducer, sideEffect, logger, logging} = definition;

    const handlerName = `${name}`;

    if (storeClass.prototype[handlerName]) throw new Error(`Duplicate handler "${handlerName}"`);

    storeClass.prototype[handlerName] = function handleViewAction(payload) {

        if (logging || getLogLevel() === logLevel.FORCE) {
            logger[payload instanceof Error ? 'error' : 'log'](payload && payload.toJS ? payload.toJS() : payload);
        }

        const currentState = this.state;
        let nextState = currentState;

        try {
            nextState = reducer && reducer(currentState, payload);
        }
        catch (error) {
            console.error(`${handlerName}: error executing reducer`, error);
        }

        if (nextState && nextState !== currentState) {
            this.setState(nextState);
        }

        try {
            sideEffect && sideEffect({state: nextState, prevState: currentState, payload});
        }
        catch (error) {
            console.error(`${handlerName}: error executing sideEffect`, error);
        }
    };

    const bindActionHandler = bind(action);

    bindActionHandler(
        storeClass,
        handlerName,
        Object.getOwnPropertyDescriptor(storeClass.prototype, handlerName)
    );

};
