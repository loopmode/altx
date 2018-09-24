'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connectAlternative = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = connect;

var _connectToStores = require('alt-utils/lib/connectToStores');

var _connectToStores2 = _interopRequireDefault(_connectToStores);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connect(definitions) {
    return function (targetClass) {
        targetClass.getStores = function () {
            return definitions.map(function (def) {
                return def.store;
            });
        };
        targetClass.getPropsFromStores = function (componentProps) {
            return definitions.reduce(function (result, def) {
                if (typeof def.props === 'function') {
                    return (0, _assign2.default)(result, def.props(def.store.state, componentProps));
                }

                return def.props.reduce(function (result, accessor) {
                    return (0, _assign2.default)(result, mapProps(accessor, def.store.state, componentProps));
                }, result);
            }, {});
        };
        return (0, _connectToStores2.default)(targetClass);
    };
}

function mapProps(accessor, state, props) {
    switch (typeof accessor === 'undefined' ? 'undefined' : (0, _typeof3.default)(accessor)) {
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
    var _parseAccessor = parseAccessor(accessor),
        keyPath = _parseAccessor.keyPath,
        propName = _parseAccessor.propName;

    return (0, _defineProperty3.default)({}, propName, state.getIn(keyPath));
}

function parseAccessor(accessor) {
    var keyPath = void 0,
        propName = void 0;
    if (accessor.indexOf(' as ') > -1) {
        var parts = accessor.split(' as ');
        keyPath = parts[0].split('.');
        propName = parts[1];
    } else {
        keyPath = accessor.split('.');
        propName = keyPath[keyPath.length - 1];
    }
    return { keyPath: keyPath, propName: propName };
}

function connectAlternative(store, mapStateToProps, WrappedComponent) {
    return function (_React$Component) {
        (0, _inherits3.default)(Connect, _React$Component);

        function Connect(props, context) {
            (0, _classCallCheck3.default)(this, Connect);

            var _this = (0, _possibleConstructorReturn3.default)(this, (Connect.__proto__ || (0, _getPrototypeOf2.default)(Connect)).call(this, props, context));

            _this.handleStoreUpdate = function (state) {
                if (_this._isMounted) {
                    _this.setState({ storeState: mapStateToProps(state, _this.props) });
                }
            };

            var storeState = store.getState();
            _this.state = { storeState: mapStateToProps(storeState, props) };
            return _this;
        }

        (0, _createClass3.default)(Connect, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                this._isMounted = true;
                this.storeSubscription = store.listen(this.handleStoreUpdate);
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this._isMounted = false;
                if (this.storeSubscription) {
                    store.unlisten(this.storeSubscription);
                }
            }
        }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                if (mapStateToProps.length > 1) {
                    this.setState({ storeState: mapStateToProps(store.getState(), nextProps) });
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var mergedProps = (0, _extends3.default)({}, this.props, this.state.storeState);
                return (0, _react.createElement)(WrappedComponent, mergedProps);
            }
        }]);
        return Connect;
    }(_react2.default.Component);
}

exports.connectAlternative = connectAlternative;