let instance;

export function setAltInstance(alt) {
    instance = alt;
}
export function getAltInstance() {
    if (!instance) {
        throw new Error('No alt instance specified - did you forget to call setAlt(instance) initially?');
    }
    return instance;
}
