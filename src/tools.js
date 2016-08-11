import {ArrayProto, ObjProto, SymbolProto, push, slice, toString, hasOwnProperty, nativeIsArray, nativeKeys, nativeCreate, Ctor} from './_quickaccess';

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self == 'object' && self.self === self && self ||
	typeof global == 'object' && global.global === global && global || this;

// Save the previous value of the `_` variable.
// @FUTURE will be deprecated with es6 popular usage and full support by browsers
var previousUnderscore = root._;


// Baseline setup
function _ (obj) {
	if (obj instanceof _) return obj;
	if (!(this instanceof _)) return new _(obj);
	this._wrapped = obj;
}
// Current version.
_.VERSION = '1.8.3';

export {_}; // @important: exportation of the function, not only it definition


// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
function optimizeCb (func, context, argCount) {
	if (context === void 0) return func;
	switch (argCount == null ? 3 : argCount) {
		case 1: return function(value) {
			return func.call(context, value);
		};
			// The 2-parameter case has been omitted only because no current consumers
			// made use of it.
		case 3: return function(value, index, collection) {
			return func.call(context, value, index, collection);
		};
		case 4: return function(accumulator, value, index, collection) {
			return func.call(context, accumulator, value, index, collection);
		};
	}
	return function() {
		return func.apply(context, arguments);
	};
}

// for callback generator.
// This abstraction is use to hide the internal-only argCount argument.
function builtinIteratee (value, context) {
	return cb(value, context, Infinity);
}

// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `identity`,
// an arbitrary callback, a property matcher, or a property accessor.
function cb (value, context, argCount) {
	if (_iteratee !== builtinIteratee) return _iteratee(value, context);
	if (value == null) return _identity;
	if (_isFunction(value)) return optimizeCb(value, context, argCount);
	if (_isObject(value)) return _matcher(value);
	return _property(value);
}

// Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
// This accumulates the arguments passed into an array, after a given index.
function restArgs (func, startIndex) {
	startIndex = startIndex == null ? func.length - 1 : +startIndex;
	return function () {
		let length = Math.max(arguments.length - startIndex, 0),
			rest = Array(length),
			index = 0;
		for (; index < length; index++) {
			rest[index] = arguments[index + startIndex];
		}
		switch (startIndex) {
			case 0:
				return func.call(this, rest);
			case 1:
				return func.call(this, arguments[0], rest);
			case 2:
				return func.call(this, arguments[0], arguments[1], rest);
		}
		var args = Array(startIndex + 1);
		for (index = 0; index < startIndex; index++) {
			args[index] = arguments[index];
		}
		args[startIndex] = rest;
		return func.apply(this, args);
	};
}

// An internal function for creating a new object that inherits from another.
function baseCreate (prototype) {
	if (!_isObject(prototype)) return {};
	if (nativeCreate) return nativeCreate(prototype);
	Ctor.prototype = prototype;
	var result = new Ctor;
	Ctor.prototype = null;
	return result;
}

// An internal function used for get key's value from an object.
function property (key) {
	return function (obj) {
		return obj == null ? void 0 : obj[key];
	};
}

// Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = property('length');
var isArrayLike = function(collection) {
	var length = getLength(collection);
	return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

// Create a reducing function iterating left or right.
function createReduce (dir) {
	// Wrap code that reassigns argument variables in a separate function than
	// the one that accesses `arguments.length` to avoid a perf hit. (#1991)
	let reducer = function (obj, iteratee, memo, initial) {
		let keys = !isArrayLike(obj) && _keys(obj),
			length = (keys || obj).length,
			index = dir > 0 ? 0 : length - 1;
		if (!initial) {
			memo = obj[keys ? keys[index] : index];
			index += dir;
		}
		for (; index >= 0 && index < length; index += dir) {
			var currentKey = keys ? keys[index] : index;
			memo = iteratee(memo, obj[currentKey], currentKey, obj);
		}
		return memo;
	};

	return function(obj, iteratee, memo, context) {
		let initial = arguments.length >= 3;
		return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
	};
}

// An internal function used for aggregate "group by" operations.
function group (behavior, partition) {
	return function (obj, iteratee, context) {
		var result = partition ? [[], []] : {};
		iteratee = cb(iteratee, context);
		_each(obj, function (value, index) {
			var key = iteratee(value, index, obj);
			behavior(result, value, key);
		});
		return result;
	};
}

// Internal implementation of a recursive `flatten` function.
function flatten (input, shallow, strict, output) {
	output = output || [];
	let idx = output.length;
	for (let i = 0, length = getLength(input); i < length; i++) {
		var value = input[i];
		if (isArrayLike(value) && (_isArray(value) || _isArguments(value))) {
			// Flatten current level of array or arguments object.
			if (shallow) {
				let j = 0,
					len = value.length;
				while (j < len) output[idx++] = value[j++];
			} else {
				flatten(value, shallow, strict, output);
				idx = output.length;
			}
		} else if (!strict) {
			output[idx++] = value;
		}
	}
	return output;
}

// Generator function to create the findIndex and findLastIndex functions.
function createPredicateIndexFinder (dir) {
	return function (array, predicate, context) {
		predicate = cb(predicate, context);
		let length = getLength(array);
		let index = dir > 0 ? 0 : length - 1;
		for (; index >= 0 && index < length; index += dir) {
			if (predicate(array[index], index, array)) return index;
		}
		return -1;
	};
}

// Generator function to create the indexOf and lastIndexOf functions.
function createIndexFinder (dir, predicateFind, sortedIndex) {
	return function (array, item, idx) {
		let i = 0,
			length = getLength(array);
		if (typeof idx == 'number') {
			if (dir > 0) {
				i = idx >= 0 ? idx : Math.max(idx + length, i);
			} else {
				length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
			}
		} else if (sortedIndex && idx && length) {
			idx = sortedIndex(array, item);
			return array[idx] === item ? idx : -1;
		}
		if (item !== item) {
			idx = predicateFind(slice.call(array, i, length), _isNaN);
			return idx >= 0 ? idx + i : -1;
		}
		for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
			if (array[idx] === item) return idx;
		}
		return -1;
	};
}

// Determines whether to execute a function as a constructor
// or a normal function with the provided arguments.
function executeBound (sourceFunc, boundFunc, context, callingContext, args) {
	if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	var self = baseCreate(sourceFunc.prototype);
	var result = sourceFunc.apply(self, args);
	if (_isObject(result)) return result;
	return self;
}

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
// hack for enumeratin bug
function collectNonEnumProps (obj, keys) {
	let nonEnumIdx = nonEnumerableProps.length;
	let constructor = obj.constructor;
	let proto = _isFunction(constructor) && constructor.prototype || ObjProto;

	// Constructor is a special case.
	let prop = 'constructor';
	if (_has(obj, prop) && !_contains(keys, prop)) keys.push(prop);

	while (nonEnumIdx--) {
		prop = nonEnumerableProps[nonEnumIdx];
		if (prop in obj && obj[prop] !== proto[prop] && !_contains(keys, prop)) {
			keys.push(prop);
		}
	}
}

// An internal function for creating assigner functions.
function createAssigner (keysFunc, defaults) {
	return function (obj) {
		let length = arguments.length;
		if (defaults) obj = Object(obj);
		if (length < 2 || obj == null) return obj;
		for (let index = 1; index < length; index++) {
			let source = arguments[index],
				keys = keysFunc(source),
				l = keys.length;
			for (let i = 0; i < l; i++) {
				let key = keys[i];
				if (!defaults || obj[key] === void 0) obj[key] = source[key];
			}
		}
		return obj;
	};
}

// Internal pick helper function to determine if `obj` has key `key`.
function keyInObj (value, key, obj) {
	return key in obj;
}

