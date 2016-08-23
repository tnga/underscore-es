// `_tap` : an object's function
// ---------------------------------

// Invokes interceptor with the obj, and then returns obj.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
export default function (obj, interceptor) {
	interceptor(obj);
	return obj;
}