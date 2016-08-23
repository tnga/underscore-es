// `_detect` : a collection's function
// ------------------------------------

import _findIndex from './findIndex';
import _findKey from './findKey';
import {isArrayLike} from './_internal';

// Return the first value which passes a truth test. Aliased as `detect`.
export default function (obj, predicate, context) {
	let keyFinder = isArrayLike(obj) ? _findIndex : _findKey;
	let key = keyFinder(obj, predicate, context);
	if (key !== void 0 && key !== -1) return obj[key];
}