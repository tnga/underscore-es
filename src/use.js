// `_use` : (ahem) a function's function
// ---------------------------------------

import _isFunction from './isFunction.js';
import _identity from './identity';
import _drop from './drop';

// function for chaining intermediate results.
// it return an object that has a method `do`,
// which can be used to pipe current result to other functions.
// method `value` can be used to get the "final result".
export default function (obj) {
	let chainObj = function () {
		let value = obj;
		this.do = function () {
			let args = arguments;
			let context = args[0]; 
			if (!_isFunction(context)) args = _drop(args); else context = this;
			let func = args[0] || _identity;
			args = _drop(args);
			args.unshift(value);
			value = func.apply(context, args);
			return this;
		};
		this.value = () => value;
		return this;
	}
	
	return new chainObj();
}