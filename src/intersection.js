// `_intersection` : an array's function
// --------------------------------------

import _contains from './contains';
import {getLength} from './_internal';

// Produce an array that contains every item shared between all the
// passed-in arrays.
export default function (array) {
	let result = [];
	let argsLength = arguments.length;
	for (let i = 0, length = getLength(array); i < length; i++) {
		let item = array[i];
		if (_contains(result, item)) continue;
		let j;
		for (j = 1; j < argsLength; j++) {
			if (!_contains(arguments[j], item)) break;
		}
		if (j === argsLength) result.push(item);
	}
	return result;
}