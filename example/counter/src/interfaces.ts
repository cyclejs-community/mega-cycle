import { Stream } from 'xstream';
import { HTTPSource, HTTPSink, RequestOptions } from '@mega-cycle/http';
import { DOMSink, DOMSource, VNode } from '@mega-cycle/dom';
import { StateSource, OnionSink } from '@mega-cycle/onionify';

export type Sources = {
    DOM : DOMSource;
    HTTP : HTTPSource;
    onion : StateSource<AppState>;
};

export type Sinks = DOMSink | HTTPSink | OnionSink;

export type AppState = {
    count : number;
};

export type Component = (s : Sources) => Stream<Sinks>;
export type Reducer = (prevState : any) => any;
