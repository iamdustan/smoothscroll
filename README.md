smoothscroll.js
=================

Polyfill for
* window.scroll(x, y, behavior);
* window.scrollTo(x, y, behavior);
* window.scrollBy(x, y, behavior);

* element.scrollIntoView(toTop, behavior); (incomplete)

Usage
-----

This depends upon `requestAnimationFrame`. As such you can use either
dist/smoothscroll.js if you have a raf polyfill already included (or are
supporting only raf-enabled browsers), or use dist/smoothscroll.raf.js
to use a version bundled with a polyfill (batteries included version).

The core size is:
* 2429 bytes of original hand-crafted source code.
* 1170 bytes minified
* 275 bytes gzipped (which is somehow only one byte larger than raf.js gzipped

Browser Support
---------------

This has been tested successfully in the following browsers:

* Safari 6+ (desktop, haven't tested iOS)
* FirefoxNightly
* Chrome
* Opera Next


Standards documentation
-----------------------

* http://dev.w3.org/csswg/cssom-view/#scroll-an-element-into-view
* http://lists.w3.org/Archives/Public/www-style/2013Mar/0314.html

