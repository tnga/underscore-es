// `_lastIndexOf` : an array's function
// ---------------------------------

import _findLastIndex from './findLastIndex';
import {createIndexFinder} from './_internal';

// Return the position of the last occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
var _lastIndexOf = createIndexFinder(-1, _findLastIndex);

export {_lastIndexOf as default};