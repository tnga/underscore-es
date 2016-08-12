import {optimizeCb, cb, restArgs, baseCreate, flatten, hasEnumBug, collectNonEnumProps, createAssigner, keyInObj, eq, customArguments, customFunction, nativeKeys, nativeIsArray} from './_internal';
import {_each, _map, _contains, _pluck} from './collection';
import {_negate} from './function';

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