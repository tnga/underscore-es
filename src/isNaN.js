// `_isNaN` : an object's function
// --------------------------------

import _isNumber from './isNumber';

// Is the given value `NaN`?
export default function (obj) {
	return _isNumber(obj) && isNaN(obj);
}