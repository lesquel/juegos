const spriteTilesImg = new Image();
spriteTilesImg.src = "./m13e.png";

const backgroundSpriteTilesImg = new Image();
backgroundSpriteTilesImg.src = "./m13e-bg.png";

const backgroundSpriteTiles = {
  columns: 2,
  image: backgroundSpriteTilesImg,
  imageheight: 16,
  imagewidth: 32,
  margin: 0,
  name: "m13e-bg",
  spacing: 0,
  tilecount: 2,
  tiledversion: "1.11.0",
  tileheight: 16,
  tilewidth: 16,
  type: "tileset",
  version: "1.10",
};

const spriteTiles = {
  columns: 2,
  image: spriteTilesImg,
  imageheight: 48,
  imagewidth: 32,
  margin: 0,
  name: "m13e",
  spacing: 0,
  tilecount: 6,
  tiledversion: "1.11.0",
  tileheight: 16,
  tilewidth: 16,
  type: "tileset",
  version: "1.10",
};

export { backgroundSpriteTiles, spriteTiles };
