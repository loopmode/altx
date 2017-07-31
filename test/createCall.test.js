import test from 'tape';
import Alt from 'alt';
import ActionListeners from 'alt-utils/lib/ActionListeners';

import {createCall, createStore} from '../src';
import {setAltInstance} from '../src/altInstance';

function resetAlt() {
    const alt = new Alt();
    setAltInstance(alt);
    return alt;
}


test('createCall throws without a given name', (t) => {
    resetAlt();
    t.throws(() => createCall());
    t.end();
});
test('createCall does not throw with a given name', (t) => {
    resetAlt();
    t.doesNotThrow(() => createCall('myCall'));
    t.end();
});

test('createCall: define() throws without a given object', (t) => {
    resetAlt();
    const call = createCall('myCall');
    t.throws(() => call.define());
    t.end();
});

test('createCall: define() throws without a proper dataSource', (t) => {
    resetAlt();
    const call = createCall('myCall');
    t.throws(() => call.define({}));
    t.throws(() => call.define({dataSource: {}}));
    t.end();
});

test('createCall: define() does not throw when given a proper dataSource ', (t) => {
    resetAlt();
    const call = createCall('myCall');
    t.doesNotThrow(() => call.define({
        dataSource: {
            remote: () => Promise.resolve()
        }
    }));
    t.end();
});

test('createCall: uses custom named actions', async (t) => {
    const alt = resetAlt();

    let remote = () => Promise.resolve();

    const call = createCall('myCall', {defaultActions: ['foo', 'bar', 'baz']}).define(({actions}) => {
        return {
            dataSource: {
                loading: actions.foo,
                error: actions.bar,
                success: actions.baz,
                remote: () => remote()
            }
        };
    });
    
    const store = createStore('MyStore', {calls: [call]});

    const dispatched = {
        loading: false,
        success: false,
        error: false
    };

    const listeners = new ActionListeners(alt);
    listeners.addActionListener(call.actions.FOO, () => dispatched.loading = true);
    listeners.addActionListener(call.actions.BAR, () => dispatched.error = true);
    listeners.addActionListener(call.actions.BAZ, () => dispatched.success = true);
    
    await store.myCall();
    t.equals(dispatched.loading, true, 'custom loading action dispatched');
    t.equals(dispatched.success, true, 'custom success action dispatched');

    remote = () => Promise.reject(new Error('nok'));
    try {
        await store.myCall();
    }
    catch (error) {
        // do nothing
        // expected error.
    }

    t.equals(dispatched.error, true, 'custom error action dispatched');
    t.end();
});
