// `_isSymbol` : an object's function
// -----------------------------------

import {toString} from './_quickaccess';

// Is a given value a symbol?
export default function (obj) {
	return toString.call(obj) === '[object Symbol]';
}