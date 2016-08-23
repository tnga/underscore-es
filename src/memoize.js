// `_memoize` : (ahem) a function's function
// ------------------------------------------

import _has from './has';

// Memoize an expensive function by storing its results.
export default function (func, hasher) {
  let memoize = function (key) {
    let cache = memoize.cache;
    let address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!_has(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}