import validate from 'validate.js';

import loggerConstraints from './loggerConstraints';

export const creatorConstraints = (/*call*/) => ({
    name: {
        presence: true,
    },
    actions: {
        presence: true,
    },
    ...loggerConstraints
});
export default function validateCreator(call, logger=window.console) {
    const errors = validate(call, creatorConstraints(call));
    if (errors) logger.warn('errors in call creation', errors);
    return errors;
};
