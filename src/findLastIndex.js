// `_findLastIndex` : an array's function
// ---------------------------------------

import {createPredicateIndexFinder} from './_internal';

// Returns the last index on an array-like that passes a predicate test.
var _findLastIndex = createPredicateIndexFinder(-1);

export {_findLastIndex as default};