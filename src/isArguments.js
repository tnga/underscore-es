// `_isArguments` : an object's function
// --------------------------------------

import _has from './has';
import {toString} from './_quickaccess';

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
function customArguments () {
	if (toString.call(arguments) === '[object Arguments]') return null;
	return (obj) => _has(obj, 'callee');
}

// Is a given value an arguments object?
var _isArguments = customArguments() || function (obj) {
	return toString.call(obj) === '[object Arguments]';
}

export {_isArguments as default};