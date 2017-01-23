import alt, {resetSignal, noop} from 'app/alt';
import {bind} from 'alt-utils/lib/decorators';

import {decorate, datasource} from 'alt-utils/lib/decorators';
import immutable from 'alt-utils/lib/ImmutableUtil';

import bindViewActions from 'common/alt/decorators/bindViewActions';
import bindCalls from 'common/alt/decorators/bindCalls';

export default function createStore(displayName, {actions, calls, data, sources}) {
    return alt.createStore(
        @decorate(alt)
        @datasource(sources)
        @bindCalls(calls)
        @bindViewActions(actions)
        @immutable
        class {
            constructor() {
                this.state = this.initialState = data;
                resetSignal.subscribe(() => this.reset());
            }
            reset() {
                this.setState(this.initialState);
            }
            /** refreshes the alt devtool, workaround for missing/broken initial formatting */
            @bind(noop)
            noop() {}
        }
    , displayName);
};
