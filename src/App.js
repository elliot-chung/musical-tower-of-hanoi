import { useCallback, useEffect, useState } from "react";
import { Soundfont } from 'soundfont-player';
import './index.css';

/**
 * This is the top level App component
 * @constructor
 */
function App() {
  // Top level states
  const [height, setHeight]   = useState(3);
  const [mute, setMute]       = useState(false);
  const [solving, setSolving] = useState(false);
  const [done, setDone]       = useState(false);
  const [reset, setReset]     = useState(false);

  // Dummy state & function for forcing re-rerender
  const [state, updateState]  = useState();
  const forceUpdate           = useCallback(() => updateState({}), []);
  
  //Return the DOM element 
  return (
    <div className="App">
      <ControlBar
          height={height}
          setHeight={setHeight}
          mute={mute}
          setMute={setMute}
          solving={solving}
          setSolving={setSolving}
          done={done}
          setDone={setDone}
          setReset={setReset}
        />
        <main>
          <Display
            height={height}
            solving={solving}
            setDone={setDone}
            setSolving={setSolving}
            forceUpdate={forceUpdate}
          />
        </main>
    </div>
  );
}

/**
 * Controls for solving a tower of a specific height 
 * @constructor
 * @param {number}   height     - The height state of the app
 * @param {function} setHeight  - The setter function for the height state
 * @param {boolean}  mute       - The mute state of the app
 * @param {function} setMute    - The setter function for the mute state
 * @param {boolean}  solving    - The solving state of the app
 * @param {function} setSolving - The setter function for the solving state
 * @param {boolean}  done       - The done state of the app
 * @param {function} setDone    - The setter function for the done state
 * @param {function} setReset   - The setter function for the reset state
 */
function ControlBar({height, setHeight, mute, 
                     setMute, solving, setSolving, 
                     done, setDone, setReset}) {
  // Solve function runs upon clicking 'Solve'
  const solve = (event) => {
    event.preventDefault();
    setSolving(true);
  }
  
  // Return the DOM element 
  return (
    <form onSubmit={solving || done ? ()=>{setReset(true)} : solve}  // Reset if solving/done otherwise start solve
          className="sidebar"
    >
      <label className="height">
        <p>Tower Height: {height}</p> {/* Display Tower Height */}
        <input 
          type="range" 
          min="3" 
          max="88" 
          value={height} 
          onChange={(event)=>{
            // Set states whenever slider value changes
            setHeight(event.target.value);
            setReset(false);
            setSolving(false);
            setDone(false);
          }}
          disabled={solving /* Disable slider while solving */}
        />
      </label>
      <label className="mute">
        <span>Mute: </span> 
        <input 
          type="checkbox" 
          checked={mute} 
          onChange={(event)=>{setMute(event.target.checked)} /* Set state when mute box is clicked */}
        />
      </label>          
      <input type="submit" value={solving || done ? "Reset" : "Solve"}/> {/*Display text that aligns with function*/}
    </form>
  );
}

/**
 * Primary display area component containing the towers
 * @constructor
 * @param {number}   height      - The height state of the app
 * @param {boolean}  solving     - The solving state of the app
 * @param {function} setDone     - The setter function for the done state
 * @param {function} setSolving  - The setter function for the solving state
 * @param {function} forceUpdate - The top level force rerender function
 */
