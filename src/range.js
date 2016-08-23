// `_range` : an array's function
// -------------------------------

// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](http://docs.python.org/library/functions.html#range).
export default function (start, stop, step) {
	if (stop == null) {
		stop = start || 0;
		start = 0;
	}
	if (!step) {
		step = stop < start ? -1 : 1;
	}
	let length = Math.max(Math.ceil((stop - start) / step), 0);
	let range = Array(length);
	for (let idx = 0; idx < length; idx++, start += step) {
		range[idx] = start;
	}
	return range;
}