// `_isMatch` : an object's function
// ----------------------------------

import _keys from './keys';

// Returns whether an object has a given set of `key:value` pairs.
export default function (object, attrs) {
	let keys = _keys(attrs),
		length = keys.length;
	if (object == null) return !length;
	let obj = Object(object);
	for (let i = 0; i < length; i++) {
		let key = keys[i];
		if (attrs[key] !== obj[key] || !(key in obj)) return false;
	}
	return true;
}