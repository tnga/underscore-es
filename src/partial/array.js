import {cb, restArgs, getLength, flatten, slice, createPredicateIndexFinder, createIndexFinder} from './_internal';
import {_contains, _filter, _pluck, _max} from './collection';
import {_isBoolean} from './object';

// Array Functions
// ---------------

// Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `_map`.
export function _take (array, n, guard) {
	if (array == null || array.length < 1) return void 0;
	if (n == null || guard) return array[0];
	return _initial(array, array.length - n);
}
// The cornerstone, a `head` implementation, aka `take`.
export var _head = _take;
// The cornerstone, a `first` implementation, aka `take`.
export var _first = _take;

// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
export function _initial (array, n, guard) {
	return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}

// Get the last element of an array. Passing **n** will return the last N
// values in the array.
export function _last (array, n, guard) {
	if (array == null || array.length < 1) return void 0;
	if (n == null || guard) return array[array.length - 1];
	return _rest(array, Math.max(0, array.length - n));
}

// Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
// Especially useful on the arguments object. Passing an **n** will return
// the rest N values in the array.
export function _drop (array, n, guard) {
	return slice.call(array, n == null || guard ? 1 : n);
}
// The cornerstone, a `tail` implementation, aka `drop`.
export var _tail = _drop;
// The cornerstone, a `rest` implementation, aka `drop`.
export var _rest = _drop;

// Trim out all falsy values from an array.
export function _compact (array) {
	return _filter(array, Boolean);
}

// Flatten out an array, either recursively (by default), or just one level.
export function _flatten (array, shallow) {
	return flatten(array, shallow, false);
}

// Return a version of the array that does not contain the specified value(s).
export var _without = restArgs(function (array, otherArrays) {
	return _difference(array, otherArrays);
});

// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
export function _unique (array, isSorted, iteratee, context) {
	if (!_isBoolean(isSorted)) {
		context = iteratee;
		iteratee = isSorted;
		isSorted = false;
	}
	if (iteratee != null) iteratee = cb(iteratee, context);
	let result = [];
	let seen = [];
	for (let i = 0, length = getLength(array); i < length; i++) {
		let value = array[i],
			computed = iteratee ? iteratee(value, i, array) : value;
		if (isSorted) {
			if (!i || seen !== computed) result.push(value);
			seen = computed;
		} else if (iteratee) {
			if (!_contains(seen, computed)) {
				seen.push(computed);
				result.push(value);
			}
		} else if (!_contains(result, value)) {
			result.push(value);
		}
	}
	return result;
}
// The cornerstone, a `uniq` implementation, aka `unique`.
export var _uniq = _unique;

// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
export var _union = restArgs(function (arrays) {
	return _uniq(flatten(arrays, true, true));
});

// Produce an array that contains every item shared between all the
// passed-in arrays.
export function _intersection (array) {
	let result = [];
	let argsLength = arguments.length;
	for (let i = 0, length = getLength(array); i < length; i++) {
		let item = array[i];
		if (_contains(result, item)) continue;
		let j;
		for (j = 1; j < argsLength; j++) {
			if (!_contains(arguments[j], item)) break;
		}
		if (j === argsLength) result.push(item);
	}
	return result;
}

// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
export var _difference = restArgs(function (array, rest) {
	rest = flatten(rest, true, true);
	return _filter(array, function (value) {
		return !_contains(rest, value);
	});
});

// Complement of `_.zip`. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
export function _unzip (array) {
	var length = array && _max(array, getLength).length || 0;
	var result = Array(length);

	for (var index = 0; index < length; index++) {
		result[index] = _pluck(array, index);
	}
	return result;
}

// Zip together multiple lists into a single array -- elements that share
// an index go together.
export var _zip = restArgs(_unzip);

// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values.
export function _object (list, values) {
	let result = {};
	for (let i = 0, length = getLength(list); i < length; i++) {
		if (values) {
			result[list[i]] = values[i];
		} else {
			result[list[i][0]] = list[i][1];
		}
	}
	return result;
}

// Returns the first index on an array-like that passes a predicate test.
export var _findIndex = createPredicateIndexFinder(1);
export var _findLastIndex = createPredicateIndexFinder(-1);

// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
export function _sortedIndex (array, obj, iteratee, context) {
	iteratee = cb(iteratee, context, 1);
	let value = iteratee(obj);
	let low = 0,
		high = getLength(array);
	while (low < high) {
		let mid = Math.floor((low + high) / 2);
		if (iteratee(array[mid]) < value) low = mid + 1;
		else high = mid;
	}
	return low;
}

// Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
export var _indexOf = createIndexFinder(1, _findIndex, _sortedIndex);
export var _lastIndexOf = createIndexFinder(-1, _findLastIndex);

// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](http://docs.python.org/library/functions.html#range).
export function _range (start, stop, step) {
	if (stop == null) {
		stop = start || 0;
		start = 0;
	}
	if (!step) {
		step = stop < start ? -1 : 1;
	}
	let length = Math.max(Math.ceil((stop - start) / step), 0);
	var range = Array(length);
	for (let idx = 0; idx < length; idx++, start += step) {
		range[idx] = start;
	}
	return range;
}

// Split an **array** into several arrays containing **count** or less elements
// of initial array.
export function _chunk (array, count) {
	if (count == null || count < 1) return [];
	let result = [];
	let i = 0,
		length = array.length;
	while (i < length) {
		result.push(slice.call(array, i, i += count));
	}
	return result;
};