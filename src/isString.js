// `_isString` : an object's function
// -----------------------------------

// Is a given value a string?
export default function (obj) {
	return toString.call(obj) === '[object String]';
}