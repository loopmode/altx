'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connectAlternative = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = connect;

var _connectToStores = require('alt-utils/lib/connectToStores');

var _connectToStores2 = _interopRequireDefault(_connectToStores);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
                    return Object.assign(result, def.props(def.store.state, componentProps));
                }

                return def.props.reduce(function (result, accessor) {
                    return Object.assign(result, mapProps(accessor, def.store.state, componentProps));
                }, result);
            }, {});
        };
        return (0, _connectToStores2.default)(targetClass);
    };
}

function mapProps(accessor, state, props) {
    switch (typeof accessor === 'undefined' ? 'undefined' : _typeof(accessor)) {
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

    return _defineProperty({}, propName, state.getIn(keyPath));
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
        _inherits(Connect, _React$Component);

        function Connect(props, context) {
            _classCallCheck(this, Connect);

            var _this = _possibleConstructorReturn(this, (Connect.__proto__ || Object.getPrototypeOf(Connect)).call(this, props, context));

            _this.handleStoreUpdate = function (state) {
                if (_this._isMounted) {
                    _this.setState({ storeState: mapStateToProps(state, _this.props) });
                }
            };

            var storeState = store.getState();
            _this.state = { storeState: mapStateToProps(storeState, props) };
            return _this;
        }

        _createClass(Connect, [{
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
                var mergedProps = _extends({}, this.props, this.state.storeState);
                return (0, _react.createElement)(WrappedComponent, mergedProps);
            }
        }]);

        return Connect;
    }(_react2.default.Component);
}

exports.connectAlternative = connectAlternative;