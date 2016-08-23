// `_sample` : a collection's function
// ------------------------------------

import _values from './values';
import _random from './random';
import _clone from './clone';
import {getLength, isArrayLike} from './_internal';

// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `map`.
export default function (obj, n, guard) {
	if (n == null || guard) {
		if (!isArrayLike(obj)) obj = _values(obj);
		return obj[_random(obj.length - 1)];
	}
	let levy = isArrayLike(obj) ? _clone(obj) : _values(obj);
	let length = getLength(levy);
	n = Math.max(Math.min(n, length), 0);
	let last = length - 1;
	for (let index = 0; index < n; index++) {
		let rand = _random(index, last);
		let temp = levy[index];
		levy[index] = levy[rand];
		levy[rand] = temp;
	}
	return levy.slice(0, n);
}