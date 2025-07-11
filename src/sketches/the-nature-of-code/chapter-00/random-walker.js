class Walker {
  constructor(x, y, draw) {
    this.x = x;
    this.y = y;
    this.draw = draw;
  }

  show() {
    this.draw(this.x, this.y);
  }

  step() {
    const choice = Math.floor(Math.random() * 4);

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
}

export default (p5) => {
  let walker;

  p5.setup = () => {
    p5.createCanvas(640, 240);
    walker = new Walker(p5.width / 2, p5.height / 2, (x, y) => {
      p5.stroke(0);
      p5.point(x, y);
    });

    p5.background(240);
  }

  p5.draw = () => {
    walker.step();
    walker.show();
  }
}