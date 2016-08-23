// `_findKey` : an object's function
// ----------------------------------

import _keys from './keys';
import {cb} from './_internal';

// Returns the first key on an object that passes a predicate test.
export default function (obj, predicate, context) {
	predicate = cb(predicate, context);
	let keys = _keys(obj),
		key;
	for (let i = 0, length = keys.length; i < length; i++) {
		key = keys[i];
		if (predicate(obj[key], key, obj)) return key;
	}
}