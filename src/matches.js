// `_matches` : an utility's function
// -----------------------------------

import _extendOwn from './extendOwn';
import _isMatch from './isMatch';

// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
export default function (attrs) {
	attrs = _extendOwn({}, attrs);
	return (obj) => _isMatch(obj, attrs);
}