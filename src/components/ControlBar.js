import { useCallback } from "react";
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
function ControlBar({
  height,
  setHeight,
  volume,
  setVolume,
  solving,
  setSolving,
  done,
  setDone,
  speed,
  setSpeed,
  setReset,
}) {
  // Solve function that runs upon clicking 'Solve'
  const solve = useCallback(
    (event) => {
      event.preventDefault();
      setSolving(true);
    },
    [setSolving]
  );

  // Return the DOM element
  return (
    <form
      onSubmit={
        solving || done
          ? () => {
              setReset(true);
            }
          : solve
      } // Reset if solving/done otherwise start solve
      className="sidebar"
    >
      <label className="height">
        <p>Tower Height: {height}</p> {/* Display Tower Height */}
        <input
          type="range"
          min="3"
          max="48"
          value={height}
          onChange={(event) => {
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
          onChange={
            (event) => {
              setVolume(Number(event.target.value));
            } /* Set state when volume box is changed */
          }
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
          onChange={
            (event) => {
              setSpeed(Number(event.target.value));
            } /* Set state when volume box is changed */
          }
          disabled={solving /* Disable slider while solving */}
          className="slider"
        />
      </label>
      <input
        type="submit"
        value={
          solving || done
            ? "Reset"
            : "Solve" /*Display text that aligns with function*/
        }
        className={solving || done ? "submit reset" : "submit solve"}
      />
    </form>
  );
}

export default ControlBar;
