import validate from 'validate.js';

export const handlerConstraints = (/*handler}*/) => ({
    sideEffect: {
        presence: false,
    },
    reducer: {
        presence: true,
    },
    name: {
        presence: true,
    },
});
export default function validateHandler(handler, logger=window.console) {
    const errors = validate(handler, handlerConstraints(handler));
    if (errors) logger.warn('errors in handler definition', errors);
    return errors;
};
