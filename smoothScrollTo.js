(function () {
  'use strict';

  if ('scrollBehavior' in document.documentElement.style) return;

  var originalScrollTo = window.scrollTo;

  function now() {
    return window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now !== undefined ? Date.now() : +new Date;
  }

  // ease-in-out
  function ease(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  }

  window.scrollTo = function(x, y, type) {
    if (type !== 'smooth')
      return originalScrollTo(x, y);

    // TODO: make this intelligent. 300ms per scroll
    var SCROLL_TIME = 300;
    var frame;
    var sx = this.pageXOffset;
    var sy = this.pageYOffset;

    var startTime = now();

    // TODO: look into polyfilling scroll-behavior: smooth css property
    // var ey = element.offsetTop, ex = element.offsetLeft;
    var step = function() {
      var time = now();
      var elapsed = (time - startTime) / SCROLL_TIME;
      elapsed = elapsed > 1 ? 1 : elapsed;

      var value = ease(elapsed);
      var _x = sx + ( x - sx ) * value;
      var _y = sy + ( y - sy ) * value;

      if (_x >= x) _x = x;
      if (_y >= y) _y = y;
      originalScrollTo(_x, _y)

      if (_x === x && _y === y) return;
      frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
  }

}());

