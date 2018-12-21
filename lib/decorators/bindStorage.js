'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = bindStorage;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _events = require('@loopmode/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bindStorage() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        storage = _ref.storage,
        keyPaths = _ref.keyPaths,
        parse = _ref.parse,
        encode = _ref.encode,
        logging = _ref.logging;

    if (typeof window === 'undefined') {
        return function (StoreClass) {
            return StoreClass;
        };
    }

    storage = storage || window.localStorage;
    if (storage instanceof window.Storage) {
        parse = parse || JSON.parse;
        encode = encode || _stringify2.default;
    }
    return function decorate(StoreClass) {
        return function (_StoreClass) {
            (0, _inherits3.default)(PersistableStore, _StoreClass);

            function PersistableStore(model) {
                var _this2 = this;

                (0, _classCallCheck3.default)(this, PersistableStore);

                var _this = (0, _possibleConstructorReturn3.default)(this, (PersistableStore.__proto__ || (0, _getPrototypeOf2.default)(PersistableStore)).call(this, model));

                _this.persistenceEnable = function (_ref2) {
                    var storage = _ref2.storage,
                        keyPaths = _ref2.keyPaths;

                    _this.persistenceConfig = {
                        storage: storage,
                        name: 'persisted.' + _this.displayName,
                        keyPaths: keyPaths && keyPaths.map(function (keyPath) {
                            if (typeof keyPath === 'string') return keyPath.split('.');
                            return keyPath;
                        })
                    };

                    if (logging) {
                        console.log('[PersistableStore] persistenceEnable', { store: _this });
                    }

                    _events2.default.on('beforeunload', _this.persistenceBeforeUnload);

                    _this.persistenceRestore();
                };

                _this.persistenceBeforeUnload = function () {
                    _this.persistenceSave();
                };

                _this.persistenceDisable = function () {
                    if (logging) {
                        console.log('[PersistableStore] persistenceDisable', { store: _this });
                    }

                    _events2.default.off('beforeunload', _this.persistenceBeforeUnload);
                };

                _this.persistenceClear = function () {
                    _this.initialData = _this._initialDataWithoutPersistence || _this.initialData;
                    var _this$persistenceConf = _this.persistenceConfig,
                        storage = _this$persistenceConf.storage,
                        name = _this$persistenceConf.name;

                    _this.persistenceDisable();
                    storage.removeItem(name);
                    console.log('[PersistableStore] "' + name + '" cleared. Please refresh the window');
                };

                _this.persistenceRestore = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                    var _this$persistenceConf2, _storage, name, data, nextState;

                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;
                                    _this$persistenceConf2 = _this.persistenceConfig, _storage = _this$persistenceConf2.storage, name = _this$persistenceConf2.name;
                                    _context.next = 4;
                                    return _storage.getItem(name);

                                case 4:
                                    data = _context.sent;

                                    if (data) {
                                        if (parse) data = parse(data);

                                        data = _immutable2.default.fromJS(data);
                                        _this.persistenceExtendInitialData(data);

                                        nextState = _this.state.mergeDeep(data);


                                        if (logging) {
                                            console.log('[PersistableStore] persistenceRestore', { store: _this, data: data, nextState: nextState });
                                        }

                                        _this.setState(nextState);
                                    }
                                    _context.next = 11;
                                    break;

                                case 8:
                                    _context.prev = 8;
                                    _context.t0 = _context['catch'](0);

                                    console.warn('[PersistableStore] persistenceRestore failed', { error: _context.t0, store: _this });

                                case 11:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this2, [[0, 8]]);
                }));
                _this.persistenceSave = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                    var _this$persistenceConf3, _storage2, name, _keyPaths, data;

                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.prev = 0;
                                    _this$persistenceConf3 = _this.persistenceConfig, _storage2 = _this$persistenceConf3.storage, name = _this$persistenceConf3.name, _keyPaths = _this$persistenceConf3.keyPaths;
                                    data = _this.state;


                                    if (_keyPaths && _keyPaths.length) {
                                        data = _keyPaths.reduce(function (result, keyPath) {
                                            return result.setIn(keyPath, _this.state.getIn(keyPath));
                                        }, _immutable2.default.fromJS({}));
                                    }

                                    data = data.toJS();

                                    if (encode) data = encode(data);

                                    if (logging) {
                                        console.log('[PersistableStore] persistenceRestore', { store: _this, data: data });
                                    }

                                    _context2.next = 9;
                                    return _storage2.setItem(name, data);

                                case 9:
                                    _context2.next = 14;
                                    break;

                                case 11:
                                    _context2.prev = 11;
                                    _context2.t0 = _context2['catch'](0);

                                    console.warn('[PersistableStore] persistenceSave failed', { error: _context2.t0, store: _this });

                                case 14:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this2, [[0, 11]]);
                }));

                _this.persistenceExtendInitialData = function (persistedData) {
                    if (!_this.initialData) {
                        return;
                    }
                    var wasImmutable = typeof _this.initialData.toJS === 'function';
                    _this._initialDataWithoutPersistence = _this.initialData;
                    _this.initialData = _immutable2.default.fromJS(_this.initialData).mergeDeep(persistedData);
                    if (!wasImmutable) {
                        _this.initialData = _this.initialData.toJS();
                    }
                };

                _this.persistenceEnable({ storage: storage, keyPaths: keyPaths });
                _this.exportPublicMethods({
                    persistenceEnable: function persistenceEnable() {
                        return _this.persistenceEnable({ storage: storage, keyPaths: keyPaths });
                    },
                    persistenceDisable: function persistenceDisable() {
                        return _this.persistenceDisable();
                    },
                    persistenceClear: function persistenceClear() {
                        return _this.persistenceClear();
                    }
                });
                return _this;
            }

            return PersistableStore;
        }(StoreClass);
    };
}