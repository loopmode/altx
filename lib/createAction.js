'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAction;

var _createActions = require('./createActions');

var _createActions2 = _interopRequireDefault(_createActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAction(name) {
  var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

  var actions = (0, _createActions2.default)(namespace, [name]);
  return actions;
}