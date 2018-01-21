# Smooth Scroll behavior polyfill

The [Scroll Behavior specification](https://developer.mozilla.org/en/docs/Web/CSS/scroll-behavior) has been introduced as an extension of the `Window` interface to allow for the developer to opt in to native smooth scrolling. To date this has only been implemented in _Firefox_.

See it in action here: https://iamdustan.github.io/smoothscroll


## Installation and use

Download the production ready file [here](https://unpkg.com/smoothscroll-polyfill/dist/smoothscroll.min.js) and include it in your project, or install it as a package.

```sh
# npm
npm install smoothscroll-polyfill --save

# yarn
yarn add smoothscroll-polyfill
```

When including the polyfill in a script tag, it will run immediately after loaded. If you are importing it as a dependency, make sure to call the `polyfill` method.

```js
import smoothscroll from 'smoothscroll-polyfill';

// kick off the polyfill!
smoothscroll.polyfill();
```

In both cases, the script will detect if the spec is natively supported and take action only when necessary.

_The code requires requestAnimationFrame polyfill for browsers which don't support it._


### Force polyfill implementation

If you prefer to always override the native scrolling methods, place this global variable before requiring the module or including the polyfill file.

```js
window.__forceSmoothScrollPolyfill__ = true;
```

_We strongly recommend not to do this unless your project strongly needs it._


## Contribute

Fork the repository and run **npm install**.

After any modification make sure it doesn't break in any of the supported browsers, check linting and build running **npm run build** and then open a pull request.


## Browser Support

Successfully tested in:

- Safari 6+
- _natively supported in Chrome_
- _natively supported in Firefox_
- Internet Explorer 9+
- Microsoft Edge 12+
- Opera Next

If you have tested this and worked as expected in a different browser let us know so we can add it to the list, if not [open an issue](https://github.com/iamdustan/smoothscroll/issues) providing browser, browser version and a good description about it.


## Standards documentation

- http://dev.w3.org/csswg/cssom-view
- http://lists.w3.org/Archives/Public/www-style/2013Mar/0314.html
