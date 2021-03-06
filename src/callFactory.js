import { validateCreator, validateDefinition } from './utils/validate';
import { createLogger } from './utils/logging';
import createActions from './createActions';

export default function callFactory(
    name,
    {
        namespace = 'global',
        defaultActions = ['loading', 'error', 'success'],
        actions = createActions(`${namespace}:${name}`, defaultActions),
        logger = createLogger(`${namespace}:${name}`)
    } = {}
) {
    const errors = validateCreator({ name, actions, logger }, logger);
    const errorKeys = errors && Object.keys(errors);
    if (errorKeys && errorKeys.length) {
        throw new Error(errors[errorKeys[0]]);
    }

    return {
        name,
        actions,

        create: definition => {
            const createDefinition = typeof definition === 'function' ? definition : () => definition;
            const call = Object.assign(createDefinition({ name, actions, logger }), {
                name,
                actions,
                logger
            });
            if (validateDefinition(call, logger)) {
                throw new Error('Invalid call');
            }
            call.dataSource = {
                // set the default actions
                ...(call.actions || {}),
                // set dataSource from the definition passed om - potentially overriding the actions
                ...(call.dataSource || {})
            };
            return call;
        },
        createActions: actionNames => createActions(`${namespace}:${name}`, actionNames)
    };
}
