
import './App.css';
import { useNodes } from './ui/hooks';

function App() {
  const { blocks, balances } = useNodes();
  
  return (
    <div className="App">
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
