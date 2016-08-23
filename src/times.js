// `_times` : an utility's function
// ---------------------------------

import {optimizeCb} from './_internal';

// Run a function **n** times.
export default function (n, iteratee, context) {
	let accum = Array(Math.max(0, n));
	iteratee = optimizeCb(iteratee, context, 1);
	for (let i = 0; i < n; i++) accum[i] = iteratee(i);
	return accum;
}