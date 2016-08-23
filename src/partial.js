// `_partial` : (ahem) a function's function
// ------------------------------------------

import _ from './_base';
import {restArgs, executeBound} from './_internal';

// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. _ acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
var _partial = restArgs( (func, boundArgs) => {
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
_partial.placeholder = _;

export {_partial as default};