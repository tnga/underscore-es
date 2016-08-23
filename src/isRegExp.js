// `_isRegExp` : an object's function
// -----------------------------------

// Is a given value a regular expression?
export default function (obj) {
	return toString.call(obj) === '[object RegExp]';
}