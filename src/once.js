// `_once` : (ahem) a function's function
// ---------------------------------------

import _partial from './partial';
import _before from './before';

// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
var _once = _partial(_before, 2);

export {_once as default};