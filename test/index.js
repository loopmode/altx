console.warn('[test/index.js]', new Date().toISOString(), '\n----------------------------------------------------------\n');

require('babel-register');

require('./createCall.test');
require('./createStore.test');
