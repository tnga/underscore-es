// `_pluck` : a collection's function
// ------------------------------------

import _map from './map';
import _property from './property';

// Convenience version of a common use case of `map`: fetching a property.
export default function (obj, key) {
	return _map(obj, _property(key));
}