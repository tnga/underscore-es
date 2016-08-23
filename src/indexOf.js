// `_indexOf` : an array's function
// ---------------------------------

import _findIndex from './findIndex';
import _sortedIndex from './sortedIndex';
import {createIndexFinder} from './_internal';

// Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
export var _indexOf = createIndexFinder(1, _findIndex, _sortedIndex);

export {_indexOf as default};