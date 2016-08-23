// `_isEmpty` : an object's function
// ----------------------------------

import _isArray from './isArray';
import _isString from './isString';
import _isArguments from './isArguments';
import _keys from './keys';
import {isArrayLike} from './_internal';

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
export default function (obj) {
	if (obj == null) return true;
	if (isArrayLike(obj) && (_isArray(obj) || _isString(obj) || _isArguments(obj))) return obj.length === 0;
	return _keys(obj).length === 0;
}