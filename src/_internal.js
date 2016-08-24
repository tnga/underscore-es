// Internal functions
//--------------------

import _each from './each';
import _contains from './contains';
import _isArray from './isArray';
import _isFunction from './isFunction';
import _isObject from './isObject';
import _isArguments from './isArguments';
import _isNaN from './isNaN';
import _invert from './invert';
import _keys from './keys';
import _has from './has';
import _iteratee from './iteratee';
import _identity from './identity';
import _matcher from './matcher';
import _ from './_base';
import {ObjProto, SymbolProto, slice, toString, nativeCreate, Ctor} from './_quickaccess';


// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
export function optimizeCb (func, context, argCount) {
	if (context === void 0) return func;
	switch (argCount == null ? 3 : argCount) {
		case 1: return (value) => func.call(context, value);
			// The 2-parameter case has been omitted only because no current consumers
			// made use of it.
		case 3: return (value, index, collection) =>  func.call(context, value, index, collection);
		case 4: return (accumulator, value, index, collection) => func.call(context, accumulator, value, index, collection);
	}
	return function () {
		return func.apply(context, arguments);
	};
}

// for callback generator.
// This abstraction is use to hide the internal-only argCount argument.
export function builtinIteratee (value, context) {
	return cb(value, context, Infinity);
}

// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `identity`,
// an arbitrary callback, a property matcher, or a property accessor.
export function cb (value, context, argCount) {
	if (_iteratee !== builtinIteratee) return _iteratee(value, context);
	if (value == null) return _identity;
	if (_isFunction(value)) return optimizeCb(value, context, argCount);
	if (_isObject(value)) return _matcher(value);
	return property(value);
}

// Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
// This accumulates the arguments passed into an array, after a given index.
export function restArgs (func, startIndex) {
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
// @TODO from quickaccess
export function baseCreate (prototype) {
	if (!_isObject(prototype)) return {};
	if (nativeCreate) return nativeCreate(prototype);
	Ctor.prototype = prototype;
	var result = new Ctor;
	Ctor.prototype = null;
	return result;
}

// An internal function used for get key's value from an object.
export function property (key) {
	return (obj) => obj == null ? void 0 : obj[key];
}

// Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
export const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
export var getLength = property('length');
export var isArrayLike = function(collection) { // @TODO simplify to function
	let length = getLength(collection);
	return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

// Create a reducing function iterating left or right.
export function createReduce (dir) {
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
			let currentKey = keys ? keys[index] : index;
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
export function group (behavior, partition) {
	return function (obj, iteratee, context) {
		let result = partition ? [[], []] : {};
		iteratee = cb(iteratee, context);
		_each(obj, (value, index) => {
			let key = iteratee(value, index, obj);
			behavior(result, value, key);
		});
		return result;
	};
}

// Internal implementation of a recursive `flatten` function.
export function flatten (input, shallow, strict, output) {
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
export function createPredicateIndexFinder (dir) {
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
export function createIndexFinder (dir, predicateFind, sortedIndex) {
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
export function executeBound (sourceFunc, boundFunc, context, callingContext, args) {
	if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	let self = baseCreate(sourceFunc.prototype);
	let result = sourceFunc.apply(self, args);
	if (_isObject(result)) return result;
	return self;
}

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
// @TODO move to _quickaccess to prevent inappropriate cyclic dependency with `keys` and `allkeys`
// @FUTURE remove this hack when the will ignore IE<9 since the goal is now ES6 and beyond.
export var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
export var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
// hack for enumerating bug
export function collectNonEnumProps (obj, keys) {
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
export function createAssigner (keysFunc, defaults) {
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
				if (_isObject(obj) && (!defaults || obj[key] === void 0)) obj[key] = source[key];
			}
		}
		return obj;
	};
}

// Internal pick helper function to determine if `obj` has key `key`.
export function keyInObj (value, key, obj) {
	return key in obj;
}

// Internal recursive comparison function for `isEqual`.
export function eq (a, b, aStack, bStack) {
	// Identical objects are equal. `0 === -0`, but they aren't identical.
	// See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	if (a === b) return a !== 0 || 1 / a === 1 / b;
	// A strict comparison is necessary because `null == undefined`.
	if (a == null || b == null) return a === b;
	// `NaN`s are equivalent, but non-reflexive.
	if (a !== a) return b !== b;
	// Exhaust primitive checks
	let type = typeof a;
	if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
	return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `isEqual`.
// @TODO from quickaccess
export function deepEq (a, b, aStack, bStack) {
	// Unwrap any wrapped objects.
	if (a instanceof _) a = a._wrapped;
	if (b instanceof _) b = b._wrapped;
	// Compare `[[Class]]` names.
	let className = toString.call(a);
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

	let areArrays = className === '[object Array]';
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
	let length = aStack.length;
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
		let keys = _.keys(a),
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

// can be use to keep surrogate pair characters together (see `toArray` function for usage example)
export var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

// List of HTML entities for escaping.
export var escapeMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#x27;',
	'`': '&#x60;'
};
export var unescapeMap = _invert(escapeMap);

// Functions for escaping and unescaping strings to/from HTML interpolation.
export function createEscaper (map) {
	var escaper = (match) => map[match];
	// Regexes for identifying a key that needs to be escaped.
	var source = '(?:' + _keys(map).join('|') + ')';
	var testRegexp = RegExp(source);
	var replaceRegexp = RegExp(source, 'g');
	return (string) => {
		string = string == null ? '' : '' + string;
		return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	};
}

// When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
export var noMatch = /(.)^/;
// Certain characters need to be escaped so that they can be put into a
// string literal.
export var escapes = {
	"'": "'",
	'\\': '\\',
	'\r': 'r',
	'\n': 'n',
	'\u2028': 'u2028',
	'\u2029': 'u2029'
};
export var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
// function to escaped some characters
export function escapeChar (match) {
	return '\\' + escapes[match];
}