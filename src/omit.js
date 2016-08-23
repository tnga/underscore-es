// `_omit` : an object's function
// -------------------------------

import _isFunction from './isFunction';
import _contains from './contains';
import _negate from './negate';
import _map from './map';
import _pick from './pick';
import {restArgs, flatten} from './_internal';

// Return a copy of the object without the blacklisted properties.
var _omit = restArgs( (obj, keys) => {
	let iteratee = keys[0],
		context;
	if (_isFunction(iteratee)) {
		iteratee = _negate(iteratee);
		if (keys.length > 1) context = keys[1];
	} else {
		keys = _map(flatten(keys, false, false), String);
		iteratee = (value, key) => !_contains(keys, key);
	}
	return _pick(obj, iteratee, context);
});

export {_omit as default};