// `_isFunction` : an object's function
// -------------------------------------

import {customFunction} from './_internal';

// Is a given value a function?
var _isFunction = customFunction() || function (obj) {
	return toString.call(obj) === '[object Function]';
}

export {_isFunction as default};