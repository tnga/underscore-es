// `_unique` : an array's function
// --------------------------------

import _isBoolean from './isBoolean';
import _contains from './contains';
import {cb, getLength} from './_internal';

// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
export default function (array, isSorted, iteratee, context) {
	if (!_isBoolean(isSorted)) {
		context = iteratee;
		iteratee = isSorted;
		isSorted = false;
	}
	if (iteratee != null) iteratee = cb(iteratee, context);
	let result = [];
	let seen = [];
	for (let i = 0, length = getLength(array); i < length; i++) {
		let value = array[i],
			computed = iteratee ? iteratee(value, i, array) : value;
		if (isSorted) {
			if (!i || seen !== computed) result.push(value);
			seen = computed;
		} else if (iteratee) {
			if (!_contains(seen, computed)) {
				seen.push(computed);
				result.push(value);
			}
		} else if (!_contains(result, value)) {
			result.push(value);
		}
	}
	return result;
}