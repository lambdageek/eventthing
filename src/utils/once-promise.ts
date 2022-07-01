export default function oncePromise<T extends EventTarget, V>(src: T, type: string, extract: (t: T, ev: Event) => V): Promise<V> {
    return new Promise((resolve, reject) => {
        const handler = (ev: Event) => {
            resolve(extract(src, ev));
        };
        src.addEventListener(type, handler, { once: true });
    });
}
