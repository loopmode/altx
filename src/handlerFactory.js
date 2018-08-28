import createActions from './createActions';
import { createLogger } from './utils/logging';

export default function handlerFactory(
    action,
    { namespace = 'global', logger = createLogger(action.id || action) } = {}
) {
    const name = action.id || action;
    action = typeof action === 'string' ? createActions(namespace, action)[action] : action;
    return {
        create: createDefinition => {
            const definition = {
                name,
                action,
                namespace,
                logger
            };
            if (typeof createDefinition === 'function') {
                return Object.assign(definition, createDefinition({ namespace, logger }));
            } else {
                return Object.assign(definition, createDefinition);
            }
        }
    };
}
