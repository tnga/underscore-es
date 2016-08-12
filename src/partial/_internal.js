import {_each, _contains} from './collection';
import {_isArray, _isFunction, _isObject, _isArguments, _isNaN, _invert, _keys, _has} from './object';
import {_iteratee, _identity,  _matcher, _property} from './utility';


// Save bytes in the minified (but not gzipped) version:
export var ArrayProto = Array.prototype;
export var ObjProto = Object.prototype;
export var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
export var push = ArrayProto.push;
export var slice = ArrayProto.slice;
export var toString = ObjProto.toString;
export var hasOwnProperty = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
export var nativeIsArray = Array.isArray;
export var nativeKeys = Object.keys;
export var nativeCreate = Object.create;

// Naked function reference for surrogate-prototype-swapping.
export var Ctor = function () {};

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
export var root = typeof self == 'object' && self.self === self && self ||
	typeof global == 'object' && global.global === global && global || this;

// Save the previous value of the `_` variable.
// @FUTURE will be deprecated with es6 popular usage and full support by browsers
export var previousUnderscore = root._;


// Baseline setup
function _ (obj) {
	if (obj instanceof _) return obj;
	if (!(this instanceof _)) return new _(obj);
	this._wrapped = obj;
}
// Current version.
_.VERSION = '1.8.3';

export {_ as default}; // @important: exportation of the function, not only it definition


// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
export function optimizeCb (func, context, argCount) {
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
	return _property(value);
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
	return function (obj) {
		return obj == null ? void 0 : obj[key];
	};
}

// Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
export var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
export var getLength = property('length');
export var isArrayLike = function(collection) {
	var length = getLength(collection);
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
export function group (behavior, partition) {
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
	var self = baseCreate(sourceFunc.prototype);
	var result = sourceFunc.apply(self, args);
	if (_isObject(result)) return result;
	return self;
}

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
export var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
export var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
// hack for enumeratin bug
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
				if (!defaults || obj[key] === void 0) obj[key] = source[key];
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
	var type = typeof a;
	if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
	return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `isEqual`.
// @TODO review hack for _, ... when will be in `_base.js`, ... partial source
export function deepEq (a, b, aStack, bStack) {
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
export function customArguments () {
	if (toString.call(arguments) === '[object Arguments]') return null;
	return function(obj) {
    return _has(obj, 'callee');
	};
}

// Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
// IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
export function customFunction () {
	if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof document !== 'undefined' && typeof document.childNodes != 'function') {
    return function(obj) {
      return typeof obj == 'function' || false;
    };
  }
	return null;
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