/**
 * Wraps the given object in a Proxy and throws an error when undefined properties are accessed.
 * Useful to prevent subtile bugs due to typos in property names.
 *
 * In unsupported browsers, the original target object is returned.
 *
 * @param {object} target - The target object
 * @return {Proxy|object} - Either a proxy that guards the target object, or the target object itself
 *
 * @see https://www.nczonline.net/blog/2014/04/22/creating-defensive-objects-with-es6-proxies/
 */
export default function createDefensiveObject(target) {
    const {Proxy} = (global || window);
    if (!Proxy) {
        return target;
    }
    return new Proxy(target, {
        get: function(target, property) {
            if (property in target) {
                return target[property];
            } else {
                throw new ReferenceError(`[defensive] Unable to access non-existing property '${property}'`);
            }
        }
    });
}
