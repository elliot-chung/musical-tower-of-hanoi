import { useCallback, useEffect, useState } from "react";
import './index.css';

function App() {
  const [height, setHeight]   = useState(3);
  const [mute, setMute]       = useState(false);
  const [solving, setSolving] = useState(false);
  const [state, updateState]  = useState();
  const forceUpdate           = useCallback(() => updateState({}), []);
  const [done, setDone]       = useState(false);
  const [reset, setReset]     = useState(false);

  // if (done) {
  //   setTimeout(() => {setSolving(false)}, 2000);
  // }

  return (
    <div className="App">
      <ControlBar
          height={height}
          setHeight={setHeight}
          mute={mute}
          setMute={setMute}
          solving={solving}
          setSolving={setSolving}
          setReset={setReset}
          done={done}
          setDone={setDone}
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

// Controls for solving a tower of a specific height 
function ControlBar({height, setHeight, mute, setMute, solving, setSolving, setReset, done, setDone}) {
  // Solve function runs upon clicking 'Solve'
  const solve = (event) => {
    event.preventDefault();
    setSolving(true);
  }
  
  // Return the DOM element 
  return (
    <form onSubmit={solving || done ? ()=>{setReset(true)} : solve} className="sidebar">
      <label className="height">
        <p>Tower Height: {height}</p>
        <input 
          type="range" 
          min="3" 
          max="88" 
          value={height} 
          onChange={(event)=>{
            setHeight(event.target.value);
            setReset(false);
            setSolving(false);
            setDone(false);
          }}
          disabled={solving}
        />
      </label>
      <label className="mute">
        <span>Mute: </span> 
        <input 
          type="checkbox" 
          checked={mute} 
          onChange={(event)=>{setMute(event.target.checked)}}
        />
      </label>          
      <input type="submit" value={solving || done ? "Reset" : "Solve"}/>
    </form>
  );
}

function Display({height, solving, setDone, setSolving, forceUpdate}) {
  const t1 = [];
  for (let i=1; i<=height; i++) t1.push(i);
  const t2 = t1.map(()=>{return 0});
  const t3 = t2.map(x=>x);

  const [tArr1, setArr1] = useState(t1);
  const [tArr2, setArr2] = useState(t2);
  const [tArr3, setArr3] = useState(t3);

  const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
  const moveTower = useCallback(async (mHeight, source, dest, temp) => {
    if (mHeight === 1) {
      forceUpdate();
      await timeout(20);
      const blockInd = source.findIndex(width => width !== 0);
      const blockWidth = source[blockInd];
      source[blockInd] = 0;

      const topBlockInd = dest.findIndex(width => width !== 0);
      const destInd = topBlockInd === -1 ? dest.length-1 : topBlockInd - 1;
      dest[destInd] = blockWidth;

      return;
    }
    await moveTower(mHeight-1, source, temp, dest);
    await moveTower(1, source, dest, temp);
    await moveTower(mHeight-1, temp, dest, source);
  }, [forceUpdate]);

  useEffect(()=>{
    setArr1(t1);
    setArr2(t2);
    setArr3(t3);
  }, [height]);
  
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


  const firstTower = tArr1.map((width, index)=>{
    return <Block tHeight={height} width={width} key={index+"t1"}/>
  })
  const secondTower = tArr2.map((width, index)=>{
    return <Block tHeight={height} width={width} key={index+"t2"}/>
  })
  const thirdTower = tArr3.map((width, index)=>{
    return <Block tHeight={height} width={width} key={index+"t3"}/>
  })

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


function Block({tHeight, width}) {

  const pWidth = (width===0 ? 0 : 1000 + ((width-1)/(tHeight-1))*3000);
  return (
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
