export default function getSources(calls) {
    return calls.reduce((dataSource, call) => {
        return Object.assign(dataSource, {
            [call.name]: () => call.dataSource
        });
    }, {});
}
