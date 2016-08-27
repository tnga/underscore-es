// `_isWeakSet` : an object's function
// ------------------------------------

import {toString} from './_quickaccess';

// Is a given value a weak-set?
export default function (obj) {
	return toString.call(obj) === '[object WeakSet]';
}