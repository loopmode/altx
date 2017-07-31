import test from 'tape';
import Alt from 'alt';

import {createCall} from '../src';
import {setAltInstance} from '../src/altInstance';

test('createCall throws without a given name', function (t) {
    setAltInstance(new Alt());
    t.throws(() => createCall());
    t.end();
});
test('createCall does not throw with a given name', function (t) {
    setAltInstance(new Alt());
    t.doesNotThrow(() => createCall('myCall'));
    t.end();
});

test('createCall: define() throws without a given object', function (t) {
    setAltInstance(new Alt());
    const call = createCall('someCall');
    t.throws(() => call.define());
    t.end();
});

test('createCall: define() throws without a proper dataSource', function (t) {
    setAltInstance(new Alt());
    const call = createCall('someCall');
    t.throws(() => call.define({}));
    t.throws(() => call.define({dataSource: {}}));
    t.end();
});

test('createCall: define() does not throw when given a proper dataSource ', function (t) {
    setAltInstance(new Alt());
    const call = createCall('someCall');
    t.doesNotThrow(() => call.define({dataSource: {
        remote: () => Promise.resolve()
    }}));
    t.end();
});
