import createActions from './createActions';
import {createLogger} from './utils/logging';

export default function createViewAction(action, {
    namespace='global',
    logger=createLogger(action.id || action)
}={}) {
    const name = action.id || action;
    action = typeof action === 'string' ? createActions(namespace, action)[action] : action;
    return {
        define: (createDefinition) => {
            const definition = {
                name,
                action,
                namespace,
                logger
            };
            if (typeof createDefinition === 'function') {
                return Object.assign(definition, createDefinition({namespace, logger}));
            }
            else {
                return Object.assign(definition, createDefinition);
            }
        }
    };
}
