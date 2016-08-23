// `_isNumber` : an object's function
// -----------------------------------

// Is a given value a number?
export default function (obj) {
	return toString.call(obj) === '[object Number]';
}