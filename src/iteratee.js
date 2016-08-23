// `_iteratee` : an utility's function
// ------------------------------------

import _isFunction from './isFunction';
import {builtinIteratee} from './_internal';

// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only argCount argument.
var _iteratee = builtinIteratee;

export function _setIteratee (fn) {
	_iteratee = _isFunction(fn) ? fn : builtinIteratee;
}
export {_iteratee as default};