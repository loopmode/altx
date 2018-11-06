"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = withDecorators;
function withDecorators(decorators, Store) {
    var i = decorators.length;
    var decorate = void 0;
    while (i-- > 0) {
        decorate = decorators[i];
        Store = decorate(Store);
    }
    return Store;
}