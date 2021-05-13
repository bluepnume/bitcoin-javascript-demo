/* @flow */

import { hashAndPack } from '../lib/crypto';
import { TreeNode, type TreeNodeType } from '../lib/tree';
import { Counter, uniqueID } from '../lib/util';

import { BLOCK_TIME, GENESIS_BLOCK, INITIAL_REWARD, REWARD_HALVING_SCHEDULE } from './constants';

export type TransactionType = {|
    sender : string,
    receiver : string,
    amount : number,
    fee : number
|};

export type BlockType = {|
    miner : string,
    parentid : ?string,
    id : string,
    index : number,
    time : number,
    transactions : Array<TransactionType>,
    difficulty : number,
    reward : number
|};

export type BlockChainType = {|
    getBlocks : () => TreeNodeType<BlockType>,
    addBlock : (block : BlockType) => Promise<void>,
    mineBlock : (publicKey : string, transactions : Array<string>) => Promise<?string>,
    getBalances : () => Promise<{ [string] : number }>
|};

export function BlockChain() : BlockChainType {
    const genesisBlockNode = TreeNode(GENESIS_BLOCK);

    const getBlocks = () => {
        return genesisBlockNode;
    }

    const addBlock = async (block : BlockType) => {
        genesisBlockNode.findValue(val => val.id === block.parentid)
            ?.addNode(TreeNode(block));
    };

    const calculateNewDifficulty = (headBlock : BlockType, previousHeadBlock : ?BlockType) : number => {
        if (!previousHeadBlock) {
            return headBlock.difficulty;
        }

        return (headBlock.time - previousHeadBlock.time) > BLOCK_TIME
            ? headBlock.difficulty - 1
            : headBlock.difficulty + 1;
    };

    const calculateNewReward = (headBlock : BlockType) => {
        return Math.floor(INITIAL_REWARD / (2 ** Math.floor(headBlock.index / REWARD_HALVING_SCHEDULE)));
    };

    const doesHashPassDifficulty = (hash : string, difficulty : number) : boolean => {
        return (parseInt(hash, 36) % difficulty) === 0;
    }

    const mineBlock = async (publicKey, transactions) : Promise<?string> => {
        const headNode = genesisBlockNode.getLongestBranch();
        const previousHeadNode = headNode.getParent();
        
        const headBlock = headNode.getValue();
        const previousHeadBlock = previousHeadNode?.getValue();

        const newBlock = {
            miner:      publicKey,
            parentid:   headBlock.id,
            index:      headBlock.index + 1,
            id:         uniqueID(),
            time:       Date.now(),
            transactions,
            difficulty: calculateNewDifficulty(headBlock, previousHeadBlock),
            reward:     calculateNewReward(headBlock)
        };

        const [ hashedBlock, hash ] = await hashAndPack(newBlock);

        if (doesHashPassDifficulty(hash, headBlock.difficulty)) {
            return hashedBlock;
        }
    };

    const getBalances = async () : Promise<Counter> => {
        const balances = new Counter();

        for (let { miner, reward, transactions } of genesisBlockNode.getLongestChainAsValues()) {
            balances.add(miner, reward);

            for (let transaction of transactions) {
                const { receiver, amount, fee, sender } = transaction;
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
        mineBlock,
        getBalances
    };
}
