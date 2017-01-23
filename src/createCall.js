import defensive from 'common/utils/defensive';

import {validateCreator, validateDefinition} from './utils/validate';
import {createLogger} from './utils/logging';
import createActions from './createActions';

export default function createCall(name, {
    namespace='global',
    defaultActions=['started', 'error', 'success'],
    actions=createActions(`${namespace}:${name}`, defaultActions),
    logger=createLogger(name),
}={}) {

    if (validateCreator({name, actions, logger}, logger)) {
        throw new Error('Invalid call');
    }

    return {

        name,
        actions,

        define: (createDefinition) => {
            const definition = Object.assign(createDefinition({name, actions, logger}), {
                name,
                actions,
                logger
            });
            if (validateDefinition(definition, logger)) {
                throw new Error('Invalid call definition');
            }
            return defensive(definition);
        },
        createActions: (actionNames) => createActions(`${namespace}:${name}`, actionNames)
    };
}
