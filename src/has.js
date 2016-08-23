// `_has` : an object's function
// ------------------------------

import {hasOwnProperty} from './_quickaccess';

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
export default function (obj, key) {
	return obj != null && hasOwnProperty.call(obj, key);
}