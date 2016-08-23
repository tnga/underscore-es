// `_isMap` : an object's function
// ---------------------------------

// Is a given value a map?
export default function (obj) {
	return toString.call(obj) === '[object Map]';
}