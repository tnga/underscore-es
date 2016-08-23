// `_invoke` : a collection's function
// ------------------------------------

import _isFunction from './isFunction';
import _map from './map';
import {restArgs} from './_internal';

// Invoke a method (with arguments) on every item in a collection.
var _invoke = restArgs( (obj, method, args) => {
	let isFunc = _isFunction(method);
	return _map(obj, (value) => {
		let func = isFunc ? method : value[method];
		return func == null ? func : func.apply(value, args);
	});
});

export {_invoke as default};