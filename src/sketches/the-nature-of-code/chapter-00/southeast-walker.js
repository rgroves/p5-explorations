/**
 * The Nature of Code - Exercise 0.1
 * Create a random walker that has a greater tendency to move down and to the right.
 */

class Walker {
  constructor(p5, color) {
    this.p5 = p5;
    this.color = color || p5.color(0);
    this.x = p5.width / 2;
    this.y = p5.height / 2;
  }

  show() {
    const p5 = this.p5;
    p5.stroke(this.color);
    p5.point(this.x, this.y);
  }

  step() {
    const weightedX = [-1, 0, 1, 1, 1];
    const weightedY = [-1, 0, 1, 1, 1];
    const p5 = this.p5;
    const xStep = weightedX[p5.floor(p5.random(weightedX.length))];
    const yStep = weightedY[p5.floor(p5.random(weightedY.length))];
    this.x += xStep;
    this.y += yStep;
  }
}

export default (p5) => {
  let walker;

  p5.setup = () => {
    p5.createCanvas(640, 240);
    p5.background(240);
    walker = new Walker(p5, p5.color("red"));
  }

  p5.draw = () => {
    walker.step();
    walker.show();
  }
}
