import { megaRun } from '@mega-cycle/run';
import { makeMegaDOMDriver } from '@mega-cycle/dom';
import { makeMegaHTTPDriver } from '@mega-cycle/http';
import { megaOnionify } from '@mega-cycle/onionify';

import { Component } from './interfaces';
import { App } from './app';

const main : Component = megaOnionify(App);

const megaDriver = sinks => ({
    DOM: makeMegaDOMDriver('#app', sinks),
    HTTP: makeMegaHTTPDriver(sinks)
});

megaRun(main, megaDriver);
