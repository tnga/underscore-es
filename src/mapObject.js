// `_mapObject` : an object's function
// ------------------------------------

import _keys from './keys';
import {cb} from './_internal';

// Returns the results of applying the iteratee to each element of the object.
// In contrast to `_.map` it returns an object.
export default function (obj, iteratee, context) {
	iteratee = cb(iteratee, context);
	let keys = _keys(obj),
		length = keys.length,
		results = {};
	for (let index = 0; index < length; index++) {
		let currentKey = keys[index];
		results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	}
	return results;
}