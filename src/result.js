// `_result` : an utility's function
// ----------------------------------

import _isFunction from './isFunction';

// If the value of the named `property` is a function then invoke it with the
// `object` as context; otherwise, return it.
export default function (object, prop, fallback) {
	let value = object == null ? void 0 : object[prop];
	if (value === void 0) {
		value = fallback;
	}
	return _isFunction(value) ? value.call(object) : value;
}