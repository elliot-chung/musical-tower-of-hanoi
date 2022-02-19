import { useCallback, useEffect, useMemo, useState } from "react";
import Block from "./Block";
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
function Display({ height, solving, volume, speed, setDone, setSolving }) {
  // Color pallette arrays
  const ryb = ["red", "yellow", "blue"];
  const rgb = ["red", "green", "blue"];
  const rainbow = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ];
  const light1 = [
    "rgb(255, 248, 243)",
    "rgb(163, 228, 219)",
    "rgb(28, 109, 208)",
    "rgb(254, 209, 239)",
  ];

  const light2 = [
    "rgb(19, 148, 135)",
    "rgb(134, 198, 244)",
    "rgb(255, 241, 206)",
    "rgb(210, 157, 43)",
  ];

  const pallette = ryb;

  // Calculate the time between notes in ms
  const pause = useMemo(() => {
    return 60000 / speed;
  }, [speed]);

  // Internal arrays representing each tower and the widths of the blocks inside them
  const t1 = useMemo(() => {
    return [...Array(height).keys()].map((x) => x + 1);
  }, [height]);
  const t2 = useMemo(() => {
    return t1.map(() => {
      return 0;
    });
  }, [t1]);
  const t3 = useMemo(() => {
    return t2.map((x) => x);
  }, [t2]);

  // Internal arrays representing the colors of each tower
  const c1 = useMemo(() => {
    return t1.map((value, index) => {
      return index % pallette.length;
    });
  }, [t1, pallette.length]);
  const c2 = useMemo(() => {
    return c1.map(() => {
      return -1;
    });
  }, [c1]);
  const c3 = useMemo(() => {
    return c2.map((x) => x);
  }, [c2]);

  // States representing each tower
  const [tArr1, setArr1] = useState(t1);
  const [tArr2, setArr2] = useState(t2);
  const [tArr3, setArr3] = useState(t3);

  // States representing each tower's colors
  const [cArr1, setColors1] = useState(c1);
  const [cArr2, setColors2] = useState(c2);
  const [cArr3, setColors3] = useState(c3);

  // Set the tower display state whenever the height state changes
  useEffect(() => {
    setArr1([...t1]);
    setArr2([...t2]);
    setArr3([...t3]);
    setColors1([...c1]);
    setColors2([...c2]);
    setColors3([...c3]);
  }, [t1, t2, t3, c1, c2, c3]);

  // Variables for playing sounds
  const Soundfont = useMemo(() => {
    return require("soundfont-player");
  }, []);
  const ac = useMemo(() => {
    return new AudioContext();
  }, []);
  const sfPromise = useMemo(() => {
    return Soundfont.instrument(ac, "acoustic_grand_piano");
  }, [Soundfont, ac]);

  /**
   * Function that returns a note based on the width parameter and the height of the
   * current tower
   * @function
   * @param   {number} blockWidth - The width of the block to find the corresponding note of
   * @returns {string}            - The note associated with this block width
   */
  const findNote = useCallback(
    (blockWidth) => {
      // Calculate the the note to play
      const noteInd = (blockWidth + 3) % 7;
      const noteArr = ["G", "F", "E", "D", "C", "B", "A"];

      const towerHeightLevel = Math.floor(height / 7);
      const startOctArr = ["4", "4", "4", "5", "6", "7", "8"];
      const startOct = startOctArr[towerHeightLevel];

      const blockHeightLevel = Math.ceil((blockWidth - 1) / 7);
      const octArr = ["1", "2", "3", "4", "5", "6", "7", "8"];
      const octStartInd = startOct - 1;
      const octInd = octStartInd - blockHeightLevel;

      // Return the note
      return `${noteArr[noteInd]}${octArr[octInd]}`;
    },
    [height]
  );

  /**
   * Timeout function for pausing between each solve step
   * @function
   * @param {number} ms - The pause duration in milliseconds
   */
  const timeout = useCallback(
    (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    []
  );

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
  const moveTower = useCallback(
    async (
      mHeight,
      setSource,
      setDest,
      setTemp,
      setcSource,
      setcDest,
      setcTemp
    ) => {
      if (mHeight === 1) {
        // Recursive base case, a single block is moved

        const instrument = await sfPromise; // Variables for playing notes

        // Find the block to move and store its width before removing it
        let blockInd, blockWidth, blockColor;
        setSource((source) => {
          blockInd = source.findIndex((width) => width !== 0);
          blockWidth = source[blockInd];
          const srcCpy = [...source];
          srcCpy[blockInd] = 0;
          return srcCpy;
        });

        const note = findNote(blockWidth); // Run find note function

        // Store the color of the same block and remove the color as well
        setcSource((cSource) => {
          blockColor = cSource[blockInd];
          const srcCpy = [...cSource];
          srcCpy[blockInd] = -1;
          return srcCpy;
        });

        volume !== 0 && instrument.play(note, 0, { gain: volume / 100 }); // Play the note

        // Find the correct destination index in the dest array and add the stored block
        let destInd;
        setDest((dest) => {
          const topBlockInd = dest.findIndex((width) => width !== 0);
          destInd = topBlockInd === -1 ? dest.length - 1 : topBlockInd - 1;
          const destCpy = [...dest];
          destCpy[destInd] = blockWidth;
          return destCpy;
        });

        // Set the color of the same block to the store color
        setcDest((cDest) => {
          const destCpy = [...cDest];
          destCpy[destInd] = blockColor;
          return destCpy;
        });

        await timeout(pause); // Wait some amount of time for all values to update
        return; // Function concludes here when moving a single block
      }
      // Move all the blocks above the bottom block in the source tower to the temporary tower
      await moveTower(
        mHeight - 1,
        setSource,
        setTemp,
        setDest,
        setcSource,
        setcTemp,
        setcDest
      );
      // Move the the bottom block in the source tower to the destination tower
      await moveTower(
        1,
        setSource,
        setDest,
        setTemp,
        setcSource,
        setcDest,
        setcTemp
      );
      // Move all the blocks that were moved to the temporary tower to the destination tower
      await moveTower(
        mHeight - 1,
        setTemp,
        setDest,
        setSource,
        setcTemp,
        setcDest,
        setcSource
      );
    },
    [volume, pause, findNote, sfPromise, timeout]
  );

  /**
   * The solve function that solves the tower and sets the solving and done state afterwards
   * @function
   */
  const solve = useCallback(async () => {
    await moveTower(
      height,
      setArr1,
      setArr3,
      setArr2,
      setColors1,
      setColors3,
      setColors2
    );
    setSolving(false);
    setDone(true);
  }, [
    moveTower,
    setSolving,
    setDone,
    height,
    setArr1,
    setArr2,
    setArr3,
    setColors1,
    setColors2,
    setColors3,
  ]);

  // Solve function runs when solving state is true
  useEffect(() => {
    solving && solve();
  }, [solving, solve]);

  // Generate JSX based on states
  const firstTower = tArr1.map((width, index) => {
    return (
      <Block
        tHeight={height}
        width={width}
        color={pallette[cArr1[index]]}
        key={index + "t1"}
      />
    );
  });
  const secondTower = tArr2.map((width, index) => {
    return (
      <Block
        tHeight={height}
        width={width}
        color={pallette[cArr2[index]]}
        key={index + "t2"}
      />
    );
  });
  const thirdTower = tArr3.map((width, index) => {
    return (
      <Block
        tHeight={height}
        width={width}
        color={pallette[cArr3[index]]}
        key={index + "t3"}
      />
    );
  });

  // Return DOM element
  return (
    <div className="display">
      <div className="first tower">{firstTower}</div>
      <div className="second tower">{secondTower}</div>
      <div className="third tower">{thirdTower}</div>
    </div>
  );
}

export default Display;
