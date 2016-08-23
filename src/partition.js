// `_partition` : a collection's function
// ---------------------------------------

import {group} from './_internal';

// Split a collection into two arrays: one whose elements all satisfy the given
// predicate, and one whose elements all do not satisfy the predicate.
var _partition = group( (result, value, pass) => {
	result[pass ? 0 : 1].push(value);
}, true);

export {_partition as default};