// `_negate` : (ahem) a function's function
// -----------------------------------------

// Returns a negated version of the passed-in predicate.
export default function (predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}