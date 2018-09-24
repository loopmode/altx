'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = bindStorage;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _events = require('@loopmode/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function bindStorage() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$storage = _ref.storage,
        storage = _ref$storage === undefined ? window.localStorage : _ref$storage,
        keyPaths = _ref.keyPaths,
        parse = _ref.parse,
        encode = _ref.encode,
        logging = _ref.logging;

    if (storage instanceof window.Storage) {
        parse = parse || JSON.parse;
        encode = encode || JSON.stringify;
    }
    return function decorate(StoreClass) {
        return function (_StoreClass) {
            _inherits(PersistableStore, _StoreClass);

            function PersistableStore(model) {
                var _this2 = this;

                _classCallCheck(this, PersistableStore);

                var _this = _possibleConstructorReturn(this, (PersistableStore.__proto__ || Object.getPrototypeOf(PersistableStore)).call(this, model));

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

                    _events2.default.on('beforeunload', _this.persistenceSave);

                    _this.persistenceRestore();
                };

                _this.persistenceDisable = function () {
                    if (logging) {
                        console.log('[PersistableStore] persistenceDisable', { store: _this });
                    }

                    _events2.default.off('beforeunload', _this.persistenceSave);
                };

                _this.persistenceRestore = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var _this$persistenceConf, _storage, name, data, nextState;

                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;
                                    _this$persistenceConf = _this.persistenceConfig, _storage = _this$persistenceConf.storage, name = _this$persistenceConf.name;
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
                _this.persistenceSave = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                    var _this$persistenceConf2, _storage2, name, _keyPaths, data;

                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.prev = 0;
                                    _this$persistenceConf2 = _this.persistenceConfig, _storage2 = _this$persistenceConf2.storage, name = _this$persistenceConf2.name, _keyPaths = _this$persistenceConf2.keyPaths;
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
                    }
                });
                return _this;
            }

            return PersistableStore;
        }(StoreClass);
    };
}