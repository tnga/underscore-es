// `_drop` : an array's function
// ------------------------------

import {slice} from './_quickaccess';

// Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
// Especially useful on the arguments object. Passing an **n** will return
// the rest N values in the array.
export default function (array, n, guard) {
	return slice.call(array, n == null || guard ? 1 : n);
}