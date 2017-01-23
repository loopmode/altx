import alt from 'app/alt';

/**
 * Creates simple (data-pass-through) actions with a namespace.
 * Basically just like `alt.generateActions`, but within a given namespace instead of 'global'.
 *
 * @param {string} namespace - The namespace to use for the actions
 * @param {array<string>} actions - An array of action names
 * @return {object} An object containing the generated actions and constants
 */
export default function createActions(namespace, actions) {
    return alt.createActions({
        name: namespace,
        ...[].concat(actions).reduce((result, action) => {
            result[action] = (data={}) => data;
            return result;
        }, {})
    });
}
