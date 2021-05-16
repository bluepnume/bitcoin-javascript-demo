/* @flow */

import { hashAndPack, unpackHash, verifyHashAndUnpack, verifyPackedSignature, verifySignatureAndUnpack } from '../lib/crypto';
import { TreeNode, type TreeNodeType } from '../lib/tree';
import { asyncFilter, asyncMap, Counter, divisibleBy, now, uniqueID } from '../lib/util';

import { BLOCK_TIME, GENESIS_BLOCK, REWARD_HALVING_SCHEDULE, type BlockType } from './constants';

export type BlockChainType = {|
    getBlocks : () => TreeNodeType<BlockType>,
    addBlock : (hashedBlock : string) => Promise<void>,
    createBlock : (publicKey : string, transactions : Array<string>) => Promise<?string>,
    getBalances : () => Promise<Counter>
|};

export function BlockChain() : BlockChainType {
    const root = TreeNode(GENESIS_BLOCK);

    const getBlocks = () => {
        return root;
    }

    const addBlock = async (hashedBlock : string) => {
        const verifiedBlock = await verifyHashAndUnpack(hashedBlock);
        const verifiedTransactions = await asyncMap(verifiedBlock.transactions, verifySignatureAndUnpack);

        const fullyVerifiedBlock = {
            ...verifiedBlock,
            transactions: verifiedTransactions
        };

        root.findValueByID(fullyVerifiedBlock.parentid)?.addChildNodeValue(fullyVerifiedBlock);
    };

    const createBlock = async (publicKey : string, transactions : Array<string>) : Promise<?string> => {
        const headBlock = root.getLongestBranchNode().getValue();
        const headBlockParent = root.getLongestBranchNode().getParent().getValue();

        const newTransactions = await asyncFilter(transactions, verifyPackedSignature);

        const newDifficulty = (headBlock.time - headBlockParent.time) > BLOCK_TIME
            ? headBlock.difficulty - 1
            : headBlock.difficulty + 1;

        const newReward = divisibleBy(headBlock.index, REWARD_HALVING_SCHEDULE)
            ? Math.floor(headBlock.reward / 2)
            : headBlock.reward;

        const newBlock = {
            miner:        publicKey,
            parentid:     headBlock.id,
            index:        headBlock.index + 1,
            id:           uniqueID(),
            time:         now(),
            transactions: newTransactions,
            difficulty:   newDifficulty,
            reward:       newReward
        };

        const hashedBlock = await hashAndPack(newBlock);

        if (divisibleBy(unpackHash(hashedBlock), headBlock.difficulty)) {
            return hashedBlock;
        }
    };

    const getBalances = async () : Promise<Counter> => {
        const balances = new Counter();

        for (let { miner, reward, transactions } of root.getLongestChainAsValues()) {
            balances.add(miner, reward);

            for (let { receiver, amount, fee, sender } of transactions) {
                balances.add(miner, fee);
                balances.add(receiver, amount);
                balances.subtract(sender, amount);
                balances.subtract(sender, fee);
            }
        }

        return balances;
    };

    return {
        getBlocks,
        addBlock,
        createBlock,
        getBalances
    };
}
