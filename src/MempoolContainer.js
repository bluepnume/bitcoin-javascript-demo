import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

import Spinner from './Spinner';
import { mapIdToProps } from './lib/nodeMap';

const MempoolContainer = ({ mempool }) => (
  <div className="container mempool-container">
    <div className="inner-mempool">
      <div className="mempool-header">
        <h3>Current mempool</h3>
        <Spinner />
      </div>
      <div className="txns-container">
        {mempool.map((pt, index) => {
          const senderStyle = mapIdToProps(pt.sender) || {};
          const receiverStyle = mapIdToProps(pt.receiver) || {};

          return (
            <div key={index}>
              <div className="pending-txn">
                <div className="parties-container">
                  <div className="txn-labels">
                    <p>Sender</p>
                    <p>Receiver</p>
                  </div>
                  <div className="txn-parties">
                    <div className="txn-sender">
                      {senderStyle.icon && <FontAwesomeIcon icon={senderStyle.icon} color={senderStyle.color} />}
                      <p style={{ color: senderStyle.color }}>{pt.sender}</p>
                    </div>
                    <FontAwesomeIcon icon={faAngleRight} />
                    <div className="txn-receiver">
                      {receiverStyle.icon && <FontAwesomeIcon icon={receiverStyle.icon} color={receiverStyle.color} />}
                      <p style={{ color: receiverStyle.color }}>{pt.receiver}</p>
                    </div>
                  </div>
                </div>
                <div className="txn-details">
                  <div className="txn-labels">
                    <p>Amount</p>
                  </div>
                  <div className="txn-fees">
                    <p>{pt.amount}</p>
                    <p className="fee">+{pt.fee} fee</p>
                  </div>
                </div>
              </div>
              {(index !== mempool.length - 1) ?
                <hr className="separator" />
                : null
              }
            </div>
          );
        })}
      </div>
      {/* <pre>
        {
          JSON.stringify(mempool, null, 4)
        }
      </pre> */}
    </div>
  </div>
);

export default MempoolContainer;
