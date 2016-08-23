// `_pick` : an object's function
// --------------------------------

import _isFunction from './isFunction';
import _allKeys from './allKeys';
import {restArgs, optimizeCb, flatten, keyInObj} from './_internal';

// Return a copy of the object only containing the whitelisted properties.
var _pick = restArgs( (obj, keys) => {
	let result = {},
		iteratee = keys[0];
	if (obj == null) return result;
	if (_isFunction(iteratee)) {
		if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
		keys = _allKeys(obj);
	} else {
		iteratee = keyInObj;
		keys = flatten(keys, false, false);
		obj = Object(obj);
	}
	for (let i = 0, length = keys.length; i < length; i++) {
		var key = keys[i];
		var value = obj[key];
		if (iteratee(value, key, obj)) result[key] = value;
	}
	return result;
});

export {_pick as default};