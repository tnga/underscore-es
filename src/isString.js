// `_isString` : an object's function
// -----------------------------------

import {toString} from './_quickaccess';

// Is a given value a string?
export default function (obj) {
	return toString.call(obj) === '[object String]';
}