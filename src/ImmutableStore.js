import Immutable from 'immutable';
import transmitter from 'transmitter';

const reset = transmitter();
export function resetStores() {
    reset.publish();
}

export default class ImmutableStore {
    constructor(initialData) {
        this.listName = 'items';
        this.exportPublicMethods({
            getItemById: this.getItemById,
            getIndexById: this.getIndexById,
            find: this.find,
            reset: this.reset
        });
        if (initialData) {
            this.init(initialData);
        }
        reset.subscribe(() => {
            const data = this.initialData || {};
            const nextState = data.toJS ? data : Immutable.fromJS(data);
            this.setState(nextState);
        });

        if (process.env.NODE_ENV === 'development') {
            window.postMessage(
                {
                    payload: { action: 'REFRESH' },
                    source: 'alt-hook'
                },
                '*'
            );
        }
    }

    init(data) {
        this.initialData = data;
        this.state = data.toJS ? data : Immutable.fromJS(data);
        return this.state;
    }

    reset = () => {
        this.change(this.initialData);
    };

    getItemById = (id, listName) => {
        const list = this.state.get(listName || this.listName);
        if (list) {
            return list.find(item => item.get('id') === id);
        } else {
            console.warn(this, 'Failed in getItemById(): list not found');
            //debugger; //eslint-disable-line
        }
        return null;
    };

    getIndexById = (id, listName) => {
        listName = listName || this.listName;
        const list = this.state.get(listName);
        if (list) {
            return list.indexOf(this.getItemById(id, listName));
        }
        console.warn(this, 'Failed in getIndexById(): list not found');
        return -1;
    };

    /**
     * Changes a property to a new value.
     * There are three modes of calling this function:
     *
     * __change('key', value)__
     * changes one property of the state object.
     * @see https://facebook.github.io/immutable-js/docs/#/Map/set
     *
     * __change({key: value, ...})__
     * changes any number of state properties at once
     * @see https://facebook.github.io/immutable-js/docs/#/Map/mergeDeep
     *
     * __change({id:5}, {key: value})__
     * changes any number of properties on any matching item within a list
     * @see {@link #changeItem()}
     * @see https://facebook.github.io/immutable-js/docs/#/Map/mergeDeep
     */
    change(prop, value) {
        if (arguments.length === 2 && typeof prop !== 'string') {
            this.changeItem(prop, value);
        } else if (arguments.length === 2) {
            this.setState(this.state.set(prop, value.toJS ? value : Immutable.fromJS(value)));
        } else {
            this.setState(this.state.merge(prop.toJS ? prop : Immutable.fromJS(prop)));
        }
    }

    setItemProp(id, key, value, listName) {
        return this.state.merge({
            [listName || this.listName]: this.state.get(listName || this.listName).map(item => {
                if (item.get('id') === id) {
                    return item.set(key, value);
                }
                return item;
            })
        });
    }

    /**
     * Changes a specific item in a list within the state object.
     * @throws Error if when no item could be found
     * @param {object} filter
     * @param {object} filter.item - An object that specifies key/value pairs that must be matched by list items, e.g. {id: 13}
     * @param {string} [filter.list] - The name of the list to search in. Defaults to 'items'
     * @param {object} data - An object containing key/value pairs for data to be set at matched items
     */
    changeItem(filter, data) {
        //console.log('changeItem', filter, data);
        const listName = filter.list || this.listName;
        const list = this.state.get(listName);
        //console.log('list found', list.toJS());
        const matchingItem = this.find(listName, filter.item);
        if (matchingItem) {
            //console.log('item found', matchingItem);
            const matchingIndex = list.indexOf(matchingItem);
            const newItem = matchingItem.merge(data);
            const newList = list.set(matchingIndex, newItem);
            //console.log('new list', newList.toJS());
            this.change({
                [listName]: newList
            });
        } else {
            throw new Error(
                'changeItem: no item found for filter: ' + JSON.stringify(filter) + ', list:',
                JSON.stringify(list.toJS())
            );
        }
    }

    /**
     * Returns a list of items that match a filter.
     *
     * @param {string} listName - The name of the list within the state object.
     * @param {object} filter - An object with key/value pairs to test items against
     * @returns {List} A new immutable list that only contains items that matched all key/value pairs of `filter`
     */
    find = (listName, filter) => {
        const list = this.state.get(listName);
        const result = list.find(item => {
            let match = true;
            Object.keys(filter).map(prop => {
                const itemValue = item.get(prop);
                const filterValue = filter[prop];
                if (itemValue !== filterValue) {
                    match = false;
                }
            });
            return match;
        });
        return result;
    };

    useApi() {
        return this.getInstance();
    }
}
