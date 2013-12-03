smoothscroll.js
=================

Polyfill for
* window.scroll(x, y, ScrollOptions);
* window.scrollTo(x, y, ScrollOptions);
* window.scrollBy(x, y, ScrollOptions);

* element.scrollIntoView(toTop, ScrollOptions); (incomplete)

Usage
-----

`bower install --save smoothscroll`

This depends upon `requestAnimationFrame`. As such you can use either
dist/smoothscroll.js if you have a raf polyfill already included (or are
supporting only raf-enabled browsers), or use dist/smoothscroll.raf.js
to use a version bundled with a polyfill (batteries included version).

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

In The Wild
-----------

* http://jeremenichelli.github.io/site/
