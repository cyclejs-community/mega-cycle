import { forall, assert, nat, Options } from 'jsverify';
import { diagramArbitrary, promise } from 'cyclejs-test-helpers';
import * as htmlLooksLike from 'html-looks-like';
const toHtml = require('snabbdom-to-html'); //snabbdom-to-html's typings are broken

import xs, { Stream } from 'xstream';
import { mockDOMSource, isDOM } from '@mega-cycle/dom';
import { mockTimeSource } from '@cycle/time';
import { megaOnionify } from '@mega-cycle/onionify';

import { App } from '../src/app';

function withTime (test) {
  return function () {
    const Time = mockTimeSource();

    test(Time);

    return promise(Time.run);
  }
}

const testOptions : Options = {
    tests: 100,
    size: 200
};

describe('app tests', () => {

    const expectedHTML = count => `
        <div>
            <h2>My Awesome Cycle.js app</h2>
            <span>Counter: ${count}</span>
            <button>Increase</button>
            <button>Decrease</button>
        </div>
    `;

    it('should interact correctly', () => {
        const property = forall(diagramArbitrary, diagramArbitrary, (addDiagram, subtractDiagram) => withTime(Time => {
            const add$ : Stream<any> = Time.diagram(addDiagram) as any;
            const subtract$ : Stream<any> = Time.diagram(subtractDiagram) as any;

            const DOM = mockDOMSource({
                '.add': { click: add$ },
                '.subtract': { click: subtract$ }
            });

            const app = megaOnionify(App)({ DOM } as any);
            const html$ : Stream<string> = app
                .filter(isDOM)
                .map<string>(toHtml);

            const expected$ : Stream<string> = xs.merge(add$.mapTo(+1), subtract$.mapTo(-1))
                .fold((acc, curr) => acc + curr, 0)
                .map(expectedHTML);

            Time.assertEqual(html$ as any, expected$ as any, htmlLooksLike);
        }));

        return assert(property, testOptions);
    });
});
