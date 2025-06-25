import {
  TileEngine,
  Text,
  Sprite,
  keyPressed,
  collides,
  Button,
  onInput,
} from "kontra";

import {
  colors,
  sizes,
  positions,
  instructions,
  directionMapper,
} from "./constants";
import { map } from "./map";
import { calculateScore, getBestScore, setBestScore } from "./utils";

class Scene {
  constructor() {
    this.level = 1;
    this.score = 0;
    this.bestScore = getBestScore() || 0;
    this.deaths = 0;
    this.timer = 13.0;
    this.gameSpeed = 3;
    this.isGameOver = false;

    this.tileEngine = TileEngine(map);

    this.coins = [];
    this.walls = [];
    this.lavas = [];
    this.portals = [];
    this.instructions = [];

    this.hero = Sprite({
      x: positions.hero.x,
      y: positions.hero.y,
      width: sizes.heroSize,
      height: sizes.heroSize,
      color: colors.hero,
    });

    this.finish = Sprite({
      ...positions.finish,
      width: sizes.tileSize,
      height: sizes.tileSize,
      color: colors.finish,
    });

    this.timerText = Text({
      text: this.timer.toString(),
      font: "bold 40px fangsong",
      color: "black",
      x: 25 * 16,
      y: 2 * 16,
    });

    this.scoreText = Text({
      text: `Score: ${this.score}  |  Best score: ${this.bestScore}`,
      font: "bold 20px fangsong",
      color: "black",
      x: 25 * 16,
      y: 6 * 16,
    });

    this.button = Button({
      x: 200,
      y: 200,
      color: "rgba(255,255,255, 0.5)",
      width: 336,
      height: 336,
      anchor: { x: 0.5, y: 0.5 },
      text: {
        anchor: { x: 0.5, y: 0.5 },
        textAlign: "center",
        text: "Press space to restart",
        color: "black",
        font: "20px fangsong",
      },
    });

    this.addEventListeners();
    this.initLevel();
  }

  addEventListeners = () => {
    onInput(["space"], () => this.restartGame());
  };

  initInstructions = () => {
    this.instructions = instructions
      .map((text, index) =>
        this.level > index
          ? Text({
              text: `${index + 1}. ${text}`,
              font: "18px fangsong",
              color: "black",
              lineHeight: 1.3,
              x: 25 * 16,
              y: 8 * 16 + index * 25,
            })
          : undefined
      )
      .filter(Boolean);
  };

  initCoins = () => {
    this.coins = positions.coins[this.level - 1].map((position) => ({
      shouldDisplay: true,
      sprite: Sprite({
        ...position,
        width: sizes.coinSize,
        height: sizes.coinSize,
        color: colors.coin,
      }),
    }));
  };

  initWalls = () => {
    this.walls = positions.walls[this.level - 1].map((position) =>
      Sprite({
        ...position,
        width: sizes.tileSize,
        height: sizes.tileSize,
        color: colors.wall,
      })
    );
  };

  initLavas = () => {
    this.lavas = positions.lavas[this.level - 1].map((position) =>
      Sprite({
        ...position,
        width: sizes.tileSize,
        height: sizes.tileSize,
        color: colors.lava,
      })
    );
  };

  initPortals = () => {
    this.portals = positions.portals[this.level - 1].map((position) =>
      Sprite({
        ...position,
        width: sizes.tileSize,
        height: sizes.tileSize,
        color: colors.portal,
      })
    );
  };

  initLevel = () => {
    this.timer = 13.0;
    this.initInstructions();
    this.initCoins();
    this.initWalls();
    this.initLavas();
    this.initPortals();
    this.hero.x = positions.hero.x;
    this.hero.y = positions.hero.y;
  };

  initNextLevel = () => {
    this.level++;
    this.score += calculateScore(this.timer, this.deaths);
    this.scoreText.text = `Score: ${this.score}  |  Best score: ${this.bestScore}`;
    this.deaths = 0;
    this.initLevel();
  };

  coinsUpdate = () => {
    this.coins.forEach((coin) => {
      if (collides(coin.sprite, this.hero)) {
        coin.shouldDisplay = false;
      }
    });
  };

  restartLevel = () => {
    this.deaths++;
    this.initLevel();
  };

  restartGame = () => {
    this.level = 1;
    this.score = 0;
    this.deaths = 0;
    this.isGameOver = false;
    this.scoreText.text = `Score: ${this.score}  |  Best score: ${this.bestScore}`;
    this.initLevel();
  };

  gameOver = () => {
    this.isGameOver = true;
    this.timer = 13.0;
    this.timerText.text = this.timer.toFixed(2);
    this.bestScore = Math.max(this.score, this.bestScore);
    setBestScore(this.bestScore);
  };

  heroUpdate = () => {
    const collisionBox = {
      x: this.hero.x,
      y: this.hero.y,
      width: this.hero.width,
      height: this.hero.height,
    };

    directionMapper.forEach(([key, { direction, axis }]) => {
      if (keyPressed(key)) {
        collisionBox[axis] += direction * this.gameSpeed;
        const collidesWithMazeWall = this.tileEngine.layerCollidesWith(
          "walls",
          collisionBox
        );
        const collidesWithFinish = collides(collisionBox, this.finish);
        const areAllCoinsCollected = this.coins.every(
          (coin) => !coin.shouldDisplay
        );
        const collidesWithWall = this.walls.some((wall) =>
          collides(collisionBox, wall)
        );
        const collidesWithLava = this.lavas.some((lava) =>
          collides(collisionBox, lava)
        );

        if (collidesWithFinish && areAllCoinsCollected && this.level < 9) {
          this.initNextLevel();
        } else if (collidesWithLava) {
          this.restartLevel();
        } else {
          if (
            !collidesWithMazeWall &&
            !collidesWithFinish &&
            !collidesWithWall
          ) {
            this.hero[axis] += direction * this.gameSpeed;
          }
        }
      }
    });
  };

  timerUpdate = (dt) => {
    if (this.level < 9) {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.restartLevel();
      } else {
        this.timerText.text = this.timer.toFixed(2);
      }
    } else {
      this.gameOver();
    }
  };

  update = (dt) => {
    this.heroUpdate();
    this.coinsUpdate();
    this.timerUpdate(dt);
  };

  render = () => {
    this.tileEngine.render();
    this.hero.render();
    this.coins.forEach((coin) => coin.shouldDisplay && coin.sprite.render());
    this.walls.forEach((wall) => wall.render());
    this.lavas.forEach((lava) => lava.render());
    this.portals.forEach((portal) => portal.render());
    this.finish.render();
    this.instructions.forEach((instruction) => instruction.render());
    this.timerText.render();
    this.scoreText.render();
    this.isGameOver && this.button.render();
  };
}

export default Scene;
