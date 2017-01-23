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
    const errors = validate(definition, definitionConstraints(definition));
    if (errors) logger.warn('errors in call definition', errors);
    return errors;
};
