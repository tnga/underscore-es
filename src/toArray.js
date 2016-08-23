// `_toArray` : a collection's function
// -------------------------------------

import _isArray from './isArray';
import _isString from './isString';
import _map from './map';
import _identity from './identity';
import _values from './values';
import {slice} from './_quickaccess';
import {reStrSymbol, isArrayLike} from './_internal';

// Safely create a real, live array from anything iterable.
export default function (obj) {
	if (!obj) return [];
	if (_isArray(obj)) return slice.call(obj);
	if (_isString(obj)) {
		// Keep surrogate pair characters together
		return obj.match(reStrSymbol);
	}
	if (isArrayLike(obj)) return _map(obj, _identity);
	return _values(obj);
}