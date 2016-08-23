// `_methods` : an object's function
// ---------------------------------

import _isFunction from './isFunction';

// Return a sorted list of the function names available on the object.
export default function (obj) {
	var names = [];
	for (var key in obj) {
		if (_isFunction(obj[key])) names.push(key);
	}
	return names.sort();
}