/* @flow */

import { hashAndPack, unpackHash, verifyHashAndUnpack, verifySignatureAndUnpack } from '../lib/crypto';
import { TreeNode, type TreeNodeType } from '../lib/tree';
import { asyncMap, Counter, divisibleBy, now, uniqueID } from '../lib/util';

import { BLOCK_TIME, GENESIS_BLOCK, REWARD_HALVING_SCHEDULE, type BlockType } from './constants';

export type BlockChainType = {|
    getBlocks : () => TreeNodeType<BlockType>,
    addBlock : (hashedBlock : string) => Promise<void>,
    createBlock : (miner : string, signedTransactions : Array<string>) => Promise<?string>,
    getBalances : () => Promise<Counter>
|};

export function BlockChain() : BlockChainType {
    const root = TreeNode(GENESIS_BLOCK);

    const getBlocks = () => {
        return root;
    }

    const createBlock = async (miner : string, signedTransactions : Array<string>) : Promise<?string> => {
        const { id, index, time, elapsed, reward, difficulty } = root.getLongestBranchValue();

        const blockCandidate = {
            miner,
            parentid:     id,
            index:        index + 1,
            id:           uniqueID(),
            time:         now(),
            elapsed:      now() - time,
            transactions: signedTransactions,
            difficulty:   difficulty + (elapsed > BLOCK_TIME ? -1 : +1),
            reward:       divisibleBy(index, REWARD_HALVING_SCHEDULE) ? reward/2 : reward
        };

        const hashedBlock = await hashAndPack(blockCandidate);
        const hash = unpackHash(hashedBlock);

        if (divisibleBy(hash, blockCandidate.difficulty)) {
            return hashedBlock;
        }
    };

    const addBlock = async (hashedBlock : string) => {
        const block = await verifyHashAndUnpack(hashedBlock);
        const transactions = await asyncMap(block.transactions, verifySignatureAndUnpack);
        
        const blockCandidate = { ...block, transactions };
        const hash = unpackHash(hashedBlock);

        if (!divisibleBy(hash, blockCandidate.difficulty)) {
            return;
        }

        // Do a bunch more validation

        root.findByValueID(blockCandidate.parentid)
            ?.addChildNodeByValue(blockCandidate);
    };

    const getBalances = async () : Promise<Counter> => {
        const balances = new Counter();

        for (const { miner, reward, transactions } of root.getLongestChainAsValues()) {
            balances.add(miner, reward);

            for (const { receiver, amount, fee, sender } of transactions) {
                balances.add(receiver, amount);
                balances.subtract(sender, amount);
                
                balances.add(miner, fee);
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
