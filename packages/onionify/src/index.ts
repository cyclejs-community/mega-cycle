import onionify from 'cycle-onionify';
export * from 'cycle-onionify';

export const onion = '@mega-cycle/onionify';

export interface OnionSink {
    type : typeof onion;
    payload : (a : any) => any;
}

export function megaOnionify<A, B>(app : (s : A) => B) : (s : A) => B {
    return sources => onionify(s => {
        const sinks = app(s as any) as any;
        return {
            onion: sinks.filter(isOnion).map(o => o.payload),
            rest: sinks
        };
    })(sources).rest;
}

export function isOnion(sink : OnionSink | any) : sink is OnionSink {
    return sink.type === onion;
}

export function wrapOnion(reducer : (s : any) => any) : OnionSink {
    return {
        type: onion,
        payload: reducer
    };
}
