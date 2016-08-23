// `_sortedIndex` : an array's function
// -------------------------------------

import {cb, getLength} from './_internal';

// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
export default function (array, obj, iteratee, context) {
	iteratee = cb(iteratee, context, 1);
	let value = iteratee(obj);
	let low = 0,
		high = getLength(array);
	while (low < high) {
		let mid = Math.floor((low + high) / 2);
		if (iteratee(array[mid]) < value) low = mid + 1;
		else high = mid;
	}
	return low;
}