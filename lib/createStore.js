'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = createStore;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _decorators = require('alt-utils/lib/decorators');

var _ImmutableUtil = require('alt-utils/lib/ImmutableUtil');

var _ImmutableUtil2 = _interopRequireDefault(_ImmutableUtil);

var _altInstance = require('./altInstance');

var _ImmutableStore2 = require('./ImmutableStore');

var _ImmutableStore3 = _interopRequireDefault(_ImmutableStore2);

var _getSources = require('./getSources');

var _getSources2 = _interopRequireDefault(_getSources);

var _bindCalls = require('./decorators/bindCalls');

var _bindCalls2 = _interopRequireDefault(_bindCalls);

var _bindActions = require('./decorators/bindActions');

var _bindActions2 = _interopRequireDefault(_bindActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createStore(displayName) {
    var _dec, _dec2, _dec3, _dec4, _class;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        alt = _ref.alt,
        state = _ref.state,
        calls = _ref.calls,
        sources = _ref.sources,
        viewActions = _ref.viewActions;

    if (!displayName) {
        throw new Error('displayName is required');
    }

    alt = alt || (0, _altInstance.getAltInstance)();
    state = state || _immutable2.default.fromJS({});

    calls = calls || [];
    sources = sources || (0, _getSources2.default)(calls);
    viewActions = viewActions || [];

    return alt.createStore((_dec = (0, _decorators.decorate)(alt), _dec2 = (0, _decorators.datasource)(sources), _dec3 = (0, _bindCalls2.default)(calls), _dec4 = (0, _bindActions2.default)(viewActions), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (0, _ImmutableUtil2.default)(_class = function (_ImmutableStore) {
        (0, _inherits3.default)(_class, _ImmutableStore);

        function _class() {
            (0, _classCallCheck3.default)(this, _class);
            return (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(this, state));
        }

        return _class;
    }(_ImmutableStore3.default)) || _class) || _class) || _class) || _class) || _class), displayName);
}