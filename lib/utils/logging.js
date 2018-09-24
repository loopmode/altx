"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setLevel = setLevel;
exports.getLevel = getLevel;
exports.createLogger = createLogger;

var NONE = 0;

var ALLOW = 1;

var FORCE = 2;
var logLevel = exports.logLevel = { NONE: NONE, ALLOW: ALLOW, FORCE: FORCE };

var level = ALLOW;
function setLevel(value) {
    level = value;
}
function getLevel() {
    return level;
}

function createLogger(name) {
    return {
        log: function log() {
            var _console;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return level > NONE && (_console = console).log.apply(_console, ["[" + name + "]"].concat(args));
        },
        info: function info() {
            var _console2;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return level > NONE && (_console2 = console).info.apply(_console2, ["[" + name + "]"].concat(args));
        },
        warn: function warn() {
            var _console3;

            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            return level > NONE && (_console3 = console).warn.apply(_console3, ["[" + name + "]"].concat(args));
        },
        error: function error() {
            var _console4;

            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            return level > NONE && (_console4 = console).error.apply(_console4, ["[" + name + "]"].concat(args));
        },
        trace: function trace() {
            var _console5;

            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            return level > NONE && (_console5 = console).trace.apply(_console5, ["[" + name + "]"].concat(args));
        }
    };
}