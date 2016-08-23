// `_propertyOf` : an utility's function
// --------------------------------------

// Generates a function for a given object that returns a given property.
export default function (obj) {
	return obj == null ? () => {} : (key) => obj[key];
}