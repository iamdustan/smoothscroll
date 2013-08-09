!function(e){for(var n=0,t=["webkit","moz"],a=e.requestAnimationFrame,i=e.cancelRequestAnimationFrame,m=t.length;--m>=0&&!a;)a=e[t[m]+"RequestAnimationFrame"],i=e[t[m]+"CancelRequestAnimationFrame"];a&&i||(a=function(e){var t=+Date.now(),a=Math.max(n+16,t);return setTimeout(function(){e(n=a)},a-t)},i=clearTimeout),e.requestAnimationFrame=a,e.cancelRequestAnimationFrame=i}(window);

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
  window.scrollTo = function(x, y, type) {
    if (type !== 'smooth')
      return originalScrollTo(x, y);

    // TODO: make this intelligent based on distance. 300ms per scro
    var SCROLL_TIME = 300;
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

