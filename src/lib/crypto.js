/* @flow */

import { stringToArrayBuffer, arrayBufferToBase64, base64ToArrayBuffer, base64encode, base64decode, safeJSONStringify } from './util';

const KEY_DATA = {
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: { name: 'SHA-256' },
};

const KEY_OPS = [ 'sign', 'verify' ];

const HASH_PUBLIC_KEY = "eyJhbGciOiJSUzI1NiIsImUiOiJBUUFCIiwiZXh0Ijp0cnVlLCJrZXlfb3BzIjpbInZlcmlmeSJdLCJrdHkiOiJSU0EiLCJuIjoidjJpQVhBdEd0RFhFYW9LUnpUN0VaRURYVkd1TzNjTkpuMFB1NlhaOHVBU3E1OGlEVnpQWkJSdU1QeXBjN1RSNVAwSS1CQ1VMQzNSY1dBMmExRU5kWnR5Z2RmV2FfbERIY3VXY2pfSkNuV3B5RjZwYS1aRzgtZkUzYmhYU2R0d1FmbVI4SFpvTTVLQ0VpMnhUaGtjZ2tGYzgzSzBob0lUWHFyTHJBMENSMzFvMWtQZVV5bExhX25xZjdUZjBGYjNxNnQyc1lDQjN6dHYtUG5HdktSMkJKcmlwTHc2MXJpaVhOSUJmQXI5VkVvYjg1cFZidFpvWFVtREwySElnY1N6cXFLYUlmeFVkbEhXRzl3OVZRWnR2djJoWUZDRnZPcUtpQkhoenBobDVIUmVsTTh5Y0RtVXFTWGxxOXNZRlRLQ2tzdW9SVnJWYlRJaXlETWFTQU9NMjBRIn0=";
const HASH_PRIVATE_KEY = "eyJhbGciOiJSUzI1NiIsImQiOiJLVFBhR2JZMXNKbzRYME1mRnFMeHpMRG1pVjRqNFZubDhicENaaEFpOWN2UGJGaU42VW9ZWjlDUHhwTWNjTlZRV2swc28yREQtV0hCZFJUc3BNLWhmZ0IxTEI5RUQ0V2RBWDhxemhPMHdrVUZMVkgzQm0wWVZHZFg2c01Zekl3X29xMkh5Q2wtcUFKanRjMktSMGZ0V3hUa1hZNkpSQkFFaXRLNzR6WFZrTkh1NVNtY0QwUlpOdUdreDBlQnJqWnBnVHpadDduM1dmZEJOT09HdTRzTTNrSDNISmVrY1N0RFVhOEZVcWFKZFc3WDdHSG5uSTdNejVlN1U3dU9MQmJQVTJHOUxxNkxRamdzbU9PQ21rUWFPWnAxRUNYNExzTXhyM0p4TlNYWURrUXdiV2lxc0NFLXhVVmNhMVIzRDNUaWZKYmROaXlUNDA0QmJXbkRsZ2doSHciLCJkcCI6IlBjVVRTemIxUHFTWEI4bE9fSEk4ZGlyU3k4d3kzOVIwaktNX1JYTzJ3M2trSlA2SU1CWmZ2ak1pWmhfWW1tbVRMWk9xQV9PNm5HR1E1TG5tMHFHczhIQ09PNnBOZFltOVJVNWVicmpuZFVlVi1yV1NjVG1Hdm4wUzhmdzZtNTNtdGk5UVlOMC0xaW5xdTN6NzIzRE9oSGRxQWtNS0FLV1MtRkNYa2FyZVdBcyIsImRxIjoiVnNSRFM4cU1OcmY5UjNKZE9PdTZXR2FzekE4eTJEQXZMQzVqMFY1MWx0a2RWQmY5RmExeGdkVUJjMU9sd3VkSUdZTzdxSFVhNF9xRUg4ajE3bmxTUS1wQXZaOWVnN3FEQXNwM1RZZ1hQdURMRldQelpnS00zdWJKaUUxUHlibUVPbTVEMDVYWGpnTkd5OHp4c3YxejRSWTBZM2hnQlpRTnpSUXdNUUdVWFpNIiwiZSI6IkFRQUIiLCJleHQiOnRydWUsImtleV9vcHMiOlsic2lnbiJdLCJrdHkiOiJSU0EiLCJuIjoidjJpQVhBdEd0RFhFYW9LUnpUN0VaRURYVkd1TzNjTkpuMFB1NlhaOHVBU3E1OGlEVnpQWkJSdU1QeXBjN1RSNVAwSS1CQ1VMQzNSY1dBMmExRU5kWnR5Z2RmV2FfbERIY3VXY2pfSkNuV3B5RjZwYS1aRzgtZkUzYmhYU2R0d1FmbVI4SFpvTTVLQ0VpMnhUaGtjZ2tGYzgzSzBob0lUWHFyTHJBMENSMzFvMWtQZVV5bExhX25xZjdUZjBGYjNxNnQyc1lDQjN6dHYtUG5HdktSMkJKcmlwTHc2MXJpaVhOSUJmQXI5VkVvYjg1cFZidFpvWFVtREwySElnY1N6cXFLYUlmeFVkbEhXRzl3OVZRWnR2djJoWUZDRnZPcUtpQkhoenBobDVIUmVsTTh5Y0RtVXFTWGxxOXNZRlRLQ2tzdW9SVnJWYlRJaXlETWFTQU9NMjBRIiwicCI6Ii1YbEJ0bHhjYVJrb2FLSUlsQkFiSkRIdVZ5bk5PNU4zUlBSWENFeE1CMEZxOHVhU1dYM0g0SjZIU09mVG5DTy1DczNmWm41b1dHbVlJbC1BZVV1TG11NEtvdm54cENOeU1FMEw5YlFXZi00QTQxdnlLVDBKbTZFTXo2b2Z0U3AxZUlPOWJXYmZLUlBJSElUVE45ZWsxWE5ZM0xHVXIzek1uWUNmRHpzZER1OCIsInEiOiJ4R3BnUzZ4SGJHYl9hNVY0blZXck00alFObThfT2p5MUJ3YWtCdGk0bTdBUXE0Vno5My1IVDQtTlZVS3c3UmhWckdhNXBFWTlRTC1pMndEdEM2T1ZuaDRvcUNhRTdqb01nODFWU1VGR0NGUjdMWk1ldnNBallnaTQta1RIS1JwT1hLeU9LemdtdXA2N0F1T2pPVDl6Ni1TUTJ2dXI2RHRoaEQxcDZ1SE1GajgiLCJxaSI6IlhhYWYzRlVRYWE3QXlPZlFHMUJjSWdkNG44Vm1ldG1QVUU3TFBuWnk1TE5FT3V4b2JSQlE5OV9JcU1LX2pfMUczY0YwZGw0bWZxVWlWTHZhdFJWcWNRZ0FpOUFra2U5ZFhpZXpHN21PR3pEaFA5ZjREeVFxOUtpWUJWai1xaUhkU1VBSDAtZFp0YmF4WU52TGZUQUp4WElsUi1hYlYxM3dNSE5BaDRBeVN6cyJ9";

