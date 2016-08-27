// `_isDate` : an object's function
// ---------------------------------

import {toString} from './_quickaccess';

// Is a given value a date?
export default function (obj) {
	return toString.call(obj) === '[object Date]';
}