function Display({height, solving, setDone, setSolving, forceUpdate}) {
  // Internal arrays representing each tower and the widths of the blocks inside them
  const t1 = [];
  for (let i=1; i<=height; i++) t1.push(i);
  const t2 = t1.map(()=>{return 0});
  const t3 = t2.map(x=>x);

  // States representing each tower
  const [tArr1, setArr1] = useState(t1);
  const [tArr2, setArr2] = useState(t2);
  const [tArr3, setArr3] = useState(t3);

  // Timeout function for pausing between each move
  const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
  /**
   * Recursive function for moving a set of blocks from one tower to another
   * without breaking any of the rules of the Tower of Hanoi
   * 
   * An mHeight number of blocks will be moved from the source tower to the destination
   * tower while using the the temporary tower as a intermediary. When the function exits,
   * an mHeight number of blocks will have been removed from the source tower and rebuilt in
   * the correct order on the destination tower while the temporary tower is unchanged. 
   * @function
   * @param {number}   mHeight - The height of blocks to move 
   * @param {number[]} source  - An array of widths representing the source tower
   * @param {number[]} dest    - An array of widths representing the destination tower
   * @param {number[]} temp    - An array of widths representing the temporary tower
   */
  const moveTower = useCallback(async (mHeight, source, dest, temp) => {
    if (mHeight === 1) { // Recursive base case, a single block is moved 
      forceUpdate();     // Force rerender to display each step of the algorithm
      await timeout(1000);  // Wait some amount of time for all values to update

      // Find the block to move and store its width before removing it
      const blockInd = source.findIndex(width => width !== 0);
      const blockWidth = source[blockInd];
      source[blockInd] = 0;

      // Find the correct destination index in the dest array and add the stored block
      const topBlockInd = dest.findIndex(width => width !== 0);
      const destInd = topBlockInd === -1 ? dest.length-1 : topBlockInd - 1;
      dest[destInd] = blockWidth;

      return; // Function concludes here when moving a single block
    }
    // Move all the blocks above the bottom block in the source tower to the temporary tower
    await moveTower(mHeight-1, source, temp, dest); 
    // Move the the bottom block in the source tower to the destination tower
    await moveTower(1, source, dest, temp);
    // Move all the blocks that were moved to the temporary tower to the destination tower
    await moveTower(mHeight-1, temp, dest, source);
  }, [forceUpdate]);

  // Set the tower display state whenever the height state changes
  useEffect(()=>{
    setArr1(t1);
    setArr2(t2);
    setArr3(t3);
  }, [height]);
  
  // Solve function runs when solving state is true
  useEffect(() => {
    const solve = async ()=>{
      if (solving) {
        await moveTower(height, tArr1, tArr3, tArr2);
        setSolving(false);
        setDone(true); 
      }
    }
    solve();
  }, [solving, moveTower, height, tArr1, tArr2, tArr3, setSolving, setDone]);

  // Generate JSX based on states
  const firstTower = tArr1.map((width, index)=>{
    return <Block tHeight={height} width={width} key={index+"t1"}/>
  })
  const secondTower = tArr2.map((width, index)=>{
    return <Block tHeight={height} width={width} key={index+"t2"}/>
  })
  const thirdTower = tArr3.map((width, index)=>{
    return <Block tHeight={height} width={width} key={index+"t3"}/>
  })

  // Return DOM element
  return (
      <div className="display">
        <div className="first tower">
          {firstTower}
        </div>
        <div className="second tower">
          {secondTower}
        </div>
        <div className="third tower">
          {thirdTower}
        </div>
      </div>
  )
}

/**
 * The block component that represent each block in a tower 
 * @constructor
 * @param {number} tHeight - The tower height
 * @param {number} width   - The width of the block
 */
function Block({tHeight, width}) {
  // Calculate the pixel width from width input from the tower state array
  const pWidth = (width===0 ? 0 : 1000 + ((width-1)/(tHeight-1))*3000);
  return ( // Returns a centered svg rectangle with the correct width 
    <svg 
      viewBox={`0 0 4000 1000`} 
      preserveAspectRatio="none" 
      className={width===0 ? "emptyBlock": "block"} 
      key={width+"cnt"}
    >
      <rect
        x={2000-pWidth/2} y="0" 
        fill="red"
        stroke="black"
        strokeWidth="15"
        radius="20"
        width={pWidth} height="100%" 
        key={width+"rect"}/>
    </svg>
  )
}

export default App;
