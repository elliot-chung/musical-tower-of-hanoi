import { useState } from "react";
import './index.css';

function App() {
  const [height, setHeight]   = useState(3);
  const [mute, setMute]       = useState(false);
  const [solving, setSolving] = useState(false);

  if (solving) {
    setTimeout(() => {setSolving(false)}, 2000);
  }

  return (
    <div className="App">
      <body>
      <ControlBar
          height={height}
          setHeight={setHeight}
          mute={mute}
          setMute={setMute}
          solving={solving}
          setSolving={setSolving}
        />
        <main>
          <Display/>
        </main>
      </body>
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

function Display(props) {
  return (
    <div>
      <Block tHeight="3" width="1" tower="1"/>
      <Block tHeight="3" width="2" tower="1"/>
      <Block tHeight="3" width="3" tower="1"/>
    </div>
  )
}

function Block({tHeight, width}) {
  const pWidth = 1000 + ((width-1)/(tHeight-1))*3000;
  return (
    <svg viewBox="0 0 4000 1000">
      <rect
        x="0" y="0" 
        width={pWidth} height="100%" />
    </svg>
  )
}

export default App;
