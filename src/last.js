// `_last` : an array's function
// ------------------------------

import _rest from './rest';

// Get the last element of an array. Passing **n** will return the last N
// values in the array.
export default function (array, n, guard) {
	if (array == null || array.length < 1) return void 0;
	if (n == null || guard) return array[array.length - 1];
	return _rest(array, Math.max(0, array.length - n));
}