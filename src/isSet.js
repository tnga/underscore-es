// `_isSet` : an object's function
// --------------------------------

// Is a given value a set?
export default function (obj) {
	return toString.call(obj) === '[object Set]';
}