// `_take` : an array's function
// ------------------------------

import _initial from './initial';

// Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `_map`.
export default function (array, n, guard) {
	if (array == null || array.length < 1) return void 0;
	if (n == null || guard) return array[0];
	return _initial(array, array.length - n);
}