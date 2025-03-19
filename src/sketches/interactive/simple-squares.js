export default ($) => {
  let circleCount = 0;
  let pMouseX = $.mouseX;
  let pMouseY = $.mouseY;

  $.setup = () => {
    const p5Canvas = $.createCanvas(400, 400);
    p5Canvas.parent('app');
    $.background(0);
  }

  $.draw = () => {
    if (circleCount > 1000) {
      $.clear();
      circleCount = 0;
    }

    if (pMouseX !== $.mouseX || pMouseY !== $.mouseY) {
      $.square($.mouseX, $.mouseY, 50);
      circleCount++;
      pMouseX = $.mouseX;
      pMouseY = $.mouseY;
    }
  }
};
