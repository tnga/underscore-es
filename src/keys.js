// `_keys` : an object's function
// -------------------------------

import _isObject from './isObject';
import _has from './has';
import {nativeKeys} from './_quickaccess';
import {hasEnumBug, collectNonEnumProps} from './_internal';

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
export default function (obj) {
	if (!_isObject(obj)) return [];
	if (nativeKeys) return nativeKeys(obj);
	let keys = [];
	for (let key in obj)
		if (_has(obj, key)) keys.push(key);
		// Ahem, IE < 9.
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
}