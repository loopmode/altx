import createActions from './createActions';

/**
 * Creates a single simple (data-pass-through) action with a namespace.
 * Basically just like `alt.generateActions`, but within a given namespace instead of 'global'.
 *
 * @param {string} name - The name to use for the action
 * @param {string} namespace - The namespace to use for the action
 * @return {object} An name object
 */
export default function createAction(name, namespace = 'default') {
    const actions = createActions(namespace, [name]);
    return actions;
}
