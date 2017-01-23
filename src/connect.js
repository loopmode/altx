import connectToStores from 'alt-utils/lib/connectToStores';

/* eslint-disable */
/**
 * A component decorator for connecting to immutable stores.
 *
 * Basically a wrapper around `alt/utils/connectToStores`.  
 * Adds the necessary static methods `getStores()` and `getPropsFromStores()` to the decorated component.
 *
 * - Supports multiple stores.
 * - Supports a simplified, string-based access to stores, with optional renaming of props.
 * - Supports more flexible, redux-like access to stores using mapper functions.
 *
 * ### String notation
 *
 * @example
 * @connectToStores([{store: MyStore, props: ['myValue', 'anotherValue']}])
 * export default class MyComponent extends React.Component {
 *      render() {
 *          const {myValue, anotherValue} = this.props;
 *          ...
 *      }
 * }
 *
 * You can rename props using the ` as ` alias syntax
 *
 * @example
 * @connectToStores([{
 *      store: PeopleStore,
 *      props: ['items as people']
 * }, {
 *      store: ProductStore,
 *      props: ['items as products']
 * }])
 * export default class MyComponent extends React.Component {
 *      render() {
 *          // this.props.people, this.props.products, ...
 *      }
 * }
 *
 * ### Function notation
 *
 * Use mapper functions instead of strings in order to manually retrieve store values.
 * The function receives the store state and the component props.
 *
 * @example
 * @connectToStores([{
 *      store: MyStore,
 *      props: (state, props) => {
 *          return {
 *              item: state.get('items').filter(item => item.get('id') === props.id)
 *          }
 *      }
 * }])
 * export default class MyComponent extends React.Component {
 *      render() {
 *          const item = this.props.item;
 *      }
 * }
 *
 * Technically, you could also mix all access methods, but this defeats the purpose of simple access:
 *
 * @example
 * @connectToStores([{
 *      store: MyStore,
 *      props: ['someProp', 'anotherProp', (state, props) => {
 *          return {
 *              item: state.get('items').filter(item => item.get('id') === props.id)
 *          }
 *      }, 'some.nested.value as foo']
 * }])
 * export default class MyComponent extends React.Component {
 *      ...
 * }
 *
 * @see https://github.com/goatslacker/alt/blob/master/docs/utils/immutable.md
 * @see https://github.com/goatslacker/alt/blob/master/src/utils/connectToStores.js
 *
 * @param {Array<{store: AltStore, props: Array<string>}>} definitions - A list of objects that each define a store connection
 */
/* eslint-enable */
function connectToImmutableStores(definitions) {
    return function(targetClass) {
        targetClass.getStores = function() {
            return definitions.map((def) => def.store);
        };
        targetClass.getPropsFromStores = function(componentProps) {
            return definitions.reduce((result, def) => {
                if (typeof def.props === 'function') {
                    // the props definition is itself a function. return with its result.
                    return Object.assign(result, def.props(def.store.state, componentProps));
                }
                // the props definition is an array. evaluate and reduce each of its elements
                return def.props.reduce((result, accessor) => {
                    return Object.assign(result, mapProps(accessor, def.store.state, componentProps));
                }, result);
            }, {});
        };
        return connectToStores(targetClass);
    };
}

function mapProps(accessor, state, props) {
    switch (typeof accessor) {
        case 'function':
            return mapFuncAccessor(accessor, state, props);
        case 'string':
            return mapStringAccessor(accessor, state);
    }
}

function mapFuncAccessor(accessor, state, props) {
    return accessor(state, props);
}

function mapStringAccessor(accessor, state) {
    const {keyPath, propName} = parseAccessor(accessor);
    return {
        [propName]: state.getIn(keyPath)
    };
}

/**
 * Takes the accessor defined by the component and retrieves `keyPath` and `propName`
 * The accessor may be the name of a top-level value in the store, or a path to a nested value.
 * Nested values can be accessed using a dot-separated syntax (e.g. `some.nested.value`).
 *
 * The name of the prop received by the component is the last part of the accessor in case of
 * a nested syntax, or the accessor itself in case of a simple top-level accessor.
 *
 * If you need to pass the value using a different prop name, you can use the ` as ` alias syntax,
 * e.g. `someProp as myProp` or `some.prop as myProp`.
 *
 * examples:
 *
 *      'someValue' // {keyPath: ['someValue'], propName: 'someValue'}
 *      'someValue as foo' // {keyPath: ['someValue'], propName: 'foo'}
 *      'some.nested.value' // {keyPath: ['some', 'nested', 'value'], propName: 'value'}
 *      'some.nested.value as foo' // {keyPath: ['some', 'nested', 'value'], propName: 'foo'}
 *
 * @param {string} string - The value accessor passed by the component decorator.
 * @return {object} result - A `{storeName, propName}` object
 * @return {string} result.keyPath - An immutablejs keyPath array to the value in the store
 * @return {string} result.propName - name for the prop as expected by the component
 */
function parseAccessor(accessor) {
    let keyPath, propName;
    if (accessor.indexOf(' as ') > -1) {
        // e.g. 'foo as bar' or 'some.foo as bar'
        const parts = accessor.split(' as ');
        keyPath = parts[0].split('.');
        propName = parts[1];
    }
    else {
        // e.g. 'foo' or 'some.foo'
        keyPath = accessor.split('.');
        propName = keyPath[keyPath.length - 1];
    }
    return {keyPath, propName};
}

export default connectToImmutableStores;
