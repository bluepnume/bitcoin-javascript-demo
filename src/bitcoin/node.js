/* @flow */

import { KeyPair, signAndPack, verifySignatureAndUnpack } from '../lib/crypto';
import { loop } from '../lib/util';
import { Network } from '../lib/network';

import { BlockChain, type BlockChainType } from './blockchain';
import { BLOCK_SIZE_LIMIT } from './constants';

type BitcoinNodeType = {|
    getPublicKey : () => Promise<string>,
    mine : () => Promise<void>,
    send : (receiver : string, amount : number, fee : number) => Promise<void>,
    getBlockChain : () => BlockChainType,
    getMemPool : () => Array<string>
|};

export function BitcoinNode() : BitcoinNodeType {
    const { publicKey, privateKey } = KeyPair();
    const { listen, broadcast } = Network();
    const { getBlocks, createBlock, addBlock, getBalances } = BlockChain();

    const mempool = [];

    const getPublicKey = async () : Promise<string> => {
        return await publicKey;
    }

    const send = async (receiver : string, amount : number, fee : number) : Promise<void> => {
        const signedTransaction = await signAndPack({
            sender: await publicKey,
            receiver,
            amount,
            fee
        }, await publicKey, await privateKey)

        await broadcast('ADD_TRANSACTION', signedTransaction);
    };

    listen('ADD_TRANSACTION', async (signedTransaction) => {
        const { sender, receiver, amount, fee } = await verifySignatureAndUnpack(signedTransaction);

        if (sender && receiver && amount && fee) {
            mempool.push(signedTransaction);
        } 
    });

    const mine = async () : Promise<void> => {
        await loop(async () => {
            const signedTransactions = mempool.slice(0, BLOCK_SIZE_LIMIT);
            const hashedBlock = await createBlock(await publicKey, signedTransactions);

            if (hashedBlock) {
                await broadcast('ADD_BLOCK', hashedBlock);
            }
        });
    };
    
    listen('ADD_BLOCK', async (hashedBlock) => {
        mempool.length = 0;
        await addBlock(hashedBlock);
    });

    const getBlockChain = () => {
        return { getBlocks, createBlock, addBlock, getBalances };
    };

    const getMemPool = () => {
        return mempool;
    };

    return {
        getPublicKey,
        mine,
        send,
        getBlockChain,
        getMemPool
    };
}