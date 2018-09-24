'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = handlerFactory;

var _createActions = require('./createActions');

var _createActions2 = _interopRequireDefault(_createActions);

var _logging = require('./utils/logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handlerFactory(action) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$namespace = _ref.namespace,
        namespace = _ref$namespace === undefined ? 'global' : _ref$namespace,
        _ref$logger = _ref.logger,
        logger = _ref$logger === undefined ? (0, _logging.createLogger)(action.id || action) : _ref$logger;

    var name = action.id || action;
    action = typeof action === 'string' ? (0, _createActions2.default)(namespace, action)[action] : action;
    return {
        create: function create(createDefinition) {
            var definition = {
                name: name,
                action: action,
                namespace: namespace,
                logger: logger
            };
            if (typeof createDefinition === 'function') {
                return Object.assign(definition, createDefinition({ namespace: namespace, logger: logger }));
            } else {
                return Object.assign(definition, createDefinition);
            }
        }
    };
}