// `_isError` : an object's function
// ----------------------------------

import {toString} from './_quickaccess';

// Is a given value an error?
export default function (obj) {
	return toString.call(obj) === '[object Error]';
}