// `_uniqueId` : an utility's function
// ------------------------------------

// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
let idCounter = 0;
export default function (prefix) {
	let id = ++idCounter + '';
	return prefix ? prefix + id : id;
}