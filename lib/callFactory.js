'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = callFactory;

var _validate = require('./utils/validate');

var _logging = require('./utils/logging');

var _createActions2 = require('./createActions');

var _createActions3 = _interopRequireDefault(_createActions2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function callFactory(name) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$namespace = _ref.namespace,
        namespace = _ref$namespace === undefined ? 'global' : _ref$namespace,
        _ref$defaultActions = _ref.defaultActions,
        defaultActions = _ref$defaultActions === undefined ? ['loading', 'error', 'success'] : _ref$defaultActions,
        _ref$actions = _ref.actions,
        actions = _ref$actions === undefined ? (0, _createActions3.default)(namespace + ':' + name, defaultActions) : _ref$actions,
        _ref$logger = _ref.logger,
        logger = _ref$logger === undefined ? (0, _logging.createLogger)(namespace + ':' + name) : _ref$logger;

    var errors = (0, _validate.validateCreator)({ name: name, actions: actions, logger: logger }, logger);
    var errorKeys = errors && Object.keys(errors);
    if (errorKeys && errorKeys.length) {
        throw new Error(errors[errorKeys[0]]);
    }

    return {
        name: name,
        actions: actions,

        create: function create(definition) {
            var createDefinition = typeof definition === 'function' ? definition : function () {
                return definition;
            };
            var call = Object.assign(createDefinition({ name: name, actions: actions, logger: logger }), {
                name: name,
                actions: actions,
                logger: logger
            });
            if ((0, _validate.validateDefinition)(call, logger)) {
                throw new Error('Invalid call');
            }
            call.dataSource = _extends({}, call.actions || {}, call.dataSource || {});
            return call;
        },
        createActions: function createActions(actionNames) {
            return (0, _createActions3.default)(namespace + ':' + name, actionNames);
        }
    };
}