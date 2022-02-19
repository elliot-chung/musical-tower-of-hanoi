import { useState } from "react";
import ControlBar from "./ControlBar";
import Display from "./Display";

/**
 * This is the top level App component
 * @constructor
 */
function App() {
  // Top level states
  const [style, setStyle] = useState(["Red", "Yellow", "Blue"]);
  const [height, setHeight] = useState(3);
  const [volume, setVolume] = useState(100);
  const [solving, setSolving] = useState(false);
  const [done, setDone] = useState(false);
  const [speed, setSpeed] = useState(150);
  const [, setReset] = useState(false);

  //Return the DOM element
  return (
    <div className="App">
      <ControlBar
        style={style}
        setStyle={setStyle}
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
          style={style}
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

export default App;
