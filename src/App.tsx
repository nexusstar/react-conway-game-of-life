import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer'
const numRows = 50;
const numCols = 50;
// finding neighboars
const operation = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

//reset Grid to empty
const generateEmptyGrid = ()=>{
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows;
}

// Insert random seeds
const generateRandomState = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.3 ? 1 : 0)))
  }
  return rows;
}

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [running, setRunning] = useState(false);

  //in order to use running state in callback
  //it's need to use it as ref
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) { //kill condition if not running die
      return;
    }
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operation.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 1000);
  }, []);

  return (
    <React.Fragment>
      <button
        onClick = {()=> {
          setRunning(!running)
          //run simmulation if not running
          if(!running){
            runningRef.current = true;
            runSimulation();
          }
        }}>
        {running ? 'stop' : 'start'}
        </button>

          <button onClick={() => {setGrid(generateEmptyGrid());}}>
            clear
            </button>

              <button onClick={() => {
        setGrid(generateRandomState())
              }}>
                random
                </button>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${numCols}, 20px)`
                  }}>
                    {grid.map((rows, i) => rows.map((col, k) =>
                                                    <div
                                                      key={`${i}-${k}`}
                                                      onClick ={()=>{
                                                        const newGrid = produce(grid, gridCopy => {
                                                          gridCopy[i][k] = grid[i][k] ? 0 : 1;
                                                        });
                                                        setGrid(newGrid);
                                                      }}
                                                      style={{
                                                        height: 20, width: 20,
                                                        backgroundColor: grid[i][k] ? 'pink' : undefined,
                                                        border: 'solid 1px black'
                                                      }}
                                                    />
                                                        ))
                    }
                                                      </div>
                                                        </React.Fragment>
  );
}

export default App;
