import { run } from '@cycle/run';
import { Stream } from 'xstream';

export function createMegaRun(_run : any) {
    return function megaRun<Sources, Sinks>(
            main : (s : Sources) => Stream<Sinks>,
            megaDriver : (s : Stream<Sinks>) => Sources
    ) {
        const _main = sources => ({ main: main(sources.main) });
        const driver = sink => megaDriver(sink);
        return _run(_main, { main: driver });
    }
}

export const megaRun = createMegaRun(run);
