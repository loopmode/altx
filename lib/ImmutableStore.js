'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.resetStores = resetStores;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _transmitter = require('transmitter');

var _transmitter2 = _interopRequireDefault(_transmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

        _classCallCheck(this, ImmutableStore);

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

        if (env.NODE_ENV === 'development') {
            window.postMessage({
                payload: { action: 'REFRESH' },
                source: 'alt-hook'
            }, '*');
        }
    }

    _createClass(ImmutableStore, [{
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
            return this.state.merge(_defineProperty({}, listName || this.listName, this.state.get(listName || this.listName).map(function (item) {
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

                this.change(_defineProperty({}, listName, newList));
            } else {
                throw new Error('changeItem: no item found for filter: ' + JSON.stringify(filter) + ', list:', JSON.stringify(list.toJS()));
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
            Object.keys(filter).map(function (prop) {
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