/**
 * Reduces a mixed array to a flat one.
 */
export default function flatten(...args) {
    return args.reduce((result, arg) => {
        if (Array.isArray(arg)) {
            arg.forEach(e => {
                if (Array.isArray(e)) {
                    result = result.concat(flatten(e));
                }
                else {
                    result.push(e);
                }
            });
        }
        else {
            result.push(arg);
        }
        return result;
    }, []);
}
