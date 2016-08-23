// `_isBoolean` : an object's function
// ------------------------------------

// Is a given value a boolean?
export default function (obj) {
	return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}