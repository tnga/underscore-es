// `_sortBy` : a collection's function
// ------------------------------------

import _pluck from './pluck';
import _map from './map';
import {cb} from './_internal';

// Sort the object's values by a criterion produced by an iteratee.
export default function (obj, iteratee, context) {
	var index = 0;
	iteratee = cb(iteratee, context);
	return _pluck(_map(obj, (value, key, list) => {
		return {
			value: value,
			index: index++,
			criteria: iteratee(value, key, list)
		};
	}).sort( (left, right) => {
		var a = left.criteria;
		var b = right.criteria;
		if (a !== b) {
			if (a > b || a === void 0) return 1;
			if (a < b || b === void 0) return -1;
		}
		return left.index - right.index;
	}), 'value');
}