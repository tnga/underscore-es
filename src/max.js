// `_max` : a collection's function
// ------------------------------------

import _values from './values';
import _each from './each';
import {cb, isArrayLike} from './_internal';

// Return the maximum element (or element-based computation).
export default function (obj, iteratee, context) {
	let result = -Infinity,
		lastComputed = -Infinity,
		value, computed;
	if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
		obj = isArrayLike(obj) ? obj : _values(obj);
		for (let i = 0, length = obj.length; i < length; i++) {
			value = obj[i];
			if (value != null && value > result) {
				result = value;
			}
		}
	} else {
		iteratee = cb(iteratee, context);
		_each(obj, (v, index, list) => {
			computed = iteratee(v, index, list);
			if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
				result = v;
				lastComputed = computed;
			}
		});
	}
	return result;
}