// Internal recursive comparison function for `isEqual`.
function eq (a, b, aStack, bStack) {
	// Identical objects are equal. `0 === -0`, but they aren't identical.
	// See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	if (a === b) return a !== 0 || 1 / a === 1 / b;
	// A strict comparison is necessary because `null == undefined`.
	if (a == null || b == null) return a === b;
	// `NaN`s are equivalent, but non-reflexive.
	if (a !== a) return b !== b;
	// Exhaust primitive checks
	var type = typeof a;
	if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
	return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `isEqual`.
function deepEq (a, b, aStack, bStack) {
	// Unwrap any wrapped objects.
	if (a instanceof _) a = a._wrapped;
	if (b instanceof _) b = b._wrapped;
	// Compare `[[Class]]` names.
	var className = toString.call(a);
	if (className !== toString.call(b)) return false;
	switch (className) {
		// Strings, numbers, regular expressions, dates, and booleans are compared by value.
		case '[object RegExp]':
			// RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
		case '[object String]':
			// Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
			// equivalent to `new String("5")`.
			return '' + a === '' + b;
		case '[object Number]':
			// `NaN`s are equivalent, but non-reflexive.
			// Object(NaN) is equivalent to NaN.
			if (+a !== +a) return +b !== +b;
			// An `egal` comparison is performed for other numeric values.
			return +a === 0 ? 1 / +a === 1 / b : +a === +b;
		case '[object Date]':
		case '[object Boolean]':
			// Coerce dates and booleans to numeric primitive values. Dates are compared by their
			// millisecond representations. Note that invalid dates with millisecond representations
			// of `NaN` are not equivalent.
			return +a === +b;
		case '[object Symbol]':
			return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
	}

	var areArrays = className === '[object Array]';
	if (!areArrays) {
		if (typeof a != 'object' || typeof b != 'object') return false;

		// Objects with different constructors are not equivalent, but `Object`s or `Array`s
		// from different frames are.
		var aCtor = a.constructor,
			bCtor = b.constructor;
		if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
				_.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
			return false;
		}
	}
	// Assume equality for cyclic structures. The algorithm for detecting cyclic
	// structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	// Initializing stack of traversed objects.
	// It's done here since we only need them for objects and arrays comparison.
	aStack = aStack || [];
	bStack = bStack || [];
	var length = aStack.length;
	while (length--) {
		// Linear search. Performance is inversely proportional to the number of
		// unique nested structures.
		if (aStack[length] === a) return bStack[length] === b;
	}

	// Add the first object to the stack of traversed objects.
	aStack.push(a);
	bStack.push(b);

	// Recursively compare objects and arrays.
	if (areArrays) {
		// Compare array lengths to determine if a deep comparison is necessary.
		length = a.length;
		if (length !== b.length) return false;
		// Deep compare the contents, ignoring non-numeric properties.
		while (length--) {
			if (!eq(a[length], b[length], aStack, bStack)) return false;
		}
	} else {
		// Deep compare objects.
		var keys = _.keys(a),
			key;
		length = keys.length;
		// Ensure that both objects contain the same number of properties before comparing deep equality.
		if (_.keys(b).length !== length) return false;
		while (length--) {
			// Deep compare each member
			key = keys[length];
			if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
		}
	}
	// Remove the first object from the stack of traversed objects.
	aStack.pop();
	bStack.pop();
	return true;
}

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
function customArguments () {
	if (toString.call(arguments) === '[object Arguments]') return null;
	return function(obj) {
    return _has(obj, 'callee');
	};
}

// Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
// IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
function customFunction () {
	if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof (root.document && root.document.childNodes) != 'function') {
    return function(obj) {
      return typeof obj == 'function' || false;
    };
  }
	return null;
}

// can be use to keep surrogate pair characters together (see `toArray` function for usage example)
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

// List of HTML entities for escaping.
var escapeMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#x27;',
	'`': '&#x60;'
};
var unescapeMap = _invert(escapeMap);

// Functions for escaping and unescaping strings to/from HTML interpolation.
function createEscaper (map) {
	var escaper = function (match) {
		return map[match];
	};
	// Regexes for identifying a key that needs to be escaped.
	var source = '(?:' + _keys(map).join('|') + ')';
	var testRegexp = RegExp(source);
	var replaceRegexp = RegExp(source, 'g');
	return function (string) {
		string = string == null ? '' : '' + string;
		return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	};
}

// When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /(.)^/;
// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
	"'": "'",
	'\\': '\\',
	'\r': 'r',
	'\n': 'n',
	'\u2028': 'u2028',
	'\u2029': 'u2029'
};
var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
// function to escaped some characters
function escapeChar (match) {
	return '\\' + escapes[match];
}


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
}


// Object Functions
// ----------------

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
export function _keys (obj) {
	if (!_isObject(obj)) return [];
	if (nativeKeys) return nativeKeys(obj);
	var keys = [];
	for (var key in obj)
		if (_has(obj, key)) keys.push(key);
		// Ahem, IE < 9.
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
}

// Retrieve all the property names of an object.
export function _allKeys (obj) {
	if (!_isObject(obj)) return [];
	var keys = [];
	for (var key in obj) keys.push(key);
	// Ahem, IE < 9.
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
}

// Retrieve the values of an object's properties.
export function _values (obj) {
	let keys = _keys(obj);
	let length = keys.length;
	let values = Array(length);
	for (let i = 0; i < length; i++) {
		values[i] = obj[keys[i]];
	}
	return values;
}

