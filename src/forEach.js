// `_forEach` : a collection's function
// ------------------------------------

import _keys from './keys';
import {optimizeCb, isArrayLike} from './_internal';

// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
export default function (obj, iteratee, context) {
	iteratee = optimizeCb(iteratee, context);
	let i, length;
	if (isArrayLike(obj)) {
		for (i = 0, length = obj.length; i < length; i++) {
			iteratee(obj[i], i, obj);
		}
	} else {
		var keys = _keys(obj);
		for (i = 0, length = keys.length; i < length; i++) {
			iteratee(obj[keys[i]], keys[i], obj);
		}
	}
	return obj;
}