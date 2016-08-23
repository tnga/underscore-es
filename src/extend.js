// `_extend` : an object's function
// ---------------------------------

import _allKeys from './allKeys';
import {createAssigner} from './_internal';

// Extend a given object with all the properties in passed-in object(s).
var _extend = createAssigner(_allKeys);

export {_extend as default};