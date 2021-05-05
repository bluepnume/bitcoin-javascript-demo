/* @flow */

import { getKeyPair, signAndPack, verifySignatureAndUnpack, verifyHashAndUnpack } from '../lib/crypto';
import { asyncMap, loop, sortBy } from '../lib/util';
import { Network } from '../lib/network';

import { BlockChain, type BlockChainType } from './blockchain';
import { BLOCK_SIZE_LIMIT, NETWORK_MESSAGE } from './constants';

type BitcoinNodeType = {|
    getPublicKey : () => Promise<string>,
    run : () => Promise<void>,
    send : (receiver : string, amount : number, fee : number) => Promise<void>,
    getBlockChain : () => BlockChainType
|};

export function BitcoinNode() : BitcoinNodeType {
    const keypairPromise = getKeyPair();
    const network = Network();
    const blockchain = BlockChain();

    const peers = [];
    let mempool = [];

    network.listen(NETWORK_MESSAGE.IDENTIFY, peer => {
        peers.push(peer);
    });

    network.listen(NETWORK_MESSAGE.ADD_TRANSACTION, async (signedTransaction) => {
        const [ { fee } ] = await verifySignatureAndUnpack(signedTransaction);
        mempool.push({ fee, signedTransaction });     
    });

    network.listen(NETWORK_MESSAGE.ADD_BLOCK, async (hashedBlock) => {
        const [ block ] = await verifyHashAndUnpack(hashedBlock);
        const transactions = await asyncMap(
            block.transactions,
            async signedTransaction => {
                const [ { receiver, amount, fee }, sender ] = await verifySignatureAndUnpack(signedTransaction);
                return { sender, receiver, amount, fee }
            }
        )

        mempool = mempool.filter(
            pooledTransaction => !block.transactions.includes(pooledTransaction.signedTransaction)
        );

        await blockchain.addBlock({
            ...block,
            transactions
        });
    });

    const getPublicKey = async () : Promise<string> => {
        const { publicKey } = await keypairPromise;
        return publicKey;
    }

    const run = async () : Promise<void> => {
        const { publicKey } = await keypairPromise;
        await network.broadcast(NETWORK_MESSAGE.IDENTIFY, { publicKey });

        await loop(async () => {
            
            const topTransactions =
                sortBy(mempool, pooledTransaction => pooledTransaction.fee)
                .slice(0, BLOCK_SIZE_LIMIT)
                .map(pooledTransaction => pooledTransaction.signedTransaction);

            const hashedBlock = await blockchain.mineBlock(publicKey, topTransactions);

            if (hashedBlock) {
                await network.broadcast(
                    NETWORK_MESSAGE.ADD_BLOCK,
                    hashedBlock
                );
            }
        }, 100);
    };

    const send = async (receiver : string, amount : number, fee : number) : Promise<void> => {
        const { publicKey, privateKey } = await keypairPromise;

        const [ signedTransaction ] = await signAndPack({
            receiver,
            amount,
            fee
        }, publicKey, privateKey)

        await network.broadcast(
            NETWORK_MESSAGE.ADD_TRANSACTION,
            signedTransaction
        );
    };

    const getBlockChain = () => {
        return blockchain;
    };

    return {
        getPublicKey,
        run,
        send,
        getBlockChain
    };
}