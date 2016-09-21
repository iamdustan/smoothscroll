/*
 * smoothscroll polyfill - v0.4.0
 * https://iamdustan.github.io/smoothscroll
 * 2016 (c) Dustan Kasten, Jeremias Menichelli - MIT License
 */

(function(w, d, undefined) {
  'use strict';

  /*
   * aliases
   * w: window global object
   * d: document
   * undefined: undefined
   */

  // polyfill
  function polyfill(overrideBrowserImplementation) {
    // return when scrollBehavior interface is supported
    if ('scrollBehavior' in d.documentElement.style) {
      if (!overrideBrowserImplementation) {
        return;
      }
    }

    /*
     * globals
     */
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    /*
     * object gathering original scroll methods
     */
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    /*
     * define timing method
     */
    var now = w.performance && w.performance.now
      ? w.performance.now.bind(w.performance) : Date.now;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * Normalizes valid scrollIntoView arguments into an arguments object
     * @method normalizeArgs
     * @param {Boolean|Object=} x
     * @returns {Object}
     */
    function normalizeArgs(x) {
      if (typeof x === 'undefined') {
        return {
          block: 'start',
          behavior: 'auto'
        };
      }

      if (typeof x === 'boolean') {
        return {
          block: (x ? 'start' : 'end'),
          behavior: 'auto'
        };
      }

      if (typeof x === 'object') {
        if (
          (x.behavior !== undefined) &&
          (x.behavior !== 'auto') &&
          (x.behavior !== 'instant') &&
          (x.behavior !== 'smooth')
        ) {
          throw new TypeError('behavior not valid');
        }

        if (
          (x.block !== undefined) &&
          (x.block !== 'start') &&
          (x.block !== 'end')
        ) {
          throw new TypeError('block not valid');
        }

        return {
          block: x.block === 'end' ? 'end' : 'start',
          behavior: x.behavior === 'smooth' ? 'smooth' : 'auto'
        }
      }

      throw new TypeError('scrollIntoView accepts undefined, boolean or object as its first argument');
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method scrollIsInstant
     * @param {Number|Object} x
     * @returns {Boolean}
     */
    function scrollIsInstant(x) {
      if (typeof x !== 'object'
            || x.behavior === undefined
            || x.behavior === 'auto'
            || x.behavior === 'instant') {
        // first arg not an object, or behavior is auto, instant or undefined
        return true;
      }

      if (typeof x === 'object'
            && x.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError('behavior not valid');
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      do {
        el = el.parentNode;
      } while (el !== d.body
              && !(el.clientHeight < el.scrollHeight
              || el.clientWidth < el.scrollWidth));

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     */
    function step(context) {
      // call method again on next available frame
      context.frame = w.requestAnimationFrame(step.bind(w, context));

      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // return when end points have been reached
      if (currentX === context.x && currentY === context.y) {
        w.cancelAnimationFrame(context.frame);
        return;
      }
    }

    /**
     * scrolls window with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();
      var frame;

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // cancel frame when a scroll event's happening
      if (frame) {
        w.cancelAnimationFrame(frame);
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y,
        frame: frame
      });
    }

    function scrollWithinParentElem(el, opts) {
        var scrollableParent = findScrollableParent(el);
        if (scrollableParent === d.body) {
            return;
        }

        var clientRects = el.getBoundingClientRect();
        var parentRects = scrollableParent.getBoundingClientRect();
        var clientAdj = clientRects.top;
        if (opts.block === 'end') {
            var scrollbarHeight = scrollableParent.offsetHeight - scrollableParent.clientHeight
            clientAdj = clientRects.bottom - parentRects.height + scrollbarHeight;
        }

        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientAdj - parentRects.top
        );
    }

    /*
     * ORIGINAL METHODS OVERRIDES
     */

    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid smooth behavior if not required
      if (scrollIsInstant(arguments[0])) {
        original.scroll.call(
          w,
          arguments[0].left || arguments[0],
          arguments[0].top || arguments[1]
        );
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left,
        ~~arguments[0].top
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid smooth behavior if not required
      if (scrollIsInstant(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left || arguments[0],
          arguments[0].top || arguments[1]
        );
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      var opts = normalizeArgs(arguments[0]);

      // avoid smooth behavior if not required
      if (scrollIsInstant(arguments[0]) && opts.block == "top") {
        original.scrollIntoView.call(this, arguments[0] || true);
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var clientRects = this.getBoundingClientRect();

      scrollWithinParentElem(this, opts);
      w.scrollBy({
          left: clientRects.left,
          top: opts.block !== 'end' ? clientRects.top : clientRects.bottom - w.innerHeight,
          behavior: opts.behavior
      });
    };
  }

  if (typeof exports === 'object') {
    // commonjs
    module.exports = { polyfill: polyfill };
  } else {
    // global
    polyfill(window.__smoothscrollForcePolyfill);
  }
})(window, document);
