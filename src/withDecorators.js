/**
 * use this when decorator syntax is not available
 */
export default function withDecorators(decorators, Store) {
    let i = decorators.length;
    let decorate;
    while (i-- > 0) {
        decorate = decorators[i];
        Store = decorate(Store);
    }
    return Store;
}
