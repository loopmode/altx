/** Never log */
const NONE = 0;
/** Log if a definition has `logging: true` */
const ALLOW = 1;
/** Always log, regardless of `logging` in definition */
const FORCE = 2;
export const logLevel = { NONE, ALLOW, FORCE };

let level = ALLOW;
export function setLevel(value) {
    level = value;
}
export function getLevel() {
    return level;
}

export function createLogger(name) {
    return {
        log: (...args) => level > NONE && console.log(`[${name}]`, ...args),
        info: (...args) => level > NONE && console.info(`[${name}]`, ...args),
        warn: (...args) => level > NONE && console.warn(`[${name}]`, ...args),
        error: (...args) => level > NONE && console.error(`[${name}]`, ...args),
        trace: (...args) => level > NONE && console.trace(`[${name}]`, ...args)
    };
}
