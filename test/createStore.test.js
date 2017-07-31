import test from 'tape';
import {createStore} from '../src';
import {setAltInstance} from '../src';
import Alt from 'alt';

test('createStore: uses alt instance specified globally', function (t) {
    const alt = new Alt();
    setAltInstance(alt);
    const store = createStore({displayName: 'MyStore'});
    t.equals(store.alt, alt);
    t.end();
});
test('createStore: uses specified alt instance', function (t) {
    const alt = new Alt();
    const store = createStore({displayName: 'MyStore', alt: alt});
    t.equals(store.alt, alt);
    t.end();
});
test('createStore: throws when displayName is missing', function (t) {
    function createBlank() {
        return createStore();
    }
    t.throws(createBlank, /displayName is required/);
    t.end();
});
test('createStore: does not throw if displayName is specified', function (t) {
    function createNamed() {
        return createStore({displayName: 'MyStore'});
    }
    t.doesNotThrow(createNamed, /displayName is required/);
    t.end();
});
test('createStore: uses specified displayName', function (t) {
    setAltInstance(new Alt());
    const store = createStore({displayName: 'MyStore'});
    t.equals(store.displayName, 'MyStore');
    t.end();
});


