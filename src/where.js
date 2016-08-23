// `_where` : a collection's function
// ------------------------------------

import _filter from './filter';
import _matcher from './matcher';

// Convenience version of a common use case of `filter`: selecting only objects
// containing specific `key:value` pairs.
export default function (obj, attrs) {
	return _filter(obj, _matcher(attrs));
}