import Promise from 'promise';
/**
 * Retuns a promise and executes a series of calls.
 * Uses a timeout initially so that we don't run into errors when still in the middle of a dispatch.
 *
 *  import {callSeries} from 'shared/flux';
 *
 * @param {array} calls - An array of function that each returns a promise
 * @param {object} options - An array of function that each returns a promise
 * @param {boolean} options.log - Whether to log individual calls
 * @return {promise} - A promise that will be resolved when all calls succeeded or rejected if one call failed
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
