import clone from 'lodash.clonedeep';
import smoothscroll from '../src/smoothscroll';
import test from 'ava';

// mock window object
const mockedWindow = {
  Element: {
    prototype: {
      scroll: f => f,
      scrollBy: f => f,
      scrollIntoView: f => f
    }
  },
  scroll: f => f,
  scrollBy: f => f,
  navigator: {
    userAgent: 'test'
  },
  performance: {
    now: f => f
  },
  requestAnimationFrame: f => f
};

// mock document object
const mockedDocument = {
  documentElement: {
    style: {}
  }
};

// expose clean browser objects as global
test.beforeEach(() => {
  global.window = clone(mockedWindow);
  global.document = clone(mockedDocument);
});

// clean browser objects after each test
test.afterEach.always(() => {
  global.window = null;
  global.document = null;
});

test('polyfill is available as method', t => {
  t.truthy(typeof smoothscroll.polyfill === 'function');
});

test('polyfill overrides native methods when polyfill is not supported', t => {
  const originalWindowScroll = window.scroll;
  const originalWindowScrollBy = window.scrollBy;
  const originalElScroll = window.Element.prototype.scroll;
  const originalElScrollBy = window.Element.prototype.scrollBy;
  const originalElScrollIntoView = window.Element.prototype.scrollIntoView;

  smoothscroll.polyfill();

  // global methods were replaced
  t.not(window.scroll, originalWindowScroll);
  t.not(window.scrollBy, originalWindowScrollBy);
  t.not(window.Element.prototype.scroll, originalElScroll);
  t.not(window.Element.prototype.scrollBy, originalElScrollBy);
  t.not(window.Element.prototype.scrollIntoView, originalElScrollIntoView);
});

test('polyfill bails out when polyfill is supported', t => {
  const originalWindowScroll = window.scroll;
  const originalWindowScrollBy = window.scrollBy;
  const originalElScroll = window.Element.prototype.scroll;
  const originalElScrollBy = window.Element.prototype.scrollBy;
  const originalElScrollIntoView = window.Element.prototype.scrollIntoView;

  // global methods remained untouched
  document.documentElement.style.scrollBehavior = 'auto';

  smoothscroll.polyfill();

  t.is(window.scroll, originalWindowScroll);
  t.is(window.scrollBy, originalWindowScrollBy);
  t.is(window.Element.prototype.scroll, originalElScroll);
  t.is(window.Element.prototype.scrollBy, originalElScrollBy);
  t.is(window.Element.prototype.scrollIntoView, originalElScrollIntoView);
});

test('polyfill overrides native methods when implementation is forced', t => {
  const originalWindowScroll = window.scroll;
  const originalWindowScrollBy = window.scrollBy;
  const originalElScroll = window.Element.prototype.scroll;
  const originalElScrollBy = window.Element.prototype.scrollBy;
  const originalElScrollIntoView = window.Element.prototype.scrollIntoView;

  // simulate smooth scroll spec native support
  document.documentElement.style.scrollBehavior = 'auto';

  // force implementation
  window.__forceSmoothScrollPolyfill__ = true;

  smoothscroll.polyfill();

  // global methods were forcefully replaced
  t.not(window.scroll, originalWindowScroll);
  t.not(window.scrollBy, originalWindowScrollBy);
  t.not(window.Element.prototype.scroll, originalElScroll);
  t.not(window.Element.prototype.scrollBy, originalElScrollBy);
  t.not(window.Element.prototype.scrollIntoView, originalElScrollIntoView);
});