type PrivateKey = {||};
type PublicKey = {||};

type ImportedKey = {||};

declare var crypto : {|
    subtle : {|
        generateKey : (typeof KEY_DATA, boolean, Array<string>) => Promise<{|
            privateKey : PrivateKey,
            publicKey : PublicKey
        |}>,
        importKey : (string, PrivateKey, typeof KEY_DATA, boolean, Array<string>) => ImportedKey,
        exportKey : (string, PrivateKey | PublicKey) => Promise<{||}>,
        sign : (string, ImportedKey, ArrayBuffer) => ArrayBuffer,
        verify : (string, ImportedKey, ArrayBuffer, ArrayBuffer) => Promise<boolean>
    |}
|};

export function KeyPair() : {| publicKey : Promise<string>, privateKey : Promise<string> |} {
    const keyPairPromise = crypto.subtle.generateKey(
        KEY_DATA,
        true,
        KEY_OPS
    );

    const privateKey = keyPairPromise.then(({ privateKey }) => crypto.subtle.exportKey('jwk', privateKey)).then(safeJSONStringify).then(base64encode);
    const publicKey = keyPairPromise.then(({ publicKey }) => crypto.subtle.exportKey('jwk', publicKey)).then(safeJSONStringify).then(base64encode);
    
    return { privateKey, publicKey };
}

export async function sign<T>(data : T | string, privateKey : string) : Promise<string> {
    return arrayBufferToBase64(
        await crypto.subtle.sign(
            'RSASSA-PKCS1-v1_5',
            await crypto.subtle.importKey('jwk', JSON.parse(base64decode(privateKey)), KEY_DATA, true, [ 'sign' ]),
            stringToArrayBuffer(typeof data === 'string' ? data : safeJSONStringify(data))
        )
    );
}

export async function verifySignature<T>(data : T | string, signature : string, publicKey : string) : Promise<boolean> {
    return await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        await crypto.subtle.importKey('jwk', JSON.parse(base64decode(publicKey)), KEY_DATA, true, [ 'verify' ]),
        base64ToArrayBuffer(signature),
        stringToArrayBuffer(typeof data === 'string' ? data : safeJSONStringify(data))
    );
}

export async function signAndPack<T>(data : T, publicKey : string, privateKey : string) : Promise<string> {
    const signature = await sign(data, privateKey);
    const signedData = base64encode(safeJSONStringify({
        data,
        publicKey,
        signature
    }));

    return signedData;
}

export async function verifySignatureAndUnpack<T>(packedData : string) : Promise<T> {
    const { data, publicKey, signature } = JSON.parse(base64decode(packedData));
    if (!await verifySignature(data, signature, publicKey)) {
        throw new Error(`Data signature does not match!`);
    }
    return data;
}

export async function verifyPackedSignature(packedData : string) : Promise<boolean> {
    const { data, publicKey, signature } = JSON.parse(base64decode(packedData));
    return await verifySignature(data, signature, publicKey);
}

export function unpackSignature(packedData : string) : string {
    const { signature } = JSON.parse(base64decode(packedData));
    return signature;
}

export function unpackPublicKey(packedData : string) : string {
    const { publicKey } = JSON.parse(base64decode(packedData));
    return publicKey;
}

export async function hash<T>(data : T) : Promise<string> {
    return await sign(typeof data === 'string' ? data : safeJSONStringify(data), HASH_PRIVATE_KEY);
}

export async function verifyHash<T>(data : T | string, hashedData : string) : Promise<boolean> {
    return await verifySignature(typeof data === 'string' ? data : safeJSONStringify(data), hashedData, HASH_PUBLIC_KEY);
}

export async function hashAndPack<T>(data : T) : Promise<string> {
    const dataHash = await hash(data);
    const packedData = base64encode(safeJSONStringify({
        data,
        hash: dataHash
    }));

    return packedData;
}

export async function verifyHashAndUnpack<T>(packedData : string) : Promise<T> {
    const { data, hash } = JSON.parse(base64decode(packedData));
    if (!await verifyHash(data, hash)) {
        throw new Error(`Data hash does not match!`);
    }
    return data;
}

export function unpackHash(packedData : string) : string {
    const { hash } = JSON.parse(base64decode(packedData));
    return hash;
}