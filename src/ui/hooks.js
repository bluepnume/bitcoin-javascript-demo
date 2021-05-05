
import { useEffect, useState } from 'react';

import { BitcoinNode } from '../bitcoin/node';
import { hashAndPack } from '../lib/crypto';
import { randomEntry } from '../lib/util';

const MAX_ID_LENGTH = 10;

const getPublicID = (publicKey) => {
  return publicKey.length < MAX_ID_LENGTH ? publicKey : JSON.parse(atob(publicKey)).n.slice(0, MAX_ID_LENGTH)
}

export function useNodes() {
  const [ blocks, setBlocks ] = useState([]);
  const [ balances, setBalances ] = useState({});

  useEffect(() => {
    const nodes = [];

    for (const _ of new Array(5).fill()) {
      const node = BitcoinNode();
      node.run();
      nodes.push(node);
    }

    let sent = {};
    let blockcount = 1;

    setInterval(async () => {
      const blockChain = nodes[0].getBlockChain();
      const longestChain = blockChain.getBlocks().getRoot().getLongestChain();
      const rawBalances = await blockChain.getBalances();

      const blocks = [];
      for (const node of longestChain) {
        const { miner, parentid, id, time, transactions, difficulty, reward } = node.getValue();

        const txns = [];

        for (const transaction of transactions) {
          const { sender, receiver, amount, fee } = transaction;
          txns.push({
            sender: getPublicID(sender),
            receiver: getPublicID(receiver),
            amount,
            fee
          })
        }

        const { hash } = await hashAndPack(node.getValue())

        blocks.unshift({
          miner: getPublicID(miner),
          parentid,
          id,
          time,
          transactions: txns,
          difficulty,
          reward,
          hash
        })
      }
      setBlocks(blocks);

      const balances = {};
      for (const [ account, balance ] of Object.entries(rawBalances)) {
          balances[getPublicID(account)] = balance;
      }
      setBalances(balances)

      const len = blockChain.getBlocks().getRoot().getLongestChain().length;
      if (len > blockcount) {
        blockcount = len;
        sent = {};
      }

      const sender = randomEntry(nodes);
      const senderPublicKey = await sender.getPublicKey();

      if (sent[senderPublicKey]) {
        return;
      }
      sent[senderPublicKey] = true;

      let receiver;
      while (!receiver || receiver === sender) {
        receiver = randomEntry(nodes);
      }
      const receiverPublicKey = await receiver.getPublicKey();

      const balance = rawBalances[senderPublicKey];

      if (!balance) {
        return;
      }

      const amount = Math.floor(Math.random() * balance * 0.5);
      const fee = Math.max(1, Math.floor(Math.random() * amount * 0.03));

      await sender.send(receiverPublicKey, amount, fee);
    }, 100);
  }, []);

  return { blocks, balances }
}
