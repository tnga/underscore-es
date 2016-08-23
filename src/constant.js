// `_constant` : an utility's function
// ------------------------------------

// Predicate-generating functions. Often useful outside of Underscore.
export default function (value) {
	return function () {
		return value;
	};
}