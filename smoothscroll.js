(function () {
  'use strict';

  if ('scrollBehavior' in document.documentElement.style) return;

  // TODO: make this intelligent according to distance.
  var SCROLL_TIME = 300;

  var originalScrollTo = window.scrollTo;
  var originalScrollBy = window.scrollBy;
  var originalScrollIntoView = Element.prototype.scrollIntoView;

  // store generally accessible frame id in case a new scroll animation is triggered before the previous
  // completes, we can cancel the previous scroll.
  var frame;

  var startY, startX, endX, endY;

  function now() {
    return window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now !== undefined ? Date.now() : new Date().getTime();
  }

  // ease-in-out
  function ease(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  }

  function shouldBailOut(x) {
    return typeof x === 'undefined' || x.behavior !== 'smooth';
  }

  function smoothScroll(x, y) {
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

    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(step);
  }

  window.scroll = window.scrollTo = function(x, y, scrollOptions) {
    if (shouldBailOut(scrollOptions))
      return originalScrollTo(x, y);
    return smoothScroll(x, y);
  };

  window.scrollBy = function(x, y, scrollOptions) {
    if (shouldBailOut(scrollOptions))
      return originalScrollBy(x, y);

    var sx = window.pageXOffset;
    var sy = window.pageYOffset;

    return smoothScroll(x + sx, y + sy);
  };

  var elementRects, scrollableParent;
  function scrollElement(el, x, y) {
    el.scrollTop = y;
    el.scrollLeft = x;
  }

  function scroll(el, endCoords) {
    var sx = el.scrollLeft;
    var sy = el.scrollTop;

    var x = endCoords.left;
    var y = endCoords.top;

    if (typeof startX === 'undefined') {
      startX = sx;
      startY = sy;
      endX = endCoords.left;
      endY = endCoords.top;
    }

    var startTime = now();

    var step = function() {
      var time = now();
      var elapsed = (time - startTime) / SCROLL_TIME;
      elapsed = elapsed > 1 ? 1 : elapsed;

      var value = ease(elapsed);
      var cx = sx + ( x - sx ) * value;
      var cy = sy + ( y - sy ) * value;

      scrollElement(el, cx, cy);

      if (cx === endX && cy === endY) {
        startX = startY = endX = endY = undefined;
        return;
      }

      frame = requestAnimationFrame(step);
    };

    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(step);
  }

  function findScrollableParent(el) {
    if (el.clientHeight < el.scrollHeight ||
        el.clientWidth < el.scrollWidth)
      return el;
    return findScrollableParent(el.parentNode);
  }

  var origElementScrollIntoView = Element.prototype.scrollIntoView;

  Element.prototype.scrollIntoView = function(toTop, scrollOptions) {
    if (shouldBailOut(scrollOptions)) return origElementScrollIntoView.call(this, toTop);

    scrollableParent = findScrollableParent(this);
    var style = window.getComputedStyle(scrollableParent, null);
    var paddingLeft = parseInt(style.getPropertyValue('padding-left'), 10);
    var paddingTop = parseInt(style.getPropertyValue('padding-top'), 10);

    elementRects = {
      top: this.offsetTop - (paddingTop * 2),
      left: this.offsetLeft - (paddingLeft * 2)
    };

    return scroll(scrollableParent, elementRects);
  };

}());

