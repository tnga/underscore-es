// `_isMap` : an object's function
// ---------------------------------

import {toString} from './_quickaccess';

// Is a given value a map?
export default function (obj) {
	return toString.call(obj) === '[object Map]';
}