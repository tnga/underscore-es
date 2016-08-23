// `_size` : a collection's function
// ----------------------------------

import _keys from './keys';
import {isArrayLike} from './_internal';

// Return the number of elements in an object.
export default function (obj) {
	if (obj == null) return 0;
	return isArrayLike(obj) ? obj.length : _keys(obj).length;
}