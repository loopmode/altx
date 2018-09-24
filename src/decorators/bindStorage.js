import Immutable from 'immutable';
import Events from '@loopmode/events';

/**
 * Decorator for ImmutableStore to persist values across browser refresh.
 *
 * Supports `window.localStorage` and `window.sessionStorage` as well as `localForage` or any other backend that implements the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
 * The storage backend may return promises for asynchronous usage.
 *
 * To store only specific parts of the state, provide a `keyPaths` array. Omit `keyPaths` to persist the entire state of the store.
 *
 * @param {Object} options
 * @param {Array<Array|String>} [options.keyPaths] - An array of keyPaths. Each keyPath can be an array of strings as used in Immutable.js, e.g. `['foo', 'bar']` or a string with dot delimiters, e.g. `'foo.bar'`
 * @param {Object} [options.storage=window.localStorage] - An object that supports the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) methods
 * @param {Function} [options.parse] - A function that receives the persisted value and returns the data object. Defaults to `JSON.parse` if `storage` is an instance of `window.Storage`
 * @param {Function} [options.encode] - A function that receives the data object and returns the value to be persisted. Defaults to `JSON.stringify` if `storage` is an instance of `window.Storage`
 * @param {Boolean} [options.logging] - Whether to log details to the console during operations
 * @return {Function} - The decorator function for the target store
 */
export default function bindStorage({ storage = window.localStorage, keyPaths, parse, encode, logging } = {}) {
    if (storage instanceof window.Storage) {
        parse = parse || JSON.parse;
        encode = encode || JSON.stringify;
    }
    return function decorate(StoreClass) {
        return class PersistableStore extends StoreClass {
            constructor(model) {
                super(model);
                this.persistenceEnable({ storage, keyPaths });
                this.exportPublicMethods({
                    persistenceEnable: () => this.persistenceEnable({ storage, keyPaths }),
                    persistenceDisable: () => this.persistenceDisable()
                });
            }

            persistenceEnable = ({ storage, keyPaths }) => {
                this.persistenceConfig = {
                    storage,
                    name: `persisted.${this.displayName}`,
                    keyPaths:
                        keyPaths &&
                        keyPaths.map(keyPath => {
                            if (typeof keyPath === 'string') return keyPath.split('.');
                            return keyPath;
                        })
                };

                if (logging) {
                    console.log('[PersistableStore] persistenceEnable', { store: this });
                }

                Events.on('beforeunload', this.persistenceSave);

                this.persistenceRestore();
            };
            persistenceDisable = () => {
                if (logging) {
                    console.log('[PersistableStore] persistenceDisable', { store: this });
                }

                Events.off('beforeunload', this.persistenceSave);
            };
            persistenceRestore = async () => {
                try {
                    const { storage, name } = this.persistenceConfig;
                    let data = await storage.getItem(name);
                    if (data) {
                        if (parse) data = parse(data);

                        data = Immutable.fromJS(data);
                        this.persistenceExtendInitialData(data);

                        const nextState = this.state.mergeDeep(data);

                        if (logging) {
                            console.log('[PersistableStore] persistenceRestore', { store: this, data, nextState });
                        }

                        this.setState(nextState);
                    }
                } catch (error) {
                    console.warn('[PersistableStore] persistenceRestore failed', { error, store: this });
                }
            };
            persistenceSave = async () => {
                try {
                    const { storage, name, keyPaths } = this.persistenceConfig;
                    let data = this.state;

                    if (keyPaths && keyPaths.length) {
                        data = keyPaths.reduce(
                            (result, keyPath) => result.setIn(keyPath, this.state.getIn(keyPath)),
                            Immutable.fromJS({})
                        );
                    }

                    data = data.toJS();

                    if (encode) data = encode(data);

                    if (logging) {
                        console.log('[PersistableStore] persistenceRestore', { store: this, data });
                    }

                    await storage.setItem(name, data);
                } catch (error) {
                    console.warn('[PersistableStore] persistenceSave failed', { error, store: this });
                }
            };
            persistenceExtendInitialData = persistedData => {
                if (!this.initialData) {
                    return;
                }
                const wasImmutable = typeof this.initialData.toJS === 'function';
                this.initialData = Immutable.fromJS(this.initialData).mergeDeep(persistedData);
                if (!wasImmutable) {
                    this.initialData = this.initialData.toJS();
                }
            };
        };
    };
}
