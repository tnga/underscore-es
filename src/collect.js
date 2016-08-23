// `_collect` : a collection's function
// -------------------------------------

import _keys from './keys';
import {cb, isArrayLike} from './_internal';

// Return the results of applying the iteratee to each element.
export default function (obj, iteratee, context) {
	iteratee = cb(iteratee, context);
	let keys = !isArrayLike(obj) && _keys(obj),
		length = (keys || obj).length,
		results = Array(length);
	for (let index = 0; index < length; index++) {
		let currentKey = keys ? keys[index] : index;
		results[index] = iteratee(obj[currentKey], currentKey, obj);
	}
	return results;
}