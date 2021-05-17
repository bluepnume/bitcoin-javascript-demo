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
    const keypair = KeyPair();
    const network = Network();
    const blockchain = BlockChain();
    let mempool = [];

    const getPublicKey = async () : Promise<string> => {
        return await keypair.publicKey;
    }

    const send = async (receiver : string, amount : number, fee : number) : Promise<void> => {
        const signedTransaction = await signAndPack({
            sender: await keypair.publicKey,
            receiver,
            amount,
            fee
        }, await keypair.publicKey, await keypair.privateKey)

        await network.broadcast('ADD_TRANSACTION', signedTransaction);
    };

    network.listen('ADD_TRANSACTION', async (signedTransaction) => {
        const { sender, receiver, amount, fee } = await verifySignatureAndUnpack(signedTransaction);

        if (sender && receiver && amount && fee) {
            mempool.push(signedTransaction);
        } 
    });

    const mine = async () : Promise<void> => {
        await loop(async () => {
            const signedTransactions = mempool.slice(0, BLOCK_SIZE_LIMIT);
            const hashedBlock = await blockchain.createBlock(await keypair.publicKey, signedTransactions);

            if (hashedBlock) {
                await network.broadcast('ADD_BLOCK', hashedBlock);
            }
        });
    };
    
    network.listen('ADD_BLOCK', async (hashedBlock) => {
        mempool = [];
        await blockchain.addBlock(hashedBlock);
    });

    const getBlockChain = () => {
        return blockchain;
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