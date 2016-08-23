// `_pairs` : an object's function
// --------------------------------

import _keys from './keys';

// Convert an object into a list of `[key, value]` pairs.
export default function (obj) {
	let keys = _keys(obj);
	let length = keys.length;
	let pairs = Array(length);
	for (let i = 0; i < length; i++) {
		pairs[i] = [keys[i], obj[keys[i]]];
	}
	return pairs;
}