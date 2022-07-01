import EventQueue from './event-queue';
import delay from './utils/delay';

async function* eventStream<T extends EventTarget, V>(src: T, type: string, extract: (t: T, ev: Event) => V): AsyncIterable<V> {
    const q = new EventQueue(src, type, extract);
    q.start();
    while (true) {
        yield await q.next();
    }
}

async function run(): Promise<void> {
    const x = document.getElementById('x')!;
    x.innerText = "hi";
    const y = document.getElementById('y')! as HTMLInputElement;
    for await (const text of eventStream(y, 'input', (t) => t.value)) {
        x.innerText = "{reticulating splines}";
        await delay(500);
        x.innerText = text;
    }
}

run();
