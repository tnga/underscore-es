// `_use` : (ahem) a function's function
// ---------------------------------------

import _identity from './identity';
import _drop from './drop';

// function for chaining intermediate results.
// it return an object that has a method `do`,
// which can be use to pipe current result to others functions.
// method `value` can be used to get the "final result".
export default function (obj) {
	let chainObj = function () {
		let value = obj;
		this.do = function () {
			let args = arguments;
			let func = args.length > 0 ? args[0] : _identity;
			args = _drop(args);
			args.unshift(value);
			value = func.apply(this, args);
			return this;
		};
		this.value = () => value;
		return this;
	}
	
	return new chainObj();
}