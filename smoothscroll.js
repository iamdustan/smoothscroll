(function () {
  'use strict';

  if ('scrollBehavior' in document.documentElement.style) return;

  var originalScrollTo = window.scrollTo;
  var originalScrollIntoView = Element.prototype.scrollIntoView;

  function now() {
    return window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now !== undefined ? Date.now() : new Date().getTime();
  }

  // ease-in-out
  function ease(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  }

  var startY, startX, endX, endY;

  function smoothScroll(x, y) {
    var frame;
    var sx = window.pageXOffset;
    var sy = window.pageYOffset;

    if (typeof startX === 'undefined') {
      startX = sx;
      startY = sy;
      endX = x;
      endY = y;
    }

    var startTime = now();

    // TODO: look into polyfilling scroll-behavior: smooth css property
    // var ey = element.offsetTop, ex = element.offsetLeft;
    var step = function() {
      var time = now();
      var elapsed = (time - startTime) / SCROLL_TIME;
      elapsed = elapsed > 1 ? 1 : elapsed;

      var value = ease(elapsed);
      var cx = sx + ( x - sx ) * value;
      var cy = sy + ( y - sy ) * value;

      originalScrollTo(cx, cy);

      if (cx === endX && cy === endY) {
        startX = startY = endX = endY = undefined;
        return;
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
  }

  // TODO: make this intelligent based on distance. 300ms per scro
  var SCROLL_TIME = 300;

  window.scroll = window.scrollTo = function(x, y, behavior) {
    if (behavior !== 'smooth')
      return originalScroll(x, y);
    return smoothScroll(x, y);
  };

  window.scrollBy = function(x, y, behavior) {
    if (behavior !== 'smooth')
      return originalScrollBy(x, y);

    var sx = window.pageXOffset;
    var sy = window.pageYOffset;

    return smoothScroll(x + sx, y + sy);
  };


  Element.prototype.scrollIntoView = function(toTop, behavior) {
    if (behavior !== 'smooth')
      return originalScrollIntoView(toTop, behavior);

    if (typeof toTop === 'undefined')
      toTop = true;


    if (toTop)
      return window.scrollTo(this.offsetLeft, this.offsetTop, behavior);

    return window.scrollTo(
      this.offsetLeft,
      this.offsetTop - document.documentElement.clientHeight + this.clientHeight,
      behavior
    );
  };

}());

