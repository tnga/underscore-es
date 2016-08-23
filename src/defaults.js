// `_defaults` : an object's function
// -----------------------------------

import _allKeys from './allKeys';
import {createAssigner} from './_internal';

// Fill in a given object with default properties.
var _defaults = createAssigner(_allKeys, true);

export {_defaults as default};