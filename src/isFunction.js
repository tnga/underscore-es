// `_isFunction` : an object's function
// -------------------------------------

// Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
// IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
function customFunction() {
	if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof document !== 'undefined' && typeof document.childNodes != 'function') {
		return (obj) => typeof obj == 'function' || false;
	}
	return null;
}

// Is a given value a function?
var _isFunction = customFunction() || function (obj) {
	return toString.call(obj) === '[object Function]';
}

export {_isFunction as default};