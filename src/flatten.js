// `_flatten` : an array's function
// ---------------------------------

import {flatten} from './_internal';

// Flatten out an array, either recursively (by default), or just one level.
export default function (array, shallow) {
	return flatten(array, shallow, false);
}