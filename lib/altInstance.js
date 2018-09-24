'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setAltInstance = setAltInstance;
exports.getAltInstance = getAltInstance;

var _alt = require('alt');

var _alt2 = _interopRequireDefault(_alt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = void 0;

setAltInstance(new _alt2.default());

function setAltInstance(alt) {
    if (instance) teardown(instance);
    setup(alt);
}
function getAltInstance() {
    return instance;
}

var root = global || window;

function setup(alt) {
    instance = alt;
    if (process.env.NODE_ENV === 'development') {
        require('alt-utils/lib/chromeDebug')(instance);

        var refreshAction = instance.generateActions('__refresh__').__refresh__;
        instance.handleMessage = function (e) {
            if (e.data && e.data.type === 'ALT' && e.data.source === 'alt-devtools') {
                refreshAction.defer();
            }
        };
        root && root.addEventListener && root.addEventListener('message', instance.handleMessage);
    }
}
function teardown() {
    if (process.env.NODE_ENV === 'development') {
        root && root.removeEventListener && root.removeEventListener('message', instance.handleMessage);
    }
}