import {_, optimizeCb, builtinIteratee, property, createEscaper, escapeMap, unescapeMap, noMatch, escapeRegExp, escapeChar, root, previousUnderscore} from './_internal';
import {_extendOwn, _isMatch, _isFunction, _defaults} from './object';

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
 export function _setIteratee (fn) { // @TODO commit "fixing overwrite iteratee issue"
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

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
export function _template (text, settings, oldSettings) {
	if (!settings && oldSettings) settings = oldSettings;
	settings = _defaults({}, settings, _template.settings);

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
			source += "'+\n((__t=(" + escape + "))==null?'':(typeof _escape == 'function')?_escape(__t):_.escape(__t))+\n'";
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
// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
_template.settings = {
	evaluate: /<%([\s\S]+?)%>/g,
	interpolate: /<%=([\s\S]+?)%>/g,
	escape: /<%-([\s\S]+?)%>/g
};