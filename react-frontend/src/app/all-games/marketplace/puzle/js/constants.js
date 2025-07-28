import { centerSprite } from "./utils";

const assetsToLoad = ["./m13e.png", "./m13e-bg.png"];

const sizes = {
  mapSize: 25,
  tileSize: 16,
  heroSize: 8,
  coinSize: 12,
};

const heroInitialPosition =
  21 * sizes.tileSize + centerSprite(sizes.tileSize, sizes.heroSize);

const coinSpriteCenter = centerSprite(sizes.tileSize, sizes.coinSize);

const coinsPosition = [
  [],
  [[15, 17]],
  [
    [7, 11],
    [19, 5],
  ],
  [
    [7, 15],
    [7, 5],
    [21, 3],
  ],
  [
    [5, 13],
    [3, 11],
    [11, 3],
    [5, 5],
  ],
  [
    [19, 15],
    [5, 5],
    [15, 9],
    [11, 17],
    [11, 7],
  ],
  [
    [13, 15],
    [17, 15],
    [20, 11],
    [17, 3],
    [13, 13],
    [3, 8],
  ],
  [],
  [],
];

const wallsPosition = [
  [
    [17, 20],
    [22, 21],
  ],
  [
    [17, 20],
    [22, 21],
  ],
  [
    [17, 20],
    [22, 21],
  ],
  [
    [17, 20],
    [22, 21],
  ],
  [
    [17, 20],
    [22, 21],
  ],
  [[22, 21]],
  [[22, 21]],
  [],
  [],
];

const portalsPosition = [
  [],
  [],
  [],
  [],
  [],
  [[17, 20]],
  [[17, 20]],
  [
    [17, 20],
    [22, 21],
  ],
  [],
];

const lavaLv5 = [
  [7, 15],
  [7, 16],
  [7, 17],
  [6, 17],
  [5, 17],
  [5, 18],
  [5, 19],
  [4, 19],
  [4, 20],
  [6, 19],
];
const lavaLv6 = [
  [11, 19],
  [11, 20],
  [11, 21],
  [10, 19],
  [12, 21],
];
const lavaLv7 = [
  [9, 18],
  [9, 17],
  [8, 17],
  [9, 19],
  [16, 17],
  [16, 16],
  [17, 16],
  [17, 16],
  [15, 17],
];
const lavaLv8 = [
  [9, 18],
  [9, 17],
  [8, 17],
  [9, 19],
  [16, 17],
  [16, 16],
  [17, 16],
  [17, 16],
  [15, 17],
  [15, 17],
  [17, 17],
  [17, 18],
  [17, 19],
  [16, 19],
];

const lavaPositions = [
  [],
  [],
  [],
  [],
  [...lavaLv5],
  [...lavaLv5, ...lavaLv6],
  [...lavaLv5, ...lavaLv6, ...lavaLv7],
  [...lavaLv5, ...lavaLv6, ...lavaLv7, ...lavaLv8],
  [],
];

const positions = {
  hero: {
    x: heroInitialPosition,
    y: heroInitialPosition,
  },
  coins: coinsPosition.map((positions) =>
    positions.map(([x, y]) => ({
      x: x * sizes.tileSize + coinSpriteCenter,
      y: y * sizes.tileSize + coinSpriteCenter,
    }))
  ),
  walls: wallsPosition.map((positions) =>
    positions.map(([x, y]) => ({
      x: x * sizes.tileSize,
      y: y * sizes.tileSize,
    }))
  ),
  lavas: lavaPositions.map((positions) =>
    positions.map(([x, y]) => ({
      x: x * sizes.tileSize,
      y: y * sizes.tileSize,
    }))
  ),
  portals: portalsPosition.map((positions) =>
    positions.map(([x, y]) => ({
      x: x * sizes.tileSize,
      y: y * sizes.tileSize,
    }))
  ),
  finish: {
    x: sizes.tileSize * 2,
    y: sizes.tileSize * 3,
  },
};

const directionMapper = Object.entries({
  arrowup: {
    direction: -1,
    axis: "y",
  },
  arrowdown: {
    direction: 1,
    axis: "y",
  },
  arrowleft: {
    direction: -1,
    axis: "x",
  },
  arrowright: {
    direction: 1,
    axis: "x",
  },
  space: {},
});

const colors = {
  hero: "#ffffff",
  coin: "#ffd166",
  wall: "#073b4c",
  finish: "#06d6a0",
  lava: "#ef476f",
  portal: "#f78c6b",
};

const instructions = [
  "Find the exit, no pressure... except the clock!",
  "Grab a coin, then run for your life!",
  "Two coins, one goal: survive!",
  "Three coins and the finish line. Go get rich!",
  "Four coins and avoid the lava. It's a hot mess!",
  "Five coins, dodge the lava, and oh yeah, walk through walls!",
  "Six coins, lava everywhere, walls are still optional!",
  "Lava... lava everywhere, good luck getting anywhere!",
  "Congrats, Maze Master! You've defeated your Triskaidekaphobia. \nYou're a true legend!",
];

export {
  directionMapper,
  instructions,
  assetsToLoad,
  positions,
  sizes,
  colors,
};
