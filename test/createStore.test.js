import test from 'tape'
import Alt from 'alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';

import {createStore, createCall, getSources, setAltInstance} from '../src';


function resetAlt() {
    const alt = new Alt();
    setAltInstance(alt);
    return alt;
}


test('createStore: uses alt instance specified globally', (t) => {
    const alt = new Alt();
    setAltInstance(alt);
    const store = createStore('MyStore');
    t.equals(store.alt, alt);
    t.end();
});
test('createStore: uses specified alt instance', (t) => {
    const alt = new Alt();
    const store = createStore('MyStore', {alt: alt});
    t.equals(store.alt, alt);
    t.end();
});
test('createStore: throws when displayName is missing', (t) => {
    resetAlt();
    t.throws(() => createStore(), /displayName is required/);
    t.end();
});
test('createStore: does not throw if displayName is specified', (t) => {
    resetAlt();
    t.doesNotThrow(() => createStore('MyStore'), /displayName is required/);
    t.end();
});
test('createStore: uses specified displayName', (t) => {
    resetAlt();
    const store = createStore('MyStore');
    t.equals(store.displayName, 'MyStore');
    t.end();
});




test('createStore: bound calls are exposed as store methods', (t) => {
    resetAlt();
    const call = createCall('myCall').define({
        dataSource: {
            remote: () => Promise.resolve()
        }
    });
    const calls = [call];
    const store = createStore('MyStore', {calls});
    t.equals(typeof store.myCall, 'function');
    t.end();
});



test('createStore: bound calls dispatch lifecycle actions', async (t) => {

    const alt = resetAlt();
    const goodCall = createCall('goodCall').define({
        dataSource: {
            remote: () => Promise.resolve('ok')
        }
    });
    const badCall = createCall('badCall').define({
        dataSource: {
            remote: () => Promise.reject(new Error('nok'))
        }
    });
    const store = createStore('MyStore', {
        calls: [
            goodCall,
            badCall
        ]
    });

    const dispatched = {
        goodCall: {
            loading: false,
            error: false,
            success: false
        },
        badCall: {
            loading: false,
            error: false,
            success: false
        }
    };


    const listeners = new ActionListeners(alt);

    listeners.addActionListener(goodCall.actions.LOADING, () => dispatched.goodCall.loading = true);
    listeners.addActionListener(goodCall.actions.ERROR, () => dispatched.goodCall.error = true);
    listeners.addActionListener(goodCall.actions.SUCCESS, () => dispatched.goodCall.success = true);

    listeners.addActionListener(badCall.actions.LOADING, () => dispatched.badCall.loading = true);
    listeners.addActionListener(badCall.actions.ERROR, () => dispatched.badCall.error = true);
    listeners.addActionListener(badCall.actions.SUCCESS, () => dispatched.badCall.success = true);

    await store.goodCall();

    try {
        await store.badCall();
    }
    catch (error) {
        // do nothing here.
        // this is support to throw - we want to assert that the error action was dispatched.
    }


    t.equals(dispatched.goodCall.loading, true, 'lifecycle: loading action dispatched');
    t.equals(dispatched.goodCall.error, false, 'lifecycle: error action not dispatched');
    t.equals(dispatched.goodCall.success, true, 'lifecycle: success action dispatched');

    t.equals(dispatched.badCall.loading, true, 'lifecycle: loading action dispatched');
    t.equals(dispatched.badCall.error, true, 'lifecycle: error action not dispatched');
    t.equals(dispatched.badCall.success, false, 'lifecycle: success action not dispatched');


    t.end();
});

