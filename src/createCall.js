import defensive from './utils/defensive';

import {validateCreator, validateDefinition} from './utils/validate';
import {createLogger} from './utils/logging';
import createActions from './createActions';

export default function createCall(name, {
    namespace='global',
    defaultActions=['started', 'error', 'success'],
    actions=createActions(`${namespace}:${name}`, defaultActions),
    logger=createLogger(`${namespace}:${name}`),
}={}) {

    if (validateCreator({name, actions, logger}, logger)) {
        throw new Error('Invalid call');
    }

    return {

        name,
        actions,

        define: (definition) => {
            const createDefinition = typeof definition === 'function' ? definition : () => definition;
            const call = Object.assign(createDefinition({name, actions, logger}), {
                name,
                actions,
                logger
            });
            if (validateDefinition(call, logger)) {
                throw new Error('Invalid call');
            }
            call.dataSource = {
                ...actions,
                ...(call.dataSource || {})
            };
            return defensive(call);
        },
        createActions: (actionNames) => createActions(`${namespace}:${name}`, actionNames)
    };
}
