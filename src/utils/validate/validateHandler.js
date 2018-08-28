import validate from 'validate.js';

export const handlerConstraints = (/*handler}*/) => ({
    sideEffect: {
        presence: false
    },
    reducer: {
        presence: true
    },
    name: {
        presence: true
    }
});
export default function validateHandler(handler) {
    return validate(handler, handlerConstraints(handler));
}
