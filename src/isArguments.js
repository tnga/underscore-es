// `_isArguments` : an object's function
// --------------------------------------

import {customArguments} from './_internal';

// Is a given value an arguments object?
var _isArguments = customArguments() || function (obj) {
	return toString.call(obj) === '[object Arguments]';
}

export {_isArguments as default};