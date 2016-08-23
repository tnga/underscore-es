// `_clone` : an object's function
// --------------------------------

import _isObject from './isObject';
import _isArray from './isArray';
import _extend from './extend';

// Create a (shallow-cloned) duplicate of an object.
export default function (obj) {
	if (!_isObject(obj)) return obj;
	return _isArray(obj) ? obj.slice() : _extend({}, obj);
}