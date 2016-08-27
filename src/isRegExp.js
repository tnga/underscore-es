// `_isRegExp` : an object's function
// -----------------------------------

import {toString} from './_quickaccess';

// Is a given value a regular expression?
export default function (obj) {
	return toString.call(obj) === '[object RegExp]';
}