// quick reference variables for speed access
//-------------------------------------------

// Save bytes in the minified (but not gzipped) version:
export var ArrayProto = Array.prototype;
export var ObjProto = Object.prototype;
export var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
export var push = ArrayProto.push;
export var slice = ArrayProto.slice;
export var toString = ObjProto.toString;
export var hasOwnProperty = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
export var nativeIsArray = Array.isArray;
export var nativeKeys = Object.keys;
export var nativeCreate = Object.create;

// Naked function reference for surrogate-prototype-swapping.
export var Ctor = function () {};