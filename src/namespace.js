import {ArrayProto, push} from './_quickaccess';
import * as collectionTools from './_collections';
import * as arrayTools from './_arrays';
import * as objectTools from './_objects';
import * as functionTools from './_functions';
import * as utilityTools from './_utilities';
import __ from './_base';

// Baseline setup
// --------------
var _ = __;
// will help to add underscore's natives functions to the Underscore object.
// each native function start with _ so it will be removed 
// because the gold is to have `_[.function]` not `_[._function]`
let natifyMixin = function (obj) {
	collectionTools._each( objectTools._functions(obj), (name) => {
		_[name.slice(1)] = obj[name];
	});
	return _;
};
// Add underscore's natives functions to the Underscore object.
natifyMixin( collectionTools );
natifyMixin( arrayTools );
natifyMixin( objectTools );
natifyMixin( functionTools );
natifyMixin( utilityTools );

// Add a "chain" function. Start chaining a wrapped Underscore object.
_.chain = function (obj) {
	let instance = _(obj);
	instance._chain = true;
	return instance;
};

// OOP
// ---------------
// If Underscore is called as a function, it returns a wrapped object that
// can be used OO-style. This wrapper holds altered versions of all the
// underscore functions. Wrapped objects may be chained.

// Helper function to continue chaining intermediate results.
var chainResult = (instance, obj) => instance._chain ? _(obj).chain() : obj;

// Add your own custom functions to the Underscore object.
_.mixin = function (obj) {
	_.each(_.functions(obj), (name) => {
		let func = _[name] = obj[name];
		_.prototype[name] = function () {
			let args = [this._wrapped];
			push.apply(args, arguments);
			return chainResult(this, func.apply(_, args));
		};
	});
	return _;
};

// Add all of the Underscore functions to the wrapper object.
_.mixin(_);

// Add all mutator Array functions to the wrapper.
_.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], (name) => {
	var method = Array.prototype[name];
	_.prototype[name] = function () {
		var obj = this._wrapped;
		method.apply(obj, arguments);
		if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
		return chainResult(this, obj);
	};
});

// Add all accessor Array functions to the wrapper.
_.each(['concat', 'join', 'slice'], (name) => {
	var method = Array.prototype[name];
	_.prototype[name] = function () {
		return chainResult(this, method.apply(this._wrapped, arguments));
	};
});

// Extracts the result from a wrapped and chained object.
_.prototype.value = function () {
	return this._wrapped;
};

// Provide unwrapping proxy for some methods used in engine operations
// such as arithmetic and JSON stringification.
_.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
// Provide toString
_.prototype.toString = function () {
	return String(this._wrapped);
};


// Create a safe reference to the Underscore object for use below.
export {_ as default};