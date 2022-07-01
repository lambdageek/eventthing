export default class EventQueue<T extends EventTarget, V> {
    readonly extract: (t: T, ev: Event) => V;
    private readonly queue: Array<V>;
    private readonly target: T;
    private readonly eventType: string;
    handler: ((this: this, ev: Event) => void);;
    resolvePending: null | ((value: V | PromiseLike<V>) => void);
    constructor(src: T, eventType: string, extract: (t: T, ev: Event) => V) {
        this.extract = extract;
        this.queue = [];
        this.target = src;
        this.eventType = eventType;
        this.handler = this.onEvent.bind(this);
        this.resolvePending = null;
    }
    start() {
        this.target.addEventListener(this.eventType, this.handler);
    }
    stop() {
        this.target.removeEventListener(this.eventType, this.handler);
    }
    next(): Promise<V> {
        if (this.queue.length > 0) {
            console.debug("dequeueing, with length", this.queue.length);
            return Promise.resolve(this.queue.shift()!);
        } else {
            console.debug("queue is empty, waiting for event");
            return new Promise((resolve) => {
                this.resolvePending = (v) => {
                    console.debug("resolving pending, with length", this.queue.length);
                    resolve(v);
                };
            });
        }
    }
    onEvent(ev: Event) {
        const value = this.extract(this.target, ev);
        console.debug("saw", value);
        if (this.resolvePending) {
            console.debug("resolving with", value);
            let resolve = this.resolvePending;
            this.resolvePending = null;
            queueMicrotask(() => resolve(value));
        } else {
            console.debug("queueing with value", value);
            this.queue.push(value);
        }
    }
}
