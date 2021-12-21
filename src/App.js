import { useState } from "react";
import './index.css';

function App() {
  const [height, setHeight]   = useState(3);
  const [mute, setMute]       = useState(false);
  const [solving, setSolving] = useState(false);
  const [done, setDone]       = useState(false);

  if (done) {
    setTimeout(() => {setSolving(false)}, 2000);
  }

  return (
    <div className="App">
      <ControlBar
          height={height}
          setHeight={setHeight}
          mute={mute}
          setMute={setMute}
          solving={solving}
          setSolving={setSolving}
        />
        <main>
          <Display
            height={height}
            solving={solving}
            setDone={setDone}
          />
        </main>
    </div>
  );
}

// Controls for solving a tower of a specific height 
function ControlBar({height, setHeight, mute, setMute, solving, setSolving}) {
  // Solve function runs upon clicking 'Solve'
  const solve = (event) => {
    event.preventDefault();
    console.log("Height", height);
    console.log("Mute", mute);
    setSolving(true);
  }
  
  // Return the DOM element 
  return (
    <form onSubmit={solve} className="sidebar">
      <label className="height">
        <p>Tower Height: {height}</p>
        <input type="range" min="3" max="88" value={height} onChange={(event)=>{setHeight(event.target.value)}}/>
      </label>
      <label className="mute">
        <span>Mute: </span> 
        <input type="checkbox" checked={mute} onChange={(event)=>{setMute(event.target.checked)}}/>
      </label>          
      <input type="submit" value="Solve" disabled={solving}/>
    </form>
  );
}

function Display({height, solving, setDone}) {
  if (solving) setDone(true); 
  
  const arr = [];
  for (let i=1; i<=height; i++) arr.push(i);
  return (
    <div className="display">
      <div className="first tower">
        {arr.map((width)=>{
          return <Block tHeight={height} width={width} key={width}/>
        })}
      </div>
      <div className="second tower">
      </div>
      <div className="third tower">
      </div>
    </div>
  )
}

function Block({tHeight, width}) {
  const pWidth = 1000 + ((width-1)/(tHeight-1))*3000;
  return (
    <svg viewBox={`0 0 4000 1000`} preserveAspectRatio="none" className="block" key={width}>
      <rect
        x={2000-pWidth/2} y="0" 
        fill="red"
        stroke="black"
        strokeWidth="15"
        radius="20"
        width={pWidth} height="100%" 
        key={width}/>
    </svg>
  )
}

export default App;
