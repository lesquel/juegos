
/*

trees
cactus
grass
signs
girders
fences
billboards
buildings
telepone poles
wind turbines
water towers
tunnels
lights
side streets
flowers
plants


distance
- mountains
- buildings
- sun


0  shapes
1  trees
2  plants
3  rocks
4  structures
5  signs
6  misc
7  background
8
9
10
11
12
13
14
15



*/

let generativeCanvas, generativeContext;

const generativeTileSize = 256;
const generativeCanvasSize = vec3(
  generativeTileSize * 8,
  generativeTileSize * 8,
  1
);
const generativeTileSizeVec3 = vec3(generativeTileSize, generativeTileSize, 0);

function initGenerative() {
  generativeCanvas = document.createElement("canvas");
  generativeContext = generativeCanvas.getContext("2d");
  generativeCanvas.width = generativeCanvasSize.x;
  generativeCanvas.height = generativeCanvasSize.y;
  generateTetures();

  glActiveTexture = glCreateTexture(generativeCanvas);
  glContext.bindTexture(gl_TEXTURE_2D, glActiveTexture);
}

function generateTetures() {
  const context = generativeContext;
  random.setSeed(13);

  class Particle {
    constructor(x, y, vx, vy, accel, sizeStart = 0.1, sizeEnd = 0, c = BLACK) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.accel = accel;
      this.sizeStart = sizeStart;
      this.sizeEnd = sizeEnd;
      this.color = c;
      this.style = 0;
      this.colorRandom = 0;
      this.iterations = 50;
    }

    draw() {
      for (let i = this.iterations | 0; i-- > 0; ) {
        if (this.color) color(random.mutateColor(this.color, this.colorRandom));
        const p = i / this.iterations;
        const x1 = this.x + this.vx * p;
        const y1 = this.y + this.vy * p + this.accel * p * p;
        let s;
        if (this.style)
          s = Math.sin(p * PI) * (this.sizeStart - this.sizeEnd) + this.sizeEnd;
        else s = lerp(p, this.sizeStart, this.sizeEnd);
        rect(x1, y1, s, s);
      }
    }
  }

  {
    // basic shapes
    color(hsl(0, 0, 1));
    setupContext(0, 0);
    circle(0.5, 0.5, 0.45);
    setupContext(1, 0);
    //radialGradient(.5,.5,0,.45,hsl(0,0,1),hsl(0,0,1,0));
    //circle(.5,.5,.45);
    for (let i = 40; i--; )
      color(hsl(0, 0, 1, i / 300)), circle(0.5, 0.5, 0.5 - i / 80);
    setupContext(2, 0);
    for (let i = 40, a; i--; ) {
      color(hsl(0, 0, 1, (a = i / 40))),
        rect(0.5, 0.5, 0.5 - a / 3, 0.9 - a / 3);
    }
    setupContext(3, 0);
    drawLicensePlate();
    setupContext(4, 0);
    text("13", 0.5, 0.5, 1, 0.9, 0.03, "impact");
    setupContext(5, 0);
    drawStartSign();
    setupContext(6, 0);
    drawCheckpointSign();
    setupContext(7, 0);
    drawCheckpointSign(1);

    // plants
    setupContext(0, 1);
    drawPalmTree();
    setupContext(1, 1);
    drawGrass();
    setupContext(2, 1);
    drawTree();

    // signs
    setupContext(0, 2);
    drawJS13kSign();
    setupContext(1, 2);
    drawBounceBackSign();
    setupContext(2, 2);
    drawGenericSign("GitHub", 0.3, BLACK, WHITE);
    setupContext(3, 2);
    drawLittleJSSign();
    setupContext(4, 2);
    drawHarrisSign();
    setupContext(5, 2);
    drawGenericSign("★VOTE★", 0.4, BLACK, WHITE);
    setupContext(6, 2);
    drawDwitterSign("dwitter.net", 0.3, BLACK, WHITE, "courier new");
    setupContext(7, 2);
    drawAvalancheSign();

    // more signs
    setupContext(0, 3);
    drawZZFXSign();
  }

  {
    // make hard alpha
    const w = generativeCanvas.width,
      h = generativeCanvas.height;
    const imageData = context.getImageData(0, generativeTileSize, w, h);
    const data = imageData.data;
    for (let i = 3; i < data.length; i += 4) data[i] = data[i] < 128 ? 0 : 255;
    context.putImageData(imageData, 0, generativeTileSize);
  }

  function setupContext(x, y) {
    // set context transform to go from 0-1 to 0-size
    const w = generativeTileSize;
    context.restore();
    context.save();
    context.setTransform(w, 0, 0, w, w * x, w * y);
    context.beginPath();
    context.rect(0, 0, 1, 1);
    context.clip();
  }

  function particle(...a) {
    return new Particle(...a);
  }
  function circle(x, y, r) {
    ellipse(x, y, r, r);
  }
  function rect(x = 0.5, y = 0.5, w = 1, h = 1) {
    context.fillRect(x - w / 2, y - h / 2, w, h);
  }
  function rectOutline(x = 0.5, y = 0.5, w = 1, h = 1, l = 0.05) {
    context.lineWidth = l;
    context.strokeRect(x - w / 2, y - h / 2, w, h);
  }
  function color(c = WHITE) {
    context.fillStyle = c;
  }
  function lineColor(c = WHITE) {
    context.strokeStyle = c;
  }

  function radialGradient(x, y, r1, r2, color1, color2 = WHITE) {
    const g = context.createRadialGradient(x, y, r1, x, y, r2);
    g.addColorStop(0, color1);
    g.addColorStop(1, color2);
    color(g);
  }

  function linearGradient(x1, y1, x2, y2, color1, color2 = WHITE) {
    const g = context.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, color1);
    g.addColorStop(1, color2);
    color(g);
  }

  function ellipse(x = 0.5, y = 0.5, w = 0.5, h = 0.5, a = 0) {
    context.beginPath();
    context.ellipse(x, y, max(0, w), max(0, h), a, 0, 9);
    context.fill();
  }

  function line(x1, y1, x2, y2, w = 0.1) {
    context.lineWidth = w;
    context.beginPath();
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  function polygon(sides = 3, x = 0.5, y = 0.5, r = 0.5, ao = 0) {
    context.beginPath();
    for (let i = sides; i--; ) {
      const a = (i / sides) * PI * 2;
      context.lineTo(x + r * Math.sin(a + ao), y - r * Math.cos(a + ao));
    }
    context.fill();
  }

  function text(
    s,
    x = 0.5,
    y = 0.5,
    size = 1,
    width = 0.95,
    lineWidth = 0,
    font = "arial",
    textAlign = "center",
    weight = 400,
    style = ""
  ) {
    context.lineWidth = lineWidth;
    context.font = style + " " + weight + " " + size + "px " + font;
    context.textBaseline = "middle";
    context.textAlign = textAlign;
    context.lineJoin = "round";
    context.fillText(s, x, y, width);
    lineWidth && context.strokeText(s, x, y, width);
  }

  function drawPalmTree() {
    let p = particle(0.3, 0.29, 0.3, 0.5, 0.5, 0.02, 0.06);
    p.color = hsl(0.1, 0.5, 0.1);
    p.colorRandom = 0.1;
    p.draw();

    for (let j = 12; j--; ) {
      let v = 0.3,
        a = (j / 12) * PI * 2;
      let vx = Math.sin(a) * v,
        vy = Math.cos(a) * v;
      let p = particle(0.3, 0.23, vx, vy - 0.1, 0.2, 0.05, 0.005);
      p.style = 1;
      p.color = hsl(0.3, 0.6, random.float(0.3, 0.5));
      p.colorRandom = 0.1;
      p.draw();
    }
  }

  function drawTree() {
    color(hsl(0.1, 0.5, 0.1));
    rect(0.5, 1, 0.05, 1);
    let z = 500;
    for (let i = z; i--; ) {
      let p = i / z;
      color(hsl(0, 0, random.float(0.6, 0.9)));
      rect(0.5 + random.floatSign(p / 4), p * 0.9, 0.05, 0.05);
    }
  }

  function drawGrass() {
    for (let i = 60; i--; ) {
      let x = 0.5 + random.floatSign(0.3);
      let p = particle(
        x,
        1,
        random.floatSign(0.25),
        random.floatSign(-0.6, -1),
        0.5,
        0.02
      );
      p.color = hsl(0, 0, random.float(0.6, 0.9));
      p.iterations = 100;
      p.draw();
    }
  }

  function drawSignBackground(
    w = 1,
    h = 0.9,
    c = WHITE,
    outlineColor = hsl(0, 0, 0.1),
    outline = 0.05,
    legColor = c,
    legSeparation = 0.2
  ) {
    color(legColor);
    rect((0.5 - legSeparation) * w, 0.5, 0.1, 1);
    rect((0.5 + legSeparation) * w, 0.5, 0.1, 1);
    color(c);
    rect(w / 2, h / 2, w, h);
    color(outlineColor);
    rect(w / 2, h / 2, w - outline, h - outline);
  }

  function drawJS13kSign() {
    drawSignBackground();
    color();
    text("JS", 0.25, 0.27, 0.5, 0.35, 0, "courier new", undefined, 600);
    text("GAMES", 0.5, 0.66, 0.5, 0.9, 0, "courier new", undefined, 600);
    color(hsl(1, 0.8, 0.5));
    text("13K", 0.67, 0.27, 0.5, 0.5, 0, "courier new", undefined, 600);
  }

  function drawBounceBackSign() {
    drawSignBackground();
    for (let i = 300; i--; ) {
      let p = 1 - i / 300;
      let b = Math.abs(3 - 4 * p);
      let l = i ? 0 : 0.02;
      color(hsl(p * 2, 1, 0.5));
      lineColor();
      text(
        "BOUNCE",
        0.5,
        0.5 - b * 0.15,
        0.02 + p * 0.3,
        0.85,
        l,
        undefined,
        undefined,
        800
      );
      text(
        "BACK",
        0.5,
        0.5 + b * 0.12,
        0.02 + p * 0.3,
        0.85,
        l,
        undefined,
        undefined,
        800
      );
    }
  }

  function drawDwitterSign(t, size = 0.5, c = WHITE, color2 = BLACK, font) {
    let signSize = size + 0.33;
    drawSignBackground(1, signSize, c, color2);
    color(c);
    text(t, 0.5, 0.2, size, 0.9, 0, font, undefined, 600);
    const w = 0.03;
    for (let i = 9; i--; ) rect(0.25 + i * w * 2, 0.44, w, w * 4);
  }
  function drawAvalancheSign() {
    drawSignBackground(1, 0.9, hsl(0, 0, 0.2), WHITE);
    let c = hsl(0, 0.8, 0.6);
    color(c);
    lineColor(c);
    let y = 0.37;
    circle(0.5, y, 0.32);
    text("AVALANCHE", 0.5, 0.8, 0.15, 0.9, 0, undefined, undefined, 600);
    color(WHITE);
    polygon(3, 0.5, y, 0.25);
    let r = 0.3;
    let ox = r * Math.cos(PI / 3);
    let oy = r * Math.sin(PI / 3);
    let x = 0.46;
    y += 0.15;
    line(x, y, x + ox, y - oy, 0.07);
  }

  function drawNewgroundsSign() {
    let size = 0.2,
      c = WHITE,
      color2 = hsl(0.57, 0.1, 0.14);
    let signSize = size + 0.1;
    drawSignBackground(1, signSize, c, color2, 0.05, BLACK, 0);
    color(c);
    const y = (signSize + 0.05) / 2;
    const o = hsl(0.08, 1, 0.61);
    color(o);
    lineColor(o);
    text("NEW", 0.2, y, size, 0.25, 0.02, "Verdana");
    color();
    lineColor();
    text("GROUNDS", 0.6, y, size, 0.55, 0.02);
  }

  function drawGenericSign(t, size = 0.5, c = WHITE, color2 = BLACK, font) {
    let signSize = size + 0.1;
    drawSignBackground(1, signSize, c, color2);
    color(c);
    text(t, 0.5, (signSize + 0.05) / 2, size, 0.9, 0, font, undefined, 600);
  }

  function drawZZFXSign(t = "ZZFX") {
    drawSignBackground(1, 0.6, BLACK, hsl(0, 0, 0.2));
    color(hsl(0.6, 1, 0.5));
    let x = 0.47,
      y = 0.38,
      o = 0.03;
    text(t, x, y, 0.55, 0.8, 0, undefined, undefined, 900);
    color(YELLOW);
    text(t, x + o, y - o, 0.55, 0.8, 0, undefined, undefined, 900);
    color(hsl(0.96, 1, 0.5));
    lineColor(WHITE);
    text(t, x + 2 * o, y - 2 * o, 0.55, 0.8, 0.01, undefined, undefined, 900);
  }

  function drawHarrisSign() {
    drawSignBackground(1, 0.6, WHITE, hsl(0.6, 0.9, 0.3), 0.05, BLACK, 0.5);
    color(WHITE);
    text("HARRIS", 0.5, 0.24, 0.31, 0.85, 0, undefined, undefined, 800);
    text("WALZ", 0.5, 0.46, 0.2, 1, 0, undefined, undefined, 800);
  }

  function drawLittleJSSign() {
    //hsl(.55, .88, .81)
    drawSignBackground(1, 0.7, BLACK, WHITE, 0.05, WHITE, 0);
    color();
    ljsText("LittleJS", 0.05, 0.25);
    ljsText("Engine", 0.11, 0.5, 2);

    function ljsText(t, x, y, o = 0) {
      for (let i = 0; i < t.length; i++) {
        let weight = 900,
          fontSize = 0.21,
          font = "arial";
        context.font = weight + " " + fontSize + "px " + font;
        let w = context.measureText(t[i]).width;
        color(hsl([1, 0.3, 0.57, 0.14][(i + o) % 4], 0.9, 0.5));
        text(t[i], x + w / 2, y, fontSize, 1, 0.03, font, undefined, weight);
        text(t[i], x + w / 2, y, fontSize, 1, 0, font, undefined, weight);
        x += w;
      }
    }
  }

  function drawStartSign() {
    drawSignBackground(1, 0.25, WHITE, WHITE, 0.05, GRAY, 0.5);
    color(RED);
    lineColor(BLACK);
    text("START", 0.5, 0.16, 0.25, 1, 0.01, undefined, undefined, 600);
  }

  function drawCheckpointSign(side = 0) {
    color(hsl(0, 0, 0.2));
    rect(side, 0.5, 0.2, 1);
    color(WHITE);
    rect(0.5, 0, 1, 0.5);
    color(hsl(0.3, 0.7, 0.5));
    text("CHECK", 0.5, 0.16, 0.27, 0.95, 0.01, undefined, undefined, 600);
  }

  function drawLicensePlate(t = "JS-13K") {
    color(hsl(0, 0, 0.8));
    rect();
    color(hsl(232 / 360, 0.9, 0.25));
    lineColor(BLACK);
    text(t, 0.5, 0.6, 1, 0.9, 0, "monospace", undefined, 600);
    //color(hsl(33/360, .68, .5))
    //rect(.5,.14,.8,.02);
    //rect(.5,.2,.8,.05);
    //rect(.5,.93,.4,.03);
    //ellipse(.5,.15,.05,.1);
    //color(hsl(349/360, .83, .28))
    //text('CALIFORNIA',.5,.12,.08);
  }
}
