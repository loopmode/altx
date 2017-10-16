import createActions from './createActions';

/**
 * Creates a single action with a namespace.
 * Basically just like `altx.generateActions`, but with a signle required argument `name` and an optional second argument `namespace`.
 *
 * Note: The returned object is very much the same as with the plural version `createActions`: You get back an object that has
 * a function by the name you gave as well as an constant for the action name.
 *
 * @example
 * createAction('myAction', 'myNamespace'); // {name: 'myNamespace', myAction: function() {...}, MY_ACTION: 'myNamespace.myAction'}
 *
 * @param {string} name - The name to use for the action
 * @param {string} namespace - The namespace to use for the action
 * @return {object} An name object
 */
export default function createAction(name, namespace = 'default') {
    const actions = createActions(namespace, [name]);
    return actions;
}
