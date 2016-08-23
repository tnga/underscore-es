// `_values` : an object's function
// ---------------------------------

import _keys from './keys';

// Retrieve the values of an object's properties.
export default function (obj) {
	let keys = _keys(obj);
	let length = keys.length;
	let values = Array(length);
	for (let i = 0; i < length; i++) {
		values[i] = obj[keys[i]];
	}
	return values;
}