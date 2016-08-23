// `_isElement` : an object's function
// ------------------------------------

// Is a given value a DOM element?
export default function (obj) {
	return !!(obj && obj.nodeType === 1);
}