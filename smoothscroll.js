(function(w, doc, undefined) {
  'use strict';

  /*
   * alias
   * w: window global object
   * doc: document
   * undefined: undefined
   */

  // return if scrollBehavior is supported
  if ('scrollBehavior' in doc.documentElement.style) {
    return;
  }

  var SCROLL_TIME = 768,
      // legacy scrolling methods
      originalScrollTo = w.scrollTo,
      originalScrollBy = w.scrollBy,
      originalScrollIntoView = w.Element.prototype.scrollIntoView,
      // global frame variable to avoid collision
      frame;

  /*
   * returns actual time
   * @method now
   * @returns {Date}
   */
  function now() {
    // if performance object supported return now, if not fallback to date object
    if (w.performance !== undefined && w.performance.now !== undefined) {
      return w.performance.now();
    }

    return Date.now();
  }

  /*
   * returns result of applying ease math function to a number
   * @method ease
   * @param {Number} k
   * @returns {Number}
   */
  function ease(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  }

  /*
   * returns true if first argument is an options object and contains a smooth behavior
   * @method shouldBailOut
   * @param {Number|Object} x
   * @returns {Boolean}
   */
  function shouldBailOut(x) {
    if (typeof x !== 'object' || x.behavior === undefined || x.behavior === 'auto' || x.behavior === 'instant') {
      // first arg not an object, or behavior is auto or undefined
      return true;
    } else if (x.behavior === 'smooth') {
      // first argument is an object and behavior is smooth
      return false;
    }
    // behavior not supported, throw error as Firefox implementation 37.0.2
    throw new TypeError(x.behavior + ' is not a valid value for enumeration ScrollBehavior');
  }

  /*
   * changes scroll position inside an element
   * @method scrollElement
   * @params {Node} el
   * @params {Number} x
   * @params {Number} y
   */
  function scrollElement(el, x, y) {
    el.scrollTop = y;
    el.scrollLeft = x;
  }

  /*
   * finds scrollable parent of an element
   * @method findScrollableParent
   * @params {Node} el
   */
  function findScrollableParent(el) {
    if (el.clientHeight < el.scrollHeight ||
        el.clientWidth < el.scrollWidth) {
      return el;
    }

    // only continue scaling if parentNode is valid
    if (el.parentNode.parentNode) {
      return findScrollableParent(el.parentNode);
    }
  }

  /*
   * scrolls window with a smooth behavior
   * @method smoothScroll
   * @params {Number} x
   * @params {Number} y
   */
  function smoothScroll(x, y) {
    var sx = w.scrollX || w.pageXOffset,
        sy = w.scrollY || w.pageYOffset,
        startTime = now();

    // cancel frame is there is an scroll event happening
    if (frame) {
      w.cancelAnimationFrame(frame);
    }

    frame = w.requestAnimationFrame(step);

    // scroll looping over a frame
    function step() {
      var time = now(), value, cx, cy,
          elapsed = (time - startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      value = ease(elapsed);
      cx = sx + (x - sx) * value;
      cy = sy + (y - sy) * value;

      originalScrollTo(cx, cy);

      // return if end points have been reached
      if (cx === x && cy === y) {
        sx = sy = startTime = null;
        w.cancelAnimationFrame(frame);
        return;
      }

      frame = w.requestAnimationFrame(step);
    }
  }

  /*
   * scrolls inside an element with a smooth behavior
   * @method smoothScrollElement
   * @params {Node} el
   * @params {Object} endCoords
   */
  function scrollSmoothElement(el, endCoords) {
    if (el === doc.documentElement || el === doc.body) {
      smoothScroll(endCoords.left, endCoords.top);
      return;
    }

    var sx = el.scrollLeft,
        sy = el.scrollTop,
        x = endCoords.left,
        y = endCoords.top,
        startTime = now();

    // cancel frame is there is an scroll event happening
    if (frame) {
      w.cancelAnimationFrame(frame);
    }

    frame = w.requestAnimationFrame(step);

    // scroll looping over a frame
    function step() {
      var time = now(), value, cx, cy,
          elapsed = (time - startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      value = ease(elapsed);
      cx = sx + (x - sx) * value;
      cy = sy + (y - sy) * value;

      scrollElement(el, cx, cy);

      // return if end points have been reached
      if (cx === x && cy === y) {
        sx = sy = startTime = null;
        w.cancelAnimationFrame(frame);
        return;
      }

      frame = w.requestAnimationFrame(step);
    }
  }

  // ORIGINAL METHODS OVERRIDES
  // window.scroll and window.scrollTo
  w.scroll = w.scrollTo = function() {
    if (shouldBailOut(arguments[0])) {
      // if first argument is an object with auto behavior send left and top coordenates
      return originalScrollTo.call(w, arguments[0].left || arguments[0], arguments[0].top || arguments[1]);
    }

    return smoothScroll.call(w, ~~arguments[0].left, ~~arguments[0].top);
  };

  // window.scrollBy
  w.scrollBy = function() {
    if (shouldBailOut(arguments[0])) {
      // if first argument is an object with auto behavior send left and top coordenates
      return originalScrollBy.call(w, arguments[0].left || arguments[0], arguments[0].top || arguments[1]);
    }

    var sx = w.scrollX || w.pageXOffset,
        sy = w.scrollY || w.pageYOffset;

    return smoothScroll(~~arguments[0].left + sx, ~~arguments[0].top + sy);
  };

  // Element.scrollIntoView
  Element.prototype.scrollIntoView = function() {
    var elementRects, paddingLeft, paddingTop, ret, scrollableParent, style;

    if (shouldBailOut(arguments[0])) {
      return originalScrollIntoView.call(this, arguments[0] || true);
    }

    scrollableParent = findScrollableParent(this);

    if (scrollableParent) {
      style = w.getComputedStyle(scrollableParent, null);
      paddingLeft = parseInt(style.getPropertyValue('padding-left'), 10);
      paddingTop = parseInt(style.getPropertyValue('padding-top'), 10);
      elementRects = {
        top: this.offsetTop - paddingTop * 2,
        left: this.offsetLeft - paddingLeft * 2
      };

      ret = scrollSmoothElement(scrollableParent, elementRects);
    }

    return ret;
  };

}(window, document));
