// `_allKeys` : an object's function
// ---------------------------------

import _isObject from './isObject';
import {hasEnumBug, collectNonEnumProps} from './_internal';

// Retrieve all the property names of an object.
export default function (obj) {
	if (!_isObject(obj)) return [];
	var keys = [];
	for (let key in obj) keys.push(key);
	// Ahem, IE < 9.
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
}