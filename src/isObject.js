// `_isObject` : an object's function
// -----------------------------------

// Is a given variable an object?
export default function (obj) {
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
}