// `_isDate` : an object's function
// ---------------------------------

// Is a given value a date?
export default function (obj) {
	return toString.call(obj) === '[object Date]';
}