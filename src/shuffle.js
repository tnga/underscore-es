// `_shuffle` : a collection's function
// -------------------------------------

import _sample from './sample';

// Shuffle a collection.
export default function (obj) {
	return _sample(obj, Infinity);
}