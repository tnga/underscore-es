// `_bindAll` : (ahem) a function's function
// -------------------------------------------

import _bind from './bind';
import {restArgs, flatten} from './_internal';

// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
var _bindAll = restArgs( (obj, keys) => {
  keys = flatten(keys, false, false);
  let index = keys.length;
  if (index < 1) throw new Error('bindAll must be passed function names');
  while (index--) {
    let key = keys[index];
    obj[key] = _bind(obj[key], obj);
  }
});

export {_bindAll as default};