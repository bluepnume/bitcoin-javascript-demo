/* @flow */

import type { BlockType } from './blockchain';

// Approximately how long should it take between new blocks
export const BLOCK_TIME = 3 * 1000;

// What is the starting block reward for each mined block
export const INITIAL_REWARD = 1024;

// After how many blocks should the block reward be cut in half
export const REWARD_HALVING_SCHEDULE = 10;

// What is the limit for number of transactions per block
export const BLOCK_SIZE_LIMIT = 10;

// What is the initial genesis block
export const GENESIS_BLOCK : BlockType = {
    parentid:     null,
    miner:        'SATOSHI',
    id:           'GENESIS',
    index:        0,
    time:         Date.now(),
    transactions: [],
    difficulty:   10,
    reward:       INITIAL_REWARD
};

// Some network messages we need to send between nodes
export const NETWORK_MESSAGE = {
    ADD_TRANSACTION: 'ADD_TRANSACTION',
    ADD_BLOCK:       'ADD_BLOCK'
};
