// `_include` : a collection's function
// -------------------------------------

import _indexOf from './indexOf';
import _values from './values';
import {isArrayLike} from './_internal';

// Determine if the array or object contains a given item (using `===`).
export default function (obj, item, fromIndex, guard) {
	if (!isArrayLike(obj)) obj = _values(obj);
	if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	return _indexOf(obj, item, fromIndex) >= 0;
}