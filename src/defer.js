// `_defer` : (ahem) a function's function
// ----------------------------------------

import _partial from './partial';
import _delay from './delay';

// Defers a function, scheduling it to run after the current call stack has cleared.
var _defer = _partial(_delay, _partial.placeholder, 1);

export {_defer as default};