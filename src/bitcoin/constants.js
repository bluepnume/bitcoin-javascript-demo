/* @flow */

import { now } from "../lib/util"

export type TransactionType = {|
    sender : string,
    receiver : string,
    amount : number,
    fee : number
|};

export type BlockType = {|
    miner : string,
    parentid : string,
    id : string,
    index : number,
    time : number,
    elapsed : number,
    transactions : Array<TransactionType>,
    difficulty : number,
    reward : number
|};

export const BLOCK_TIME = 1000;

export const INITIAL_REWARD = 1024;

export const REWARD_HALVING_SCHEDULE = 20;

export const BLOCK_SIZE_LIMIT = 10;

export const GENESIS_BLOCK : BlockType = {
    id:           'GENESIS',
    parentid:     'GENESIS',
    miner:        'SATOSHI',
    index:        1,
    time:         now(),
    elapsed:      0,
    transactions: [],
    difficulty:   1,
    reward:       INITIAL_REWARD
};

export const PRICE_FORMULA = (days : number) : number =>
    10 ** (2.9065 * Math.log(days) - 19.493);

