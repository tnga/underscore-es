// `_bind` : (ahem) a function's function
// ---------------------------------------

import _isFunction from './isFunction';
import {restArgs, executeBound} from './_internal';

// Create a function bound to a given object (assigning `this`, and arguments,
// optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
// available.
var _bind = restArgs( (func, context, args) => {
  if (!_isFunction(func)) throw new TypeError('Bind must be called on a function');
  var bound = restArgs(function (callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
});

export {_bind as default};