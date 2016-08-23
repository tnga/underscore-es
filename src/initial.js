// `_initial` : an array's function
// ---------------------------------

import {slice} from './_quickaccess';

// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
export default function (array, n, guard) {
	return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}