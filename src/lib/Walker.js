class Walker {
  constructor(x, y, xBounds, yBounds, draw) {
    this.x = x;
    this.y = y;
    this.xBounds = xBounds;
    this.yBounds = yBounds;
    this.steps = 0;
    this.c = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "white"];
    this.ci = 0;
    this.draw = draw;
  }

  getColor() {
    if (this.steps % 10 === 0) {
      this.ci = (this.ci + 1) % this.c.length;
    }
    return this.c[this.ci];
  }

  step() {
    this.steps++;
    let [xMin, xMax] = this.xBounds;
    let [yMin, yMax] = this.yBounds;

    this.x += Math.floor(Math.random() * 3) - 1;

    if (this.x < xMin || this.x > xMax) {
      this.x = xMax / Math.floor((Math.random() * 4)) + 1;
    }

    this.y += Math.floor(Math.random() * 3) - 1;

    if (this.y < yMin || this.y > yMax) {
      this.y = yMax / Math.floor((Math.random() * 4)) + 1;
    }
  }

  show() {
    this.draw(this.x, this.y, this.getColor());
  }
}

export default Walker;
