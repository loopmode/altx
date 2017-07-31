import {validateCreator, validateDefinition} from './utils/validate';
import {createLogger} from './utils/logging';
import createActions from './createActions';

export default function createCall(name, {
    namespace='global',
    defaultActions=['loading', 'error', 'success'],
    actions=createActions(`${namespace}:${name}`, defaultActions),
    logger=createLogger(`${namespace}:${name}`),
}={}) {
    const error = validateCreator({name, actions, logger}, logger);
    if (error) {
        throw error;
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
                ...call.actions,
                ...(call.dataSource || {})
            };
            return call;
        },
        createActions: (actionNames) => createActions(`${namespace}:${name}`, actionNames)
    };
}
