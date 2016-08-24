// `_` : base namespace and constructor for underscore's object
// -------------------------------------------------------------

// Baseline setup
function _ (obj) {
	if (obj instanceof _) return obj;
	if (!(this instanceof _)) return new _(obj);
	this._wrapped = obj;
}
// Current version.
_.VERSION = '1.9.0';

export {_ as default}; // @important: exportation of the function, not only it definition