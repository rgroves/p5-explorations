export default ($) => {
  let circleCount = 0;
  let pMouseX = $.mouseX;
  let pMouseY = $.mouseY;

  $.setup = () => {
    const p5Canvas = $.createCanvas(400, 400);
    p5Canvas.parent('app');
    $.background(0);
    $.fill(255);
    $.textAlign($.CENTER, $.CENTER);
    $.text("Move mouse to draw squares.\nAfter 1000 squares canvas will erase after breif pause.", $.width / 2, $.height / 2);
  }

  let tid = null;

  $.draw = () => {
    if (circleCount > 1000) {
      if (!tid) {
        tid = setTimeout(() => {
          $.background(0);
          circleCount = 0;
          tid = null;
        }, 1500);
      }
      return;
    }

    if (pMouseX !== $.mouseX || pMouseY !== $.mouseY) {
      $.square($.mouseX, $.mouseY, 50);
      circleCount++;
      pMouseX = $.mouseX;
      pMouseY = $.mouseY;
    }
  }
};
