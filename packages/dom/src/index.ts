import { VNode, DOMDriverOptions, makeDOMDriver, MainDOMSource } from '@cycle/dom';
import { Stream } from 'xstream';

export * from '@cycle/dom';

export const DOM = 'DOM';

export interface DOMSink {
    type : typeof DOM;
    payload : VNode;
}

export function makeMegaDOMDriver<T>(selector : string, sinks : Stream<DOMSink | T>, options? : DOMDriverOptions) : MainDOMSource {
    const dom$ = sinks.filter(isDOM).map(o => o.payload);
    return makeDOMDriver(selector, options)(dom$);
}

export function isDOM(sink : DOMSink | any) : sink is DOMSink {
    return sink.type === DOM;
}

export function wrapDOM(vnode : VNode) : DOMSink {
    return {
        type: DOM,
        payload: vnode
    };
}

