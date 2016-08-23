// `_isWeakMap` : an object's function
// ------------------------------------

// Is a given value a weak-map?
export default function (obj) {
	return toString.call(obj) === '[object WeakMap]';
}