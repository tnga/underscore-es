// `_without` : an array's function
// ---------------------------------

import _difference from './difference';
import {restArgs} from './_internal';

// Return a version of the array that does not contain the specified value(s).
var _without = restArgs( (array, otherArrays) => {
	return _difference(array, otherArrays);
});

export {_without as default};