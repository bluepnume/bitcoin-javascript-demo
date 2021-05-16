/* @flow */

export function base64encode(str : string) : string {
    try {
        if (typeof window !== 'undefined' && window.atob) {
            return window.btoa(str).replace(/[=]/g, '');
        }
    
        return Buffer.from(str, 'utf8').toString('base64').replace(/[=]/g, '');
    } catch (err) {
        throw new Error(`Can not encode string: ${ JSON.stringify(str) }:\n\n${ err.stack }`);
    }
}

export function base64decode(str : string) : string {
    try {
        if (typeof window !== 'undefined' && window.btoa) {
            return window.atob(str);
        }

        return Buffer.from(str, 'base64').toString('utf8');
    } catch (err) {
        throw new Error(`Can not decode string: ${ JSON.stringify(str) }:\n\n${ err.stack }`);
    }
}

export function arrayBufferToString(buf : ArrayBuffer) : string {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

export function stringToArrayBuffer(str : string) : ArrayBuffer {
    const buf = new ArrayBuffer(str.length*2);
    const bufView = new Uint16Array(buf);
    for (let i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export function arrayBufferToBase64(buffer : ArrayBuffer) : string {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return base64encode( binary );
}

export function base64ToArrayBuffer(base64 : string) : ArrayBuffer {
    var binary_string =  base64decode(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

export function uniqueID() : string {

    const chars = '0123456789abcdef';

    const randomID = 'xxxxxxxxxx'.replace(/./g, () => {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    });

    return randomID;
}

export async function delay(time : number) : Promise<void> {
    return await new Promise(resolve => setTimeout(resolve, time));
}

export async function loop(handler : () => (Promise<void> | void), time? : number = 500) {
    while (true) {
        await delay(time);
        handler();
    }
}

export function count(str : string, substr : string) : number {
    const match = str.match(new RegExp(substr, 'gi'));
    const len = match ? match.length : 0;
    return len;
}

export function sort<T>(arr : Array<T>, predicate : (T, T) => boolean) : Array<T> {
    return [ ...arr ].sort((a, b) => {
        return predicate(a, b) ? 1 : -1;
    });
}

export function sortBy<O, T : number>(arr : Array<O>, getter : (O) => T) : Array<O> {
    return sort(arr, (a, b) => (getter(a) > getter(b)))
}

export function safeJSONStringify<T>(item : T) : string {
    const result = JSON.stringify(item);

    if (typeof result === 'undefined') {
        throw new Error(`Can not JSON.stringify undefined`);
    }

    return result;
}

export async function asyncMap<T, R>(arr : Array<T>, mapper : (T) => Promise<R>) : Promise<Array<R>> {
    return await Promise.all(arr.map(mapper));
}

export async function asyncFilter<T>(arr : Array<T>, filterer : (T) => Promise<boolean>) : Promise<Array<T>> {
    return await Promise.all(arr.map((val, index) => {
        return Promise.resolve(filterer(val)).then(include => {
            return [ val, include ];
        })
    })).then(results => {
        return results.filter(([ val, include ]) => {
            return include;
        }).map(([ val, include ]) => {
            return val;
        })
    });
}

interface Indexable {
    [key: string]: number
  }

export class Counter implements Indexable {
    $key: string;
    $value: number;

    add(key : string, num : number) {
        this[key] = this[key] || 0;
        this[key] += num;
    }

    subtract(key : string, num : number) {
        this[key] = this[key] || 0;
        this[key] -= num;
    }
}

export function randomEntry<T>(arr : Array<T>) : T {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function divisibleBy(num : number | string, divisor : number, base : number = 36) : boolean {
    if (typeof num === 'string') {
        num = parseInt(num, base);
    }
    
    return (num % divisor) === 0;
}

export function now() : number {
    return Date.now();
}