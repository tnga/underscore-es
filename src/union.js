// `_union` : an array's function
// -------------------------------

import _uniq from './uniq';
import {restArgs, flatten} from './_internal';

// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
export var _union = restArgs( (arrays) => {
	return _uniq(flatten(arrays, true, true));
});

export {_union as default};