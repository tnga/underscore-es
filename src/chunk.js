// `_chunk` : an array's function
// -------------------------------

import {slice} from './_quickaccess';

// Split an **array** into several arrays containing **count** or less elements
// of initial array.
export default function (array, count) {
	if (count == null || count < 1) return [];
	let result = [];
	let i = 0,
		length = array.length;
	while (i < length) {
		result.push(slice.call(array, i, i += count));
	}
	return result;
}