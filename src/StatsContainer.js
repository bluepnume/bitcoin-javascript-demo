import React from 'react';
import { ResponsiveLine } from '@nivo/line'

class StatsContainer extends React.Component {
  state = {
    currReward: 0,
    currDiff: 0,
    totalBlocks: 0,
    avgTime: 0,
    rewardsArr: [],
    diffArr: [],
  };

  componentDidUpdate = (prevProps) => {
    const { blocks } = this.props;
    if (!blocks.length || (JSON.stringify(prevProps.blocks) === JSON.stringify(blocks))) {
      return;
    }

    const totalBlockDiffs = [];
    for (let i = 0; i < blocks.length; i++) {
      if (i !== 0) {
        const currTime = blocks[i].time;
        const prevTime = blocks[i - 1].time;
        totalBlockDiffs.push(Math.abs(currTime - prevTime));
      }
    }
 
    this.setState({
      currReward: blocks[0].reward,
      currDiff: blocks[0].difficulty,
      totalBlocks: blocks.length,
      avgTime: Math.round((totalBlockDiffs.slice(0, 10).reduce((x, y) => x + y, 0)) / totalBlockDiffs.slice(0, 10).length),
      rewardsArr: ([...blocks].reverse().map((block, index) => ({y: block.reward, x: index + 1 }))),
      diffArr: ([...blocks].reverse().map((block, index) => ({y: block.difficulty, x: index + 1 }))),
    });
  };

  render = () => {
    const {
      currReward,
      currDiff,
      totalBlocks,
      avgTime,
      rewardsArr,
      diffArr,
    } = this.state;

    return (
      <div className="container stats-container">
        <div className="stats-metadata">
          <div className="stat">
            <div className="label">
              <p>Total blocks mined:</p>
            </div>
            <div className="value">
              <p>{totalBlocks}</p>
            </div>
          </div>
          <div className="stat">
            <div className="label">
              <p>Current reward:</p>
            </div>
            <div className="value">
              <p>{currReward} coins</p>
            </div>
          </div>
          <div className="stat">
            <div className="label">
              <p>Current difficulty:</p>
            </div>
            <div className="value">
              <p>{currDiff}</p>
            </div>
          </div>
          <div className="stat">
            <div className="label">
              <p>Average time between blocks:</p>
            </div>
            <div className="value">
              <p>{avgTime}ms</p>
            </div>
          </div>
        </div>
        <div className="graphs-container">
          <div className="rewards-graph" style={{ height: '300px', width: '50%' }}>
            <h4>Reward over time</h4>
            <ResponsiveLine
              data={[
                {
                  id: 'rewards',
                  data: rewardsArr,
                },
              ]}
              margin={{ top: 10, right: 40, bottom: 80, left: 40 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear' }}
              axisBottom={null}
              axisLeft={{
                orient: 'left',
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              labelTextColor="white"
              curve="monotoneX"
              enableArea
              enableGridX={false}
              enableGridY={false}
              colors={[ '#17FFEE' ]}
              lineWidth={3}
              enablePoints={false}
              enableCrosshair={false}
              useMesh={true}
              legends={[]}
              isInteractive={false}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: "#ffffff",
                      fontSize: '13px',
                      fontFamily: 'Monaco, Arial, sans-serif',
                      opacity: '0.67',
                    },
                  },
                },
              }}
            />
          </div>
          <div className="difficulty-graph" style={{ height: '300px', width: '50%' }}>
            <h4>Difficulty over time</h4>
            <ResponsiveLine
              data={[
                {
                  id: 'rewards',
                  data: diffArr,
                },
              ]}
              margin={{ top: 10, right: 40, bottom: 80, left: 40 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear' }}
              axisBottom={null}
              axisLeft={{
                orient: 'left',
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: "#ffffff",
                      fontSize: '13px',
                      fontFamily: 'Monaco, Arial, sans-serif',
                      opacity: '0.67',
                    },
                  },
                },
              }}
              curve="monotoneX"
              enableArea
              enableGridX={false}
              enableGridY={false}
              colors={[ '#17FFEE' ]}
              lineWidth={3}
              enablePoints={false}
              enableCrosshair={false}
              useMesh={true}
              legends={[]}
              isInteractive={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default StatsContainer;
