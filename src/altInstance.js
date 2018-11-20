/**
 * This is the alt instance that holds the state of the entire application.
 * All stores and actions are created on this instance.
 */

import Alt from 'alt';

let instance;

setAltInstance(new Alt());

export function setAltInstance(alt) {
    if (instance) teardown(instance);
    setup(alt);
}
export function getAltInstance() {
    return instance;
}

export function setup(alt) {
    instance = alt;
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        // Debugging with chrome devtools
        // @see https://github.com/goatslacker/alt-devtool
        require('alt-utils/lib/chromeDebug')(instance);

        // sometimes, chromeDebug just doesn't update until an action is dispatched.
        // we use a dummy action to do just that
        const refreshAction = instance.generateActions('__refresh__').__refresh__;
        instance.handleMessage = e => {
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
