import Immutable from 'immutable';
import { decorate, datasource, bind } from 'alt-utils/lib/decorators';
import immutable from 'alt-utils/lib/ImmutableUtil';

import {getAltInstance} from './altInstance';
import ImmutableStore from './ImmutableStore';

import bindCalls from './decorators/bindCalls';
import bindActions from './decorators/bindActions';

export default function createStore({
    displayName,
    alt = getAltInstance(),
    model = Immutable.fromJS({}),
    sources = [],
    calls = [],
    viewActions = []
} = {}) {

    if (!displayName) {
        throw new Error('displayName is required');
    }

    return alt.createStore((
        @decorate(alt)
        @datasource(sources)
        @bindCalls(calls)
        @bindActions(viewActions)
        @immutable
        class extends ImmutableStore {
            constructor() {
                super(model);
            }
        }
    ), displayName);

}
