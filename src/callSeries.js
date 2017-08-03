/**
 * Returns a promise and executes a series of functions that each return a promise.
 * Uses an initial 0-timeout so that we don't run into "Cannot dispatch in the middle of a dispatch" errors in case
 * one of the calls triggers a `loading` action
 *
 * @example
 * import {callSeries} from '@xailabs/altx';
 * const calls = [
 *      () => fetch('foo'),
 *      () => fetch('bar'),
 *      () => new Promise((resolve) => setTimeout(resolve, 1000)),
 * ];
 * callSeries(calls).then(console.log)
 *
 * @param {array} calls - An array of function that each returns a promise
 * @param {object} options - An object with additional options
 * @param {boolean} options.log - Whether to log each individual call to the console
 * @return {promise} - A promise that will be resolved when all calls succeeded or rejected if at least one call failed
 */
export default function callSeries(calls, {log = false} =  {}) {
    return new Promise((resolve, reject) => {
        let results = [];
        setTimeout(() => {
            function series(list) {
                log && console.log('[callSeries] list', list);
                var p = Promise.resolve();
                return list.reduce(function(pacc, fn) {
                    return pacc = pacc.then(res => {
                        log && console.log('[callSeries] res', res);
                        results.push(res);
                        return fn(res);
                    });
                }, p);
            }
            series(calls)
                .then(() => setTimeout(() => resolve(results)))
                .catch((err) => reject(err));
        });
    });
}
