console.warn('[test/index.js]', new Date().toISOString(), '\n----------------------------------------------------------\n');

require('babel-register');

require('./callFactory.test');
require('./createStore.test');
