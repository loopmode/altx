"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = flatten;
function flatten() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return args.reduce(function (result, arg) {
        if (Array.isArray(arg)) {
            arg.forEach(function (e) {
                if (Array.isArray(e)) {
                    result = result.concat(flatten(e));
                } else {
                    result.push(e);
                }
            });
        } else {
            result.push(arg);
        }
        return result;
    }, []);
}