// Returns the results of applying the iteratee to each element of the object.
// In contrast to `_.map` it returns an object.
export function _mapObject (obj, iteratee, context) {
	iteratee = cb(iteratee, context);
	let keys = _keys(obj),
		length = keys.length,
		results = {};
	for (let index = 0; index < length; index++) {
		let currentKey = keys[index];
		results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	}
	return results;
}

// Convert an object into a list of `[key, value]` pairs.
export function _pairs (obj) {
	let keys = _keys(obj);
	let length = keys.length;
	let pairs = Array(length);
	for (let i = 0; i < length; i++) {
		pairs[i] = [keys[i], obj[keys[i]]];
	}
	return pairs;
}

// Invert the keys and values of an object. The values must be serializable.
export function _invert (obj) {
	let result = {};
	let keys = _keys(obj);
	for (let i = 0, length = keys.length; i < length; i++) {
		result[obj[keys[i]]] = keys[i];
	}
	return result;
}

// Return a sorted list of the function names available on the object.
export function _methods (obj) {
	var names = [];
	for (var key in obj) {
		if (_isFunction(obj[key])) names.push(key);
	}
	return names.sort();
}
// The cornerstone, a `functions` implementation, aka `methods`.
export var _functions = _methods;

// Extend a given object with all the properties in passed-in object(s).
export var _extend = createAssigner(_allKeys);

// Assigns a given object with all the own properties in the passed-in object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
export var _extendOwn = createAssigner(_keys);
export var _assign = _extendOwn;

// Returns the first key on an object that passes a predicate test.
export function _findKey (obj, predicate, context) {
	predicate = cb(predicate, context);
	let keys = _keys(obj),
		key;
	for (let i = 0, length = keys.length; i < length; i++) {
		key = keys[i];
		if (predicate(obj[key], key, obj)) return key;
	}
}

// Return a copy of the object only containing the whitelisted properties.
export var _pick = restArgs(function (obj, keys) {
	let result = {},
		iteratee = keys[0];
	if (obj == null) return result;
	if (_isFunction(iteratee)) {
		if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
		keys = _allKeys(obj);
	} else {
		iteratee = keyInObj;
		keys = flatten(keys, false, false);
		obj = Object(obj);
	}
	for (let i = 0, length = keys.length; i < length; i++) {
		var key = keys[i];
		var value = obj[key];
		if (iteratee(value, key, obj)) result[key] = value;
	}
	return result;
});

// Return a copy of the object without the blacklisted properties.
export var _omit = restArgs(function (obj, keys) {
	let iteratee = keys[0],
		context;
	if (_isFunction(iteratee)) {
		iteratee = _negate(iteratee);
		if (keys.length > 1) context = keys[1];
	} else {
		keys = _map(flatten(keys, false, false), String);
		iteratee = function (value, key) {
			return !_contains(keys, key);
		};
	}
	return _pick(obj, iteratee, context);
});

// Fill in a given object with default properties.
export var _defaults = createAssigner(_allKeys, true);

// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
export function _create (prototype, props) {
	var result = baseCreate(prototype);
	if (props) _extendOwn(result, props);
	return result;
}

// Create a (shallow-cloned) duplicate of an object.
export function _clone (obj) {
	if (!_isObject(obj)) return obj;
	return _isArray(obj) ? obj.slice() : _extend({}, obj);
}

// Invokes interceptor with the obj, and then returns obj.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
export function _tap (obj, interceptor) {
	interceptor(obj);
	return obj;
}

// Returns whether an object has a given set of `key:value` pairs.
export function _isMatch (object, attrs) {
	let keys = _keys(attrs),
		length = keys.length;
	if (object == null) return !length;
	let obj = Object(object);
	for (let i = 0; i < length; i++) {
		let key = keys[i];
		if (attrs[key] !== obj[key] || !(key in obj)) return false;
	}
	return true;
}

// Perform a deep comparison to check if two objects are equal.
export function _isEqual (a, b) {
	return eq(a, b);
}

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
export function _isEmpty (obj) {
	if (obj == null) return true;
	if (isArrayLike(obj) && (_isArray(obj) || _isString(obj) || _isArguments(obj))) return obj.length === 0;
	return _keys(obj).length === 0;
}

// Is a given value a DOM element?
export function _isElement (obj) {
	return !!(obj && obj.nodeType === 1);
}

// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
export var _isArray = nativeIsArray || function (obj) {
	return toString.call(obj) === '[object Array]';
}

// Is a given variable an object?
export function _isObject (obj) {
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
}

// Is a given value an arguments object?
export var _isArguments = customArguments() || function (obj) {
	return toString.call(obj) === '[object Arguments]';
}

// Is a given value a function?
export var _isFunction = customFunction() || function (obj) {
	return toString.call(obj) === '[object Function]';
}

// Is a given value a string?
export function _isString (obj) {
	return toString.call(obj) === '[object String]';
}

// Is a given value a number?
export function _isNumber (obj) {
	return toString.call(obj) === '[object Number]';
}

// Is a given value a date?
export function _isDate (obj) {
	return toString.call(obj) === '[object Date]';
}

// Is a given value a regular expression?
export function _isRegExp (obj) {
	return toString.call(obj) === '[object RegExp]';
}

// Is a given value an error?
export function _isError (obj) {
	return toString.call(obj) === '[object Error]';
}

// Is a given value a symbol?
export function _isSymbol (obj) {
	return toString.call(obj) === '[object Symbol]';
}

// Is a given value a map?
export function _isMap (obj) {
	return toString.call(obj) === '[object Map]';
}

// Is a given value a weak-map?
export function _isWeakMap (obj) {
	return toString.call(obj) === '[object WeakMap]';
}

// Is a given value a set?
export function _isSet (obj) {
	return toString.call(obj) === '[object Set]';
}

// Is a given value a weak-set?
export function _isWeakSet (obj) {
	return toString.call(obj) === '[object WeakSet]';
}

// Is a given object a finite number?
export function _isFinite (obj) {
	return !_isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
}

// Is the given value `NaN`?
export function _isNaN (obj) {
	return _isNumber(obj) && isNaN(obj);
}

// Is a given value a boolean?
export function _isBoolean (obj) {
	return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}

// Is a given value equal to null?
export function _isNull (obj) {
	return obj === null;
};

// Is a given variable undefined?
export function _isUndefined (obj) {
	return obj === void 0;
}

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
// @TODO use _isNull instead
export function _has (obj, key) {
	return obj != null && hasOwnProperty.call(obj, key);
}


// Function (ahem) Functions
// -------------------------

