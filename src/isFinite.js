// `_isFinite` : an object's function
// -----------------------------------

import _isSymbol from './isSymbol';

// Is a given object a finite number?
export default function (obj) {
	return !_isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
}