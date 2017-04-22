import { makeHTTPDriver, RequestOptions, HTTPSource } from '@cycle/http';
import { Stream } from 'xstream';

export const HTTP = 'HTTP';

export interface HTTPSink {
    type : typeof HTTP;
    payload : RequestOptions;
}

export function makeMegaHTTPDriver(sinks : Stream<HTTPSink | any>) : HTTPSource {
    const http$ = sinks.filter(isHTTP).map(o => o.payload);
    return makeHTTPDriver()(http$);
}

export function isHTTP(sinks : HTTPSink | any) : sinks is HTTPSink {
    return sinks.type === HTTP;
}

export function wrapHTTP(request : RequestOptions) : HTTPSink {
    return {
        type: HTTP,
        payload: request
    };
}
