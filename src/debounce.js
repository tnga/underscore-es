// `_debounce` : (ahem) a function's function
// -------------------------------------------

import _delay from './delay';
import {restArgs} from './_internal';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export default function (func, wait, immediate) {
  let timeout, result;

  let later = function (context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  let debounced = restArgs(function (args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = _delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}