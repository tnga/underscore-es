// `_create` : an object's function
// ---------------------------------

import _extendOwn from './extendOwn';
import {baseCreate} from './_internal';

// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
export default function (prototype, props) {
	var result = baseCreate(prototype);
	if (props) _extendOwn(result, props);
	return result;
}