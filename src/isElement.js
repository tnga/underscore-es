// `_isElement` : an object's function
// ------------------------------------

import _isString from './isString';
import _indexOf from './indexOf';
import {toString} from './_quickaccess';

// Is a given value a DOM element?
export default function (obj, eltName) {
	var isInstanceOk = _isString(eltName) ? _indexOf(['HTML', 'SVG'], eltName) != -1 ? toString.call(obj).indexOf('[object ' + eltName) != -1 : toString.call(obj) === '[object ' + eltName + 'Element]' : true;
	return !!(obj && obj.nodeType === 1 && isInstanceOk);
}