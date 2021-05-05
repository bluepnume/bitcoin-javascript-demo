
import './App.css';
import { useNodes } from './ui/hooks';

function App() {
  const { nodes, blocks, balances, mempool } = useNodes();

  return (
    <div className="App">
      <div>
        <pre>
          {
            JSON.stringify(nodes, null, 4)
          }
        </pre>
      </div>
      <hr />
      <div>
        <pre>
          {
            JSON.stringify(mempool, null, 4)
          }
        </pre>
      </div>
      <hr />
      <div>
        <pre>
          {
            JSON.stringify(balances, null, 4)
          }
        </pre>
      </div>
      <hr />
      {
        blocks.map(block => {
          return <div>
            <pre>
              {
                JSON.stringify(block, null, 4)
              }
            </pre>
          </div>
        })
      }
    </div>
  );
}

export default App;
