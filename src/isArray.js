// `_isArray` : an object's function
// ----------------------------------

import {nativeIsArray} from './_quickaccess';

// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
export var _isArray = nativeIsArray || function (obj) {
	return toString.call(obj) === '[object Array]';
}

export {_isArray as default};