// `_after` : (ahem) a function's function
// ----------------------------------------

// Returns a function that will only be executed on and after the Nth call.
export default function (times, func) {
  return function () {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}