// Create a function bound to a given object (assigning `this`, and arguments,
// optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
// available.
export var _bind = restArgs(function (func, context, args) {
  if (!_isFunction(func)) throw new TypeError('Bind must be called on a function');
  var bound = restArgs(function (callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
});

// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. _ acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
export var _partial = restArgs(function (func, boundArgs) {
  let placeholder = _partial.placeholder;
  var bound = function () {
    let position = 0,
      length = boundArgs.length;
    let args = Array(length);
    for (let i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return executeBound(func, bound, this, this, args);
  };
  return bound;
});
 _partial.placeholder = _;

// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
export var _bindAll = restArgs(function (obj, keys) {
  keys = flatten(keys, false, false);
  let index = keys.length;
  if (index < 1) throw new Error('bindAll must be passed function names');
  while (index--) {
    let key = keys[index];
    obj[key] = _bind(obj[key], obj);
  }
});

// Memoize an expensive function by storing its results.
export function _memoize (func, hasher) {
  let memoize = function (key) {
    let cache = memoize.cache;
    let address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!_has(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}

// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
export var _delay = restArgs(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
});

// Defers a function, scheduling it to run after the current call stack has cleared.
export var _defer = _partial(_delay, _partial.placeholder, 1);

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export function _throttle (func, wait, options) {
  let timeout, context, args, result;
  let previous = 0;
  if (!options) options = {};

  let later = function () {
    previous = options.leading === false ? 0 : _now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  let throttled = function () {
    let now = _now();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function _debounce (func, wait, immediate) {
  let timeout, result;

  let later = function (context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  let debounced = restArgs(function (args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = _delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
export function _wrap (func, wrapper) {
  return _partial(wrapper, func);
}

// Returns a negated version of the passed-in predicate.
export function _negate (predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}

// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
export function _compose () {
  let args = arguments;
  let start = args.length - 1;
  return function () {
    let i = start;
    let result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

// Returns a function that will only be executed on and after the Nth call.
export function _after (times, func) {
  return function () {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}

// Returns a function that will only be executed up to (but not including) the Nth call.
export function _before (times, func) {
  var memo;
  return function () {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) func = null;
    return memo;
  };
}

// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
export var _once = _partial(_before, 2);

// This accumulates the arguments passed into an array, after a given index.
export var _restArgs = restArgs;


// Utility Functions
// -----------------

// Run Underscore.js in *noConflict* mode, returning the `_` variable to its
// previous owner. Returns a reference to the Underscore object.
// @FUTURE will be deprecated with es6 popular usage and full support by browsers
export function _noConflict () {
	root._ = previousUnderscore;
	return this;
}

// Keep the identity function around for default iteratees.
export function _identity (value) {
	return value;
}

// Predicate-generating functions. Often useful outside of Underscore.
export function _constant (value) {
	return function () {
		return value;
	};
}

// `noop` function
export function _noop () {}

// function used for get key's value from an object.
export var _property = property;

// Generates a function for a given object that returns a given property.
export function _propertyOf (obj) {
	return obj == null ? function () {} : function (key) {
		return obj[key];
	};
}

// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
export function _matches (attrs) {
	attrs = _extendOwn({}, attrs);
	return function (obj) {
		return _isMatch(obj, attrs);
	};
}
// The cornerstone, a `matcher` implementation, aka `matches`.
export var _matcher = _matches; 

// Run a function **n** times.
export function _times (n, iteratee, context) {
	let accum = Array(Math.max(0, n));
	iteratee = optimizeCb(iteratee, context, 1);
	for (let i = 0; i < n; i++) accum[i] = iteratee(i);
	return accum;
}

// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only argCount argument.
export var _iteratee = builtinIteratee;
export function _setIteratee (fn) {
	_iteratee = _isFunction(fn) ? fn : builtinIteratee;
}

// Return a random integer between min and max (inclusive).
export function _random (min, max) {
	if (max == null) {
		max = min;
		min = 0;
	}
	return min + Math.floor(Math.random() * (max - min + 1));
}

// A (possibly faster) way to get the current timestamp as an integer.
export var _now = Date.now || function () {
	return new Date().getTime();
}

// Functions for escaping strings to/from HTML interpolation.
export var _escape = createEscaper(escapeMap);

// Functions for unescaping strings to/from HTML interpolation.
export var _unescape = createEscaper(unescapeMap);

// If the value of the named `property` is a function then invoke it with the
// `object` as context; otherwise, return it.
export function _result (object, prop, fallback) {
	let value = object == null ? void 0 : object[prop];
	if (value === void 0) {
		value = fallback;
	}
	return _isFunction(value) ? value.call(object) : value;
}

// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
let idCounter = 0;
export function _uniqueId (prefix) {
	let id = ++idCounter + '';
	return prefix ? prefix + id : id;
}

// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
export var _templateSettings = {
	evaluate: /<%([\s\S]+?)%>/g,
	interpolate: /<%=([\s\S]+?)%>/g,
	escape: /<%-([\s\S]+?)%>/g
};

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
export function _template (text, settings, oldSettings) {
	if (!settings && oldSettings) settings = oldSettings;
	settings = _defaults({}, settings, _templateSettings);

	// Combine delimiters into one regular expression via alternation.
	let matcher = RegExp([
		(settings.escape || noMatch).source,
		(settings.interpolate || noMatch).source,
		(settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

	// Compile the template source, escaping string literals appropriately.
	let index = 0;
	let source = "__p+='";
	text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
		source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
		index = offset + match.length;

		if (escape) {
			source += "'+\n((__t=(" + escape + "))==null?'':_escape(__t))+\n'";
		} else if (interpolate) {
			source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
		} else if (evaluate) {
			source += "';\n" + evaluate + "\n__p+='";
		}

		// Adobe VMs need the match returned to produce the correct offset.
		return match;
	});
	source += "';\n";

	// If a variable is not specified, place data values in local scope.
	if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	source = "var __t,__p='',__j=Array.prototype.join," +
		"print=function(){__p+=__j.call(arguments,'');};\n" +
		source + 'return __p;\n';

	let render;
	try {
		render = new Function(settings.variable || 'obj', '_', source);
	} catch (e) {
		e.source = source;
		throw e;
	}

	let template = function (data) {
		return render.call(this, data, _);
	};

	// Provide the compiled source as a convenience for precompilation.
	let argument = settings.variable || 'obj';
	template.source = 'function(' + argument + '){\n' + source + '}';

	return template;
}