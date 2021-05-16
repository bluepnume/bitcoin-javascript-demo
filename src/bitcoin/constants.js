/* @flow */

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

// Approximately how long should it take between new blocks
export const BLOCK_TIME = 1000;

// What is the starting block reward for each mined block
export const INITIAL_REWARD = 1024;

// After how many blocks should the block reward be cut in half
export const REWARD_HALVING_SCHEDULE = 20;

// What is the limit for number of transactions per block
export const BLOCK_SIZE_LIMIT = 10;

// What is the initial genesis block
export const GENESIS_BLOCK : BlockType = {
    parentid:     null,
    miner:        'SATOSHI',
    id:           'GENESIS',
    index:        1,
    time:         Date.now(),
    transactions: [],
    difficulty:   1,
    reward:       INITIAL_REWARD
};

// Some network messages we need to send between nodes
export const NETWORK_MESSAGE = {
    ADD_TRANSACTION: 'ADD_TRANSACTION',
    ADD_BLOCK:       'ADD_BLOCK'
};
