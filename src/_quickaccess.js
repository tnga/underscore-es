// quick reference variables for speed access
//-------------------------------------------

// Save bytes in the minified (but not gzipped) version:
export const ArrayProto = Array.prototype;
export const ObjProto = Object.prototype;
export const SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
export const push = ArrayProto.push;
export const slice = ArrayProto.slice;
export const toString = ObjProto.toString;
export const hasOwnProperty = ObjProto.hasOwnProperty;

// All **ECMAScript 5** native function implementations that we hope to use
// are declared here.
export const nativeIsArray = Array.isArray;
export const nativeKeys = Object.keys;
export const nativeCreate = Object.create;

// Naked function reference for surrogate-prototype-swapping.
export const Ctor = function () {};