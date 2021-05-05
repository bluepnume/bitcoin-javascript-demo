import React from 'react';

import { mapIdToProps } from './lib/nodeMap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';

const NodeContainer = ({ nodes, balances, blocks }) => (
  <div className="container nodes-container">
    {nodes.map((node, index) => {
      const minedBlocks = blocks.filter(block => block.miner === node.id);
      const numMinedBlocks = minedBlocks.length;
      const balance = balances[node.id] || 0;
      const nodeStyle = mapIdToProps(node.id) || {};

      return (
        <div className="inner-node" key={index}>
          <div className="node">
            <div className="node-id">
              <p>Node id:</p>
              {nodeStyle.icon && <FontAwesomeIcon icon={nodeStyle.icon} color={nodeStyle.color} />}
              <p style={{ color: nodeStyle.color }}>{node.id}</p>
            </div>
            <p>
              <FontAwesomeIcon icon={faLayerGroup} />
              {`${numMinedBlocks} blocks`}
            </p>
            <p>
              <FontAwesomeIcon icon={faBitcoin} />
              {`${balance} coins`}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

export default NodeContainer;
