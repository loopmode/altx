'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setAltInstance = setAltInstance;
exports.getAltInstance = getAltInstance;
exports.setup = setup;

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

function setup(alt) {
    instance = alt;
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        require('alt-utils/lib/chromeDebug')(instance);

        var refreshAction = instance.generateActions('__refresh__').__refresh__;
        instance.handleMessage = function (e) {
            if (e.data && e.data.type === 'ALT' && e.data.source === 'alt-devtools') {
                refreshAction.defer();
            }
        };
        window.addEventListener('message', instance.handleMessage);
    }
}
function teardown() {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && instance) {
        window.removeEventListener('message', instance.handleMessage);
    }
}