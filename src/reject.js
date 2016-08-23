// `_reject` : a collection's function
// ------- ----------------------------

import _filter from './filter';
import _negate from './negate';
import {cb} from './_internal';

// Return all the elements for which a truth test fails.
export default function (obj, predicate, context) {
	return _filter(obj, _negate(cb(predicate)), context);
}