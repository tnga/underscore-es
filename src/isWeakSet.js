// `_isWeakSet` : an object's function
// ------------------------------------

// Is a given value a weak-set?
export default function (obj) {
	return toString.call(obj) === '[object WeakSet]';
}