class Walker {
  constructor(p5, color, stepWays = 4) {
    this.p5 = p5;
    this.color = color || p5.color(0);
    this.x = p5.width / 2;
    this.y = p5.height / 2;
    if (stepWays === 4) {
      this.step = this.fourWayStep;
    } else {
      this.step = this.eightWayStep;
    }
  }

  show() {
    const p5 = this.p5;
    p5.stroke(this.color);
    p5.point(this.x, this.y);
  }

  fourWayStep() {
    const p5 = this.p5;
    const choice = p5.floor(p5.random(4));

    if (choice === 0) {
      this.x++;
    } else if (choice === 1) {
      this.x--;
    } else if (choice === 2) {
      this.y++;
    } else {
      this.y--;
    }
  }

  eightWayStep() {
    const p5 = this.p5;
    const xStep = p5.floor(p5.random(3)) - 1;  // -1, 0, or 1
    const yStep = p5.floor(p5.random(3)) - 1;
    this.x += xStep;
    this.y += yStep;
  }
}

export default (p5) => {
  let walker4;
  let walker8;

  p5.setup = () => {
    p5.createCanvas(640, 240);
    p5.background(240);
    walker4 = new Walker(p5, p5.color(255, 0, 0), 4);
    walker8 = new Walker(p5, p5.color(0, 0, 255), 8);
  }

  p5.draw = () => {
    walker4.step();
    walker8.step();
    walker4.show();
    walker8.show()
  }
}
