// `_compose` : (ahem) a function's function
// ------------------------------------------

// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
export default function () {
  let args = arguments;
  let start = args.length - 1;
  return function () {
    let i = start;
    let result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}