import React from 'react';
import { mapIdToProps } from './lib/nodeMap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleUp,
  faAngleRight,
  faWrench,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';

const BlockContainer = ({ blocks }) => (
  <div className="container blocks-container">
    {blocks.map((block, index) => {
      const nodeStyle = mapIdToProps(block.miner) || {};

      return (
        <div key={block.id} className="block">
          <div className="inner-block" style={{ border: `5px solid ${nodeStyle.color}`}}>
            <p className="block-id">#{block.id}</p>
            <div className="miner-details">
              <p>Miner:</p>
              {nodeStyle.icon && <FontAwesomeIcon icon={nodeStyle.icon} color={nodeStyle.color} />}
              <p style={{ color: nodeStyle.color }}>{block.miner}</p>
            </div>
            <div className="block-metadata">
              <div className="metadata">
                <div className="label">Difficulty</div>
                <div className="value">
                  <FontAwesomeIcon icon={faWrench} />
                  <p>{block.difficulty}</p>
                </div>
              </div>
              <div className="metadata">
                <div className="label">Reward</div>
                <div className="value">
                  <FontAwesomeIcon icon={faBitcoin} />
                  <p>{block.reward} coins</p>
                </div>
              </div>
              <div className="metadata">
                <div className="label">Block mined at</div>
                <div className="value">
                  <FontAwesomeIcon icon={faClock} />
                  <p>{new Date(block.time).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="txns-container">
              <p>Block Transactions:</p>
              {block.transactions.length ?
                block.transactions.map((txn, key) => {
                  const senderStyle = mapIdToProps(txn.sender) || {};
                  const receiverStyle = mapIdToProps(txn.receiver) || {};

                  return (
                    <div key={key}>
                      <div className="block-txn">
                        <div className="parties-container">
                          <div className="txn-labels">
                            <p>Sender</p>
                            <p>Receiver</p>
                          </div>
                          <div className="txn-parties">
                            <div className="txn-sender">
                              {senderStyle.icon && <FontAwesomeIcon icon={senderStyle.icon} color={senderStyle.color} />}
                              <p style={{ color: senderStyle.color }}>{txn.sender}</p>
                            </div>
                            <FontAwesomeIcon icon={faAngleRight} />
                            <div className="txn-receiver">
                              {receiverStyle.icon && <FontAwesomeIcon icon={receiverStyle.icon} color={receiverStyle.color} />}
                              <p style={{ color: receiverStyle.color }}>{txn.receiver}</p>
                            </div>
                          </div>
                        </div>
                        <div className="txn-details">
                          <div className="txn-labels">
                            <p>Amount</p>
                          </div>
                          <div className="txn-fees">
                            <p>{txn.amount}</p>
                            <p className="fee">+{txn.fee} fee</p>
                          </div>
                        </div>
                      </div>
                      {(key !== block.transactions.length - 1) ?
                        <hr className="separator" />
                        : null
                      }
                    </div>
                  );
                })
                : <p className="no-txn-text">No transactions for this block</p>
              }
            </div>
          </div>
          {index !== blocks.length - 1 ?
            <FontAwesomeIcon icon={faAngleDoubleUp} />
            : null
          }
        </div>
      );
    })}
  </div>
);

export default BlockContainer;
