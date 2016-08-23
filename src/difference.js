// `_difference` : an array's function
// ------------------------------------

import _filter from './filter';
import _contains from './contains';
import {restArgs, flatten} from './_internal';

// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
export var _difference = restArgs( (array, rest) => {
	rest = flatten(rest, true, true);
	return _filter(array, (value) =>  {
		return !_contains(rest, value);
	});
});

export {_difference as default};