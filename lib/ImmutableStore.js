'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.resetStores = resetStores;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _transmitter = require('transmitter');

var _transmitter2 = _interopRequireDefault(_transmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reset = (0, _transmitter2.default)();
function resetStores() {
    reset.publish();
}

var ImmutableStore = function () {
    function ImmutableStore(initialData) {
        var _this = this;

        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$env = _ref.env,
            env = _ref$env === undefined ? process.env : _ref$env,
            _ref$listName = _ref.listName,
            listName = _ref$listName === undefined ? 'items' : _ref$listName;

        (0, _classCallCheck3.default)(this, ImmutableStore);

        _initialiseProps.call(this);

        this.listName = listName;

        this.exportPublicMethods({
            getItemById: this.getItemById,
            getIndexById: this.getIndexById,
            find: this.find,
            reset: this.reset
        });
        if (initialData) {
            this.init(initialData);
        }
        reset.subscribe(function () {
            var data = _this.initialData || {};
            var nextState = data.toJS ? data : _immutable2.default.fromJS(data);
            _this.setState(nextState);
        });

        if (env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            window.postMessage({
                payload: { action: 'REFRESH' },
                source: 'alt-hook'
            }, '*');
        }
    }

    (0, _createClass3.default)(ImmutableStore, [{
        key: 'init',
        value: function init(data) {
            this.initialData = data;
            this.state = data.toJS ? data : _immutable2.default.fromJS(data);
            return this.state;
        }
    }, {
        key: 'change',
        value: function change(prop, value) {
            if (arguments.length === 2 && typeof prop !== 'string') {
                this.changeItem(prop, value);
            } else if (arguments.length === 2) {
                this.setState(this.state.set(prop, value.toJS ? value : _immutable2.default.fromJS(value)));
            } else {
                this.setState(this.state.merge(prop.toJS ? prop : _immutable2.default.fromJS(prop)));
            }
        }
    }, {
        key: 'setItemProp',
        value: function setItemProp(id, key, value, listName) {
            return this.state.merge((0, _defineProperty3.default)({}, listName || this.listName, this.state.get(listName || this.listName).map(function (item) {
                if (item.get('id') === id) {
                    return item.set(key, value);
                }
                return item;
            })));
        }
    }, {
        key: 'changeItem',
        value: function changeItem(filter, data) {
            var listName = filter.list || this.listName;
            var list = this.state.get(listName);

            var matchingItem = this.find(listName, filter.item);
            if (matchingItem) {
                var matchingIndex = list.indexOf(matchingItem);
                var newItem = matchingItem.merge(data);
                var newList = list.set(matchingIndex, newItem);

                this.change((0, _defineProperty3.default)({}, listName, newList));
            } else {
                throw new Error('changeItem: no item found for filter: ' + (0, _stringify2.default)(filter) + ', list:', (0, _stringify2.default)(list.toJS()));
            }
        }
    }, {
        key: 'useApi',
        value: function useApi() {
            return this.getInstance();
        }
    }]);
    return ImmutableStore;
}();

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.reset = function () {
        _this2.change(_this2.initialData);
    };

    this.getItemById = function (id, listName) {
        var list = _this2.state.get(listName || _this2.listName);
        if (list) {
            return list.find(function (item) {
                return item.get('id') === id;
            });
        } else {
            console.warn(_this2, 'Failed in getItemById(): list not found');
        }
        return null;
    };

    this.getIndexById = function (id, listName) {
        listName = listName || _this2.listName;
        var list = _this2.state.get(listName);
        if (list) {
            return list.indexOf(_this2.getItemById(id, listName));
        }
        console.warn(_this2, 'Failed in getIndexById(): list not found');
        return -1;
    };

    this.find = function (listName, filter) {
        var list = _this2.state.get(listName);
        var result = list.find(function (item) {
            var match = true;
            (0, _keys2.default)(filter).map(function (prop) {
                var itemValue = item.get(prop);
                var filterValue = filter[prop];
                if (itemValue !== filterValue) {
                    match = false;
                }
            });
            return match;
        });
        return result;
    };
};

exports.default = ImmutableStore;