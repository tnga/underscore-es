// `_findWhere` : a collection's function
// ---------------------------------------

import _find from './find';
import _matcher from './matcher';

// Convenience version of a common use case of `find`: getting the first object
// containing specific `key:value` pairs.
export default function (obj, attrs) {
	return _find(obj, _matcher(attrs));
}