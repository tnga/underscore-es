// `_compact` : an array's function
// ---------------------------------

import _filter from './filter';

// Trim out all falsy values from an array.
export default function (array) {
	return _filter(array, Boolean);
}