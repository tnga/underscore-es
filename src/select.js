// `_select` : a collection's function
// ------------------------------------

import _each from './each';
import {cb} from './_internal';

// Return all the elements that pass a truth test.
export default function (obj, predicate, context) {
	let results = [];
	predicate = cb(predicate, context);
	_each(obj, (value, index, list) => {
		if (predicate(value, index, list)) results.push(value);
	});
	return results;
}