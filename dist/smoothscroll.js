!function(t,e,r){"use strict";function n(){return t.performance!==r&&t.performance.now!==r?t.performance.now():Date.now()}function o(t){return.5*(1-Math.cos(Math.PI*t))}function a(t){if("object"!=typeof t||t.behavior===r||"auto"===t.behavior||"instant"===t.behavior)return!0;if("smooth"===t.behavior)return!1;throw new TypeError(t.behavior+" is not a valid value for enumeration ScrollBehavior")}function l(t,e,r){t.scrollTop=r,t.scrollLeft=e}function i(t){return t.clientHeight<t.scrollHeight||t.clientWidth<t.scrollWidth?t:t.parentNode.parentNode?i(t.parentNode):void 0}function s(e,r){function a(){var u,f,g,v=n(),d=(v-s)/m;return d=d>1?1:d,u=o(d),f=l+(e-l)*u,g=i+(r-i)*u,p(f,g),f===e&&g===r?(l=i=s=null,void t.cancelAnimationFrame(c)):void(c=t.requestAnimationFrame(a))}var l=t.scrollX||t.pageXOffset,i=t.scrollY||t.pageYOffset,s=n();c&&t.cancelAnimationFrame(c),c=t.requestAnimationFrame(a)}function u(e,r){function a(){var r,g,v,d=n(),h=(d-p)/m;return h=h>1?1:h,r=o(h),g=i+(u-i)*r,v=s+(c-s)*r,l(e,g,v),g===u&&v===c?(i=s=p=null,void t.cancelAnimationFrame(f)):void(f=t.requestAnimationFrame(a))}var i=e.scrollLeft,s=e.scrollTop,u=r.left,c=r.top,p=n();f&&t.cancelAnimationFrame(f),f=t.requestAnimationFrame(a)}if(!("scrollBehavior"in e.documentElement.style)){var c,f,m=768,p=t.scrollTo,g=t.scrollBy,v=t.Element.prototype.scrollIntoView;t.scroll=t.scrollTo=function(){return a(arguments[0])?p.call(t,arguments[0].left||arguments[0],arguments[0].top||arguments[1]):s.call(t,~~arguments[0].left,~~arguments[0].top)},t.scrollBy=function(){if(a(arguments[0]))return g.call(t,arguments[0].left||arguments[0],arguments[0].top||arguments[1]);var e=t.scrollX||t.pageXOffset,r=t.scrollY||t.pageYOffset;return s(~~arguments[0].left+e,~~arguments[0].top+r)},Element.prototype.scrollIntoView=function(){if(a(arguments[0]))return v.call(this,arguments[0]||!0);var e=i(this),r=t.getComputedStyle(e,null),n=parseInt(r.getPropertyValue("padding-left"),10),o=parseInt(r.getPropertyValue("padding-top"),10),l={top:this.offsetTop-2*o,left:this.offsetLeft-2*n};return s(l.left,l.top),u(e,l)}}}(window,document);