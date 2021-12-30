import { useCallback, useEffect, useMemo, useState } from "react";
import './index.css'; 
const Soundfont = require('soundfont-player');
const ac = new AudioContext()

/**
 * This is the top level App component
 * @constructor
 */
function App() {
  // Top level states
  const [height, setHeight]   = useState(3);
  const [volume, setVolume]   = useState(100);
  const [solving, setSolving] = useState(false);
  const [done, setDone]       = useState(false);
  const [speed, setSpeed]     = useState(150);
  const [reset, setReset]     = useState(false);
  
  //Return the DOM element 
  return (
    <div className="App">
      <ControlBar
          height={height}
          setHeight={setHeight}
          volume={volume}
          setVolume={setVolume}
          solving={solving}
          setSolving={setSolving}
          done={done}
          setDone={setDone}
          speed={speed}
          setSpeed={setSpeed}
          setReset={setReset}
        />
        <main>
          <Display
            height={height}
            solving={solving}
            volume={volume}
            speed={speed}
            setDone={setDone}
            setSolving={setSolving}
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
 * @param {number}   volume     - The volume state of the app
 * @param {function} setVolume  - The setter function for the volume state
 * @param {boolean}  solving    - The solving state of the app
 * @param {function} setSolving - The setter function for the solving state
 * @param {boolean}  done       - The done state of the app
 * @param {function} setDone    - The setter function for the done state
 * @param {number}   speed      - The speed state of the app
 * @param {function} setSpeed   - The setter function for the speed state
 * @param {function} setReset   - The setter function for the reset state
 */
function ControlBar({height, setHeight, volume, 
                     setVolume, solving, setSolving, 
                     done, setDone, speed, 
                     setSpeed, setReset}) {
  // Solve function runs upon clicking 'Solve'
  const solve = useCallback((event) => {
    event.preventDefault();
    setSolving(true);
  },[setSolving]);
  
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
          max="48" 
          value={height} 
          onChange={(event)=>{
            // Set states whenever slider value changes
            setHeight(Number(event.target.value));
            setReset(false);
            setSolving(false);
            setDone(false);
          }}
          disabled={solving /* Disable slider while solving */}
          className="slider"
        />
      </label>
      <label className="volume">
        <p>Volume: {volume}</p> 
        <input 
          type="range" 
          min="0"
          max="100"
          value={volume}
          onChange={(event)=>{setVolume(Number(event.target.value))} /* Set state when volume box is changed */}
          disabled={solving /* Disable slider while solving */}
          className="slider"
        />
      </label> 
      <label className="speed">
        <p>BPM: {speed}</p> 
        <input 
          type="range" 
          min="30"
          max="300"
          value={speed}
          onChange={(event)=>{setSpeed(Number(event.target.value))} /* Set state when volume box is changed */}
          disabled={solving /* Disable slider while solving */}
          className="slider"
        />
      </label>          
      <input type="submit" 
             value={solving || done ? "Reset" : "Solve" /*Display text that aligns with function*/}
             className={solving || done ? "submit reset" : "submit solve"}/> 
    </form>
  );
}

/**
 * Primary display area component containing the towers
 * @constructor
 * @param {number}   height      - The height state of the app
 * @param {boolean}  solving     - The solving state of the app
 * @param {number}   volume      - The volume state of the app
 * @param {number}   speed       - The speed state of the app
 * @param {function} setDone     - The setter function for the done state
 * @param {function} setSolving  - The setter function for the solving state
 */
function Display({height, solving, volume, speed, setDone, setSolving}) {
  // Color pallette arrays
  const rainbow = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  const light1 = ["rgb(255, 248, 243)", "rgb(163, 228, 219)", "rgb(28, 109, 208)", "rgb(254, 209, 239)"];

  const pallette = rainbow;

  // Calculate the time between notes in ms
  const pause = useMemo(()=>{return 60000/speed}, [speed]);

  // Internal arrays representing each tower and the widths of the blocks inside them
  const t1 = useMemo(()=>{ return [...Array(height).keys()].map( x=>x+1 ) }, [height]);
  const t2 = useMemo(()=>{ return t1.map(()=>{ return 0 }); }, [t1]);
  const t3 = useMemo(()=>{ return t2.map( x=>x ); }, [t2]);  

  // Internal arrays representing the colors of each tower
  const c1 = useMemo(()=>{ return t1.map((value, index)=>{ return index % pallette.length }) }, [t1, pallette.length]);
  const c2 = useMemo(()=>{ return c1.map(()=>{ return -1 }) }, [c1]);
  const c3 = useMemo(()=>{ return c2.map(x=>x) }, [c2]);

  // States representing each tower
  const [tArr1, setArr1] = useState(t1);
  const [tArr2, setArr2] = useState(t2);
  const [tArr3, setArr3] = useState(t3);

  // States representing each tower's colors
  const [cArr1, setColors1] = useState(c1);
  const [cArr2, setColors2] = useState(c2);
  const [cArr3, setColors3] = useState(c3);

  // Set the tower display state whenever the height state changes
  useEffect(()=>{
    setArr1([...t1]);
    setArr2([...t2]);
    setArr3([...t3]);
    setColors1([...c1]);
    setColors2([...c2]);
    setColors3([...c3]);
  }, [t1, t2, t3, c1, c2, c3]);
  
  /**
   * Recursive function for moving a set of blocks from one tower to another
   * without breaking any of the rules of the Tower of Hanoi
   * 
   * An mHeight number of blocks will be moved from the source tower to the destination
   * tower while using the the temporary tower as a intermediary. When the function exits,
   * an mHeight number of blocks will have been removed from the source tower and rebuilt in
   * the correct order on the destination tower while the temporary tower is unchanged. 
   * @function
   * @param {number}   mHeight    - The height of blocks to move 
   * @param {number[]} setSource  - An array of widths representing the source tower
   * @param {number[]} setDest    - An array of widths representing the destination tower
   * @param {number[]} setTemp    - An array of widths representing the temporary tower
   * @param {number[]} setcSource - An array of color indices representing the source tower colors
   * @param {number[]} setcDest   - An array of color indices representing the destination tower color
   * @param {number[]} setcTemp   - An array of color indices representing the temporary tower colors
   */
  const moveTower = useCallback(async (mHeight, 
                                       setSource, setDest, setTemp,
                                       setcSource, setcDest, setcTemp) => {
    if (mHeight === 1) { // Recursive base case, a single block is moved 
      // Timeout function for pausing between each move
      const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

      let blockInd, blockWidth, blockColor;
      // Find the block to move and store its width before removing it
      setSource((source)=>{
        blockInd = source.findIndex(width => width !== 0);
        blockWidth = source[blockInd];
        const srcCpy = [...source];
        srcCpy[blockInd] = 0;
        return srcCpy;
      });

      // Store the color of the same block and remove the color as well
      setcSource((cSource)=>{
        blockColor = cSource[blockInd];
        const srcCpy = [...cSource];
        srcCpy[blockInd] = -1;
        return srcCpy;
      });

      // Find the correct destination index in the dest array and add the stored block
      let destInd;
      setDest((dest)=>{
        const topBlockInd = dest.findIndex(width => width !== 0);
        destInd = topBlockInd === -1 ? dest.length-1 : topBlockInd - 1;
        const destCpy = [...dest];
        destCpy[destInd] = blockWidth;
        return destCpy;
      });

      // Set the color of the same block to the store color
      setcDest((cDest)=>{
        const destCpy = [...cDest];
        destCpy[destInd] = blockColor;
        return destCpy;
      });  

      // Calculate the the note to play
      const noteInd = ((blockWidth + 3) % 7);
      const noteArr = ["G", "F", "E", "D", "C", "B", "A"];
      
      const towerHeightLevel = Math.floor(height/7);
      const startOctArr = ["4", "4", "4", "5", "6", "7", "8"];
      const startOct = startOctArr[towerHeightLevel];

      const blockHeightLevel = Math.ceil((blockWidth-1)/7);
      const octArr = ["1", "2", "3", "4", "5", "6", "7", "8"];
      const octStartInd = octArr.findIndex(oct=>oct===startOct);
      const octInd = octStartInd - blockHeightLevel;

      // Play the note
      const note = `${noteArr[noteInd]}${octArr[octInd]}`;
      volume !== 0 && Soundfont.instrument(ac, "acoustic_grand_piano")
                        .then(function (instrument) {
                        instrument.play(note, 0, {gain: volume/100});
                        });
      await timeout(pause);  // Wait some amount of time for all values to update
      return; // Function concludes here when moving a single block
    }
    // Move all the blocks above the bottom block in the source tower to the temporary tower
    await moveTower(mHeight-1, setSource, setTemp, setDest, setcSource, setcTemp, setcDest); 
    // Move the the bottom block in the source tower to the destination tower
    await moveTower(1, setSource, setDest, setTemp, setcSource, setcDest, setcTemp);
    // Move all the blocks that were moved to the temporary tower to the destination tower
    await moveTower(mHeight-1, setTemp, setDest, setSource, setcTemp, setcDest, setcSource);
  }, [volume, pause, height]); 
  
  // Solve function runs when solving state is true
  useEffect(() => {
    const solve = async ()=>{
      if (solving) {
        await moveTower(height, 
                        setArr1, setArr3, setArr2, 
                        setColors1, setColors3, setColors2);
        setSolving(false);
        setDone(true); 
      }
    }
    solve();
  }, [solving]);

  // Generate JSX based on states
  const firstTower = tArr1.map((width, index)=>{
    return <Block tHeight={height} width={width} color={pallette[cArr1[index]]} key={index+"t1"}/>
  })
  const secondTower = tArr2.map((width, index)=>{
    return <Block tHeight={height} width={width} color={pallette[cArr2[index]]} key={index+"t2"}/>
  })
  const thirdTower = tArr3.map((width, index)=>{
    return <Block tHeight={height} width={width} color={pallette[cArr3[index]]} key={index+"t3"}/>
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
function Block({tHeight, width, color}) {
  // Calculate the pixel width from width input from the tower state array
  const pWidth = (width===0 ? 0 : 1000 + ((width-1)/(tHeight-1))*3000);
  // Calculate ry property accounting for distortion
  const radiusY = 100 + (Math.min((tHeight-3)/20, 1)*400);

  return ( // Returns a centered svg rectangle with the correct width 
    <svg 
      viewBox={"0 0 4000 1000"} 
      preserveAspectRatio="none" 
      className={width===0 ? "emptyBlock": "block"} 
      key={width+"cnt"}
    >
      <rect
        x={2000-pWidth/2} y="0" 
        fill={color}
        rx="100"
        ry={radiusY}
        width={pWidth} height="100%" 
        key={width+"rect"}
      />
    </svg>
  )
}

export default App;
