import Walker from "../../../lib/Walker";

let walker;

export default ($) => {
  $.setup = () => {
    const p5Canvas = $.createCanvas(400, 400);
    p5Canvas.parent('app');

    $.background(0);

    walker = new Walker(
      200,
      200,
      [0, $.width],
      [0, $.height],
      (x, y, color) => {
        $.stroke(color);
        $.point(x, y);
      }
    );
  }

  $.draw = () => {
    walker.step();
    walker.show();
  }
};
