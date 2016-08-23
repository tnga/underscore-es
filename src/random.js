// `_random` : an utility's function
// ----------------------------------

// Return a random integer between min and max (inclusive).
export default function (min, max) {
	if (max == null) {
		max = min;
		min = 0;
	}
	return min + Math.floor(Math.random() * (max - min + 1));
}