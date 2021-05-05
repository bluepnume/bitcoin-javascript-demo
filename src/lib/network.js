/* @flow */

const listeners = {};

type NetworkType = {|
    broadcast : <T>(string, T) => Promise<void>,
    listen : <T>(string, (T) => Promise<void> | void) => void
|};

export function Network() : NetworkType {
    const broadcast = async <T>(event : string, data : T) => {
        for (const listener of (listeners[event] || [])) {
            await listener(data);
        }
    };

    const listen = <T>(event : string, handler : (T) => Promise<void> | void) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(handler);
    };

    return {
        broadcast,
        listen
    }
}