import {optimizeCb, cb, restArgs, getLength, isArrayLike, createReduce, group, slice} from './_internal';
import {_clone, _keys, _findKey, _has, _values, _isFunction, _isArray, _isString} from './object';
import {_findIndex, _indexOf} from './array';
import {_negate} from './function';
import {_matcher, _property, _random, _identity} from './utility';

// Collection Functions
// --------------------

// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
export function _forEach (obj, iteratee, context) {
	iteratee = optimizeCb(iteratee, context);
	var i, length;
	if (isArrayLike(obj)) {
		for (i = 0, length = obj.length; i < length; i++) {
			iteratee(obj[i], i, obj);
		}
	} else {
		var keys = _keys(obj);
		for (i = 0, length = keys.length; i < length; i++) {
			iteratee(obj[keys[i]], keys[i], obj);
		}
	}
	return obj;
}
// The cornerstone, an `each` implementation, aka `forEach`.
export var _each = _forEach;

// Return the results of applying the iteratee to each element.
export function _collect (obj, iteratee, context) {
	iteratee = cb(iteratee, context);
	let keys = !isArrayLike(obj) && _keys(obj),
		length = (keys || obj).length,
		results = Array(length);
	for (let index = 0; index < length; index++) {
		let currentKey = keys ? keys[index] : index;
		results[index] = iteratee(obj[currentKey], currentKey, obj);
	}
	return results;
}
// The cornerstone, a `map` implementation, aka `collect`.
export var _map = _collect;

// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
export var _inject = createReduce(1);
export var _foldl = _inject;
export var _reduce = _foldl;

// The right-associative version of reduce, also known as `foldr`.
export var _foldr = createReduce(-1);
export var _reduceRight = _foldr;

// Return the first value which passes a truth test. Aliased as `detect`.
export function _detect (obj, predicate, context) {
	let keyFinder = isArrayLike(obj) ? _findIndex : _findKey;
	let key = keyFinder(obj, predicate, context);
	if (key !== void 0 && key !== -1) return obj[key];
}
// The cornerstone, a `find` implementation, aka `detect`.
export var _find = _detect;

// Return all the elements that pass a truth test.
export function _select (obj, predicate, context) {
	let results = [];
	predicate = cb(predicate, context);
	_each(obj, function (value, index, list) {
		if (predicate(value, index, list)) results.push(value);
	});
	return results;
}
// The cornerstone, a `filter` implementation, aka `select`.
export var _filter = _select;

// Return all the elements for which a truth test fails.
export function _reject (obj, predicate, context) {
	return _filter(obj, _negate(cb(predicate)), context);
}

// Determine whether all of the elements match a truth test.
export function _all (obj, predicate, context) {
	predicate = cb(predicate, context);
	let keys = !isArrayLike(obj) && _keys(obj),
		length = (keys || obj).length;
	for (let index = 0; index < length; index++) {
		var currentKey = keys ? keys[index] : index;
		if (!predicate(obj[currentKey], currentKey, obj)) return false;
	}
	return true;
}
// The cornerstone, a `every` implementation, aka `all`.
export var _every = _all;

// Determine if at least one element in the object matches a truth test.
// Aliased as `any`.
export function _any (obj, predicate, context) {
	predicate = cb(predicate, context);
	let keys = !isArrayLike(obj) && _keys(obj),
		length = (keys || obj).length;
	for (let index = 0; index < length; index++) {
		let currentKey = keys ? keys[index] : index;
		if (predicate(obj[currentKey], currentKey, obj)) return true;
	}
	return false;
}
// The cornerstone, a `some` implementation, aka `any`.
export var _some = _any;

// Determine if the array or object contains a given item (using `===`).
export function _include (obj, item, fromIndex, guard) {
	if (!isArrayLike(obj)) obj = _values(obj);
	if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	return _indexOf(obj, item, fromIndex) >= 0;
}
// The cornerstone, a `includes` implementation, aka `include`.
export var _includes = _include;
// The cornerstone, a `contains` implementation, aka `include`.
export var _contains = _include;

// Invoke a method (with arguments) on every item in a collection.
export var _invoke = restArgs(function (obj, method, args) {
	let isFunc = _isFunction(method);
	return _map(obj, function (value) {
		let func = isFunc ? method : value[method];
		return func == null ? func : func.apply(value, args);
	});
});

// Convenience version of a common use case of `map`: fetching a property.
export function _pluck (obj, key) {
	return _map(obj, _property(key));
}

// Convenience version of a common use case of `filter`: selecting only objects
// containing specific `key:value` pairs.
export function _where (obj, attrs) {
	return _filter(obj, _matcher(attrs));
}

// Convenience version of a common use case of `find`: getting the first object
// containing specific `key:value` pairs.
export function _findWhere (obj, attrs) {
	return _find(obj, _matcher(attrs));
}

// Return the maximum element (or element-based computation).
export function _max (obj, iteratee, context) {
	let result = -Infinity,
		lastComputed = -Infinity,
		value, computed;
	if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
		obj = isArrayLike(obj) ? obj : _values(obj);
		for (var i = 0, length = obj.length; i < length; i++) {
			value = obj[i];
			if (value != null && value > result) {
				result = value;
			}
		}
	} else {
		iteratee = cb(iteratee, context);
		_each(obj, function (v, index, list) {
			computed = iteratee(v, index, list);
			if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
				result = v;
				lastComputed = computed;
			}
		});
	}
	return result;
}

// Return the minimum element (or element-based computation).
export function _min (obj, iteratee, context) {
	var result = Infinity,
		lastComputed = Infinity,
		value, computed;
	if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
		obj = isArrayLike(obj) ? obj : _values(obj);
		for (var i = 0, length = obj.length; i < length; i++) {
			value = obj[i];
			if (value != null && value < result) {
				result = value;
			}
		}
	} else {
		iteratee = cb(iteratee, context);
		_each(obj, function (v, index, list) {
			computed = iteratee(v, index, list);
			if (computed < lastComputed || computed === Infinity && result === Infinity) {
				result = v;
				lastComputed = computed;
			}
		});
	}
	return result;
}

// Shuffle a collection.
export function _shuffle (obj) {
	return _sample(obj, Infinity);
}

// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `map`.
export function _sample (obj, n, guard) {
	if (n == null || guard) {
		if (!isArrayLike(obj)) obj = _values(obj);
		return obj[_random(obj.length - 1)];
	}
	let levy = isArrayLike(obj) ? _clone(obj) : _values(obj);
	let length = getLength(levy);
	n = Math.max(Math.min(n, length), 0);
	let last = length - 1;
	for (let index = 0; index < n; index++) {
		let rand = _random(index, last);
		let temp = levy[index];
		levy[index] = levy[rand];
		levy[rand] = temp;
	}
	return levy.slice(0, n);
}

// Sort the object's values by a criterion produced by an iteratee.
export function _sortBy (obj, iteratee, context) {
	var index = 0;
	iteratee = cb(iteratee, context);
	return _pluck(_map(obj, function (value, key, list) {
		return {
			value: value,
			index: index++,
			criteria: iteratee(value, key, list)
		};
	}).sort(function (left, right) {
		var a = left.criteria;
		var b = right.criteria;
		if (a !== b) {
			if (a > b || a === void 0) return 1;
			if (a < b || b === void 0) return -1;
		}
		return left.index - right.index;
	}), 'value');
}

// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
export var _groupBy = group(function (result, value, key) {
	if (_has(result, key)) result[key].push(value);
	else result[key] = [value];
});

// Indexes the object's values by a criterion, similar to `groupBy`, but for
// when you know that your index values will be unique.
export var _indexBy = group(function (result, value, key) {
	result[key] = value;
});

// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
export var _countBy = group(function (result, value, key) {
	if (_has(result, key)) result[key]++;
	else result[key] = 1;
});

// Safely create a real, live array from anything iterable.
export function _toArray (obj) {
	if (!obj) return [];
	if (_isArray(obj)) return slice.call(obj);
	if (_isString(obj)) {
		// Keep surrogate pair characters together
		return obj.match(reStrSymbol);
	}
	if (isArrayLike(obj)) return _map(obj, _identity);
	return _values(obj);
}

// Return the number of elements in an object.
export function _size (obj) {
	if (obj == null) return 0;
	return isArrayLike(obj) ? obj.length : _keys(obj).length;
}

// Split a collection into two arrays: one whose elements all satisfy the given
// predicate, and one whose elements all do not satisfy the predicate.
export var _partition = group(function (result, value, pass) {
	result[pass ? 0 : 1].push(value);
}, true);