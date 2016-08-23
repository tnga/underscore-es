// `_invert` : an object's function
// ---------------------------------

import _keys from './keys';

// Invert the keys and values of an object. The values must be serializable.
export default function (obj) {
	let result = {};
	let keys = _keys(obj);
	for (let i = 0, length = keys.length; i < length; i++) {
		result[obj[keys[i]]] = keys[i];
	}
	return result;
}
