// `_findIndex` : an array's function
// -----------------------------------

import {createPredicateIndexFinder} from './_internal';

// Returns the first index on an array-like that passes a predicate test.
var _findIndex = createPredicateIndexFinder(1);

export {_findIndex as default};