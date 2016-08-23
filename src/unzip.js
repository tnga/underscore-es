// `_unzip` : an array's function
// -------------------------------

import _max from './max';
import _pluck from './pluck';
import {restArgs, getLength} from './_internal';

// Complement of `_.zip`. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
export default function (array) {
	var length = array && _max(array, getLength).length || 0;
	var result = Array(length);

	for (var index = 0; index < length; index++) {
		result[index] = _pluck(array, index);
	}
	return result;
}