// `_extendOwn` : an object's function
// ------------------------------------

import _keys from './keys';
import {createAssigner} from './_internal';

// Extend a given object with the properties in passed-in object(s).
var _extendOwn = createAssigner(_keys);

export {_extendOwn as default};