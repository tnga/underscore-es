// `_all` : a collection's function
// ---------------------------------

import _keys from './keys';
import {cb, isArrayLike} from './_internal';

// Determine whether all of the elements match a truth test.
export default function (obj, predicate, context) {
	predicate = cb(predicate, context);
	let keys = !isArrayLike(obj) && _keys(obj),
		length = (keys || obj).length;
	for (let index = 0; index < length; index++) {
		var currentKey = keys ? keys[index] : index;
		if (!predicate(obj[currentKey], currentKey, obj)) return false;
	}
	return true;
}