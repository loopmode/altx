import validate from 'validate.js';

import loggerConstraints from './loggerConstraints';

export const creatorConstraints = (/*call*/) => ({
    name: {
        presence: true
    },
    actions: {
        presence: true
    },
    ...loggerConstraints
});
export default function validateCreator(call) {
    return validate(call, creatorConstraints(call));
}
