/**
 * The block component that represent each block in a tower
 * @constructor
 * @param {number} tHeight - The tower height
 * @param {number} width   - The width of the block
 */
function Block({ tHeight, width, color }) {
  // Calculate the pixel width from width input from the tower state array
  const pWidth = width === 0 ? 0 : 1000 + ((width - 1) / (tHeight - 1)) * 3000;
  // Calculate ry property accounting for distortion
  const radiusY = 100 + Math.min((tHeight - 3) / 20, 1) * 400;

  return (
    // Returns a centered svg rectangle with the correct width
    <svg
      viewBox={"0 0 4000 1000"}
      preserveAspectRatio="none"
      className={width === 0 ? "emptyBlock" : "block"}
      key={width + "cnt"}
    >
      <rect
        x={2000 - pWidth / 2}
        y="0"
        fill={color}
        rx="100"
        ry={radiusY}
        width={pWidth}
        height="100%"
        key={width + "rect"}
      />
    </svg>
  );
}

export default Block;
