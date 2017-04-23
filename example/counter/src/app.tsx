import xs, { Stream } from 'xstream';
import { VNode, DOMSource, DOMSink, wrapDOM } from '@mega-cycle/dom';
import { OnionSink , wrapOnion } from '@mega-cycle/onionify';

import { Sources, Sinks, Reducer } from './interfaces';

export function App(sources : Sources) : Stream<Sinks>
{
    const action$ : Stream<Reducer> = intent(sources.DOM);
    const vdom$ : Stream<VNode> = view(sources.onion.state$);

    const DOM$ : Stream<DOMSink> = vdom$.map(wrapDOM);
    const onion$ : Stream<OnionSink> = action$.map(wrapOnion);

    return xs.merge(DOM$, onion$);
}

function intent(DOM : DOMSource) : Stream<Reducer>
{
    const init$ : Stream<Reducer> = xs.of(() => ({ count: 0 }));

    const add$ : Stream<Reducer> = DOM.select('.add').events('click')
        .mapTo(state => ({ ...state, count: state.count + 1 }));

    const subtract$ : Stream<Reducer> = DOM.select('.subtract').events('click')
        .mapTo(state => ({ ...state, count: state.count - 1 }));

    return xs.merge(init$, add$, subtract$);
}

function view(state$ : Stream<any>) : Stream<VNode>
{
    return state$
        .map(s => s.count)
        .map(count =>
            <div>
                <h2>My Awesome Cycle.js app</h2>
                <span>{ 'Counter: ' + count }</span>
                <button type='button' className='add'>Increase</button>
                <button type='button' className='subtract'>Decrease</button>
            </div>
        );
}
