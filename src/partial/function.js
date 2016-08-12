import {restArgs, baseCreate, flatten, executeBound} from './_internal';
import {_isFunction, _has} from './object';
import {_now} from './utility';

// Function (ahem) Functions
// -------------------------

// Create a function bound to a given object (assigning `this`, and arguments,
// optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
// available.
export var _bind = restArgs(function (func, context, args) {
  if (!_isFunction(func)) throw new TypeError('Bind must be called on a function');
  var bound = restArgs(function (callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
});

// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. _ acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
export var _partial = restArgs(function (func, boundArgs) {
  let placeholder = _partial.placeholder;
  var bound = function () {
    let position = 0,
      length = boundArgs.length;
    let args = Array(length);
    for (let i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return executeBound(func, bound, this, this, args);
  };
  return bound;
});
 _partial.placeholder = undefined;

// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
export var _bindAll = restArgs(function (obj, keys) {
  keys = flatten(keys, false, false);
  let index = keys.length;
  if (index < 1) throw new Error('bindAll must be passed function names');
  while (index--) {
    let key = keys[index];
    obj[key] = _bind(obj[key], obj);
  }
});

// Memoize an expensive function by storing its results.
export function _memoize (func, hasher) {
  let memoize = function (key) {
    let cache = memoize.cache;
    let address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!_has(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}

// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
export var _delay = restArgs(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
});

// Defers a function, scheduling it to run after the current call stack has cleared.
export var _defer = _partial(_delay, _partial.placeholder, 1);

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export function _throttle (func, wait, options) {
  let timeout, context, args, result;
  let previous = 0;
  if (!options) options = {};

  let later = function () {
    previous = options.leading === false ? 0 : _now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  let throttled = function () {
    let now = _now();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function _debounce (func, wait, immediate) {
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

// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
export function _wrap (func, wrapper) {
  return _partial(wrapper, func);
}

// Returns a negated version of the passed-in predicate.
export function _negate (predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}

// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
export function _compose () {
  let args = arguments;
  let start = args.length - 1;
  return function () {
    let i = start;
    let result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

// Returns a function that will only be executed on and after the Nth call.
export function _after (times, func) {
  return function () {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}

// Returns a function that will only be executed up to (but not including) the Nth call.
export function _before (times, func) {
  var memo;
  return function () {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) func = null;
    return memo;
  };
}

// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
export var _once = _partial(_before, 2);

// This accumulates the arguments passed into an array, after a given index.
export var _restArgs = restArgs;