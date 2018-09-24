'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = callSeries;
function callSeries(calls) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$log = _ref.log,
        log = _ref$log === undefined ? false : _ref$log;

    return new Promise(function (resolve, reject) {
        var results = [];
        setTimeout(function () {
            function series(list) {
                log && console.log('[callSeries] list', list);
                var p = Promise.resolve();
                return list.reduce(function (pacc, fn) {
                    return pacc = pacc.then(function (res) {
                        log && console.log('[callSeries] res', res);
                        results.push(res);
                        return fn(res);
                    });
                }, p);
            }
            series(calls).then(function () {
                return setTimeout(function () {
                    return resolve(results);
                });
            }).catch(function (err) {
                return reject(err);
            });
        });
    });
}