// `_any` : a collection's function
// ---------------------------------

import _keys from './keys';
import {cb, isArrayLike} from './_internal';

// Determine if at least one element in the object matches a truth test.
// Aliased as `any`.
export default function (obj, predicate, context) {
	predicate = cb(predicate, context);
	let keys = !isArrayLike(obj) && _keys(obj),
		length = (keys || obj).length;
	for (let index = 0; index < length; index++) {
		let currentKey = keys ? keys[index] : index;
		if (predicate(obj[currentKey], currentKey, obj)) return true;
	}
	return false;
}