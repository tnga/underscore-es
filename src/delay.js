// `_delay` : (ahem) a function's function
// ----------------------------------------

import {restArgs} from './_internal';

// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
var _delay = restArgs( (func, wait, args) => {
  return setTimeout( () => {
    return func.apply(null, args);
  }, wait);
});

export {_delay as default};