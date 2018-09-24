export { getAltInstance } from './altInstance';
export { setAltInstance } from './altInstance';

export connect from './decorators/connect';
export bindCalls from './decorators/bindCalls';
export bindHandlers from './decorators/bindHandlers';
export bindActions from './decorators/bindActions';
export bindStorage from './decorators/bindStorage';

export ImmutableStore from './ImmutableStore';
export { resetStores } from './ImmutableStore';

export { connectAlternative } from './decorators/connect';
export callSeries from './callSeries';
export createStore from './createStore';
export callFactory from './callFactory';
export createAction from './createAction';
export createActions from './createActions';
export handlerFactory from './handlerFactory';
export getSources from './getSources';

export ActionListeners from 'alt-utils/lib/ActionListeners';
export { decorate, datasource, bind } from 'alt-utils/lib/decorators';
export immutable from 'alt-utils/lib/ImmutableUtil';
