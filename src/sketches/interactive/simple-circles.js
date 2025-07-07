export default ($) => {
  $.setup = () => {
    const p5Canvas = $.createCanvas(400, 400);
    p5Canvas.parent('app');

    p5Canvas.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    $.background(0);
    $.fill(255);
    $.textAlign($.CENTER, $.CENTER);
    $.text("Right-Click to draw circles\nLeft-Click to erase canvas", $.width / 2, $.height / 2);
  }

  $.draw = () => {
    if ($.mouseIsPressed) {
      if ($.mouseButton === $.LEFT) {
        $.circle($.mouseX, $.mouseY, 50);
      } else if ($.mouseButton === $.RIGHT) {
        $.background(0);
      }
    }
  }
};
