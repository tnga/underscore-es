// `_isEqual` : an object's function
// ----------------------------------

import {eq} from './_internal';

// Perform a deep comparison to check if two objects are equal.
export default function (a, b) {
	return eq(a, b);
}