import validate from 'validate.js';

export const definitionConstraints = (/*definition}*/) => ({
    sideEffects: {
        presence: false,
    },
    dataSource: {
        presence: true,
    },
    reducers: {
        presence: false,
    },
});
export default function validateDefinition(definition, logger=window.console) {
    return validate(definition, definitionConstraints(definition));
};
