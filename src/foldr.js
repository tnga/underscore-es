// `_foldr` : a collection's function
// -----------------------------------

import {createReduce} from './_internal';

// The right-associative version of reduce, also known as `foldr`
var _foldr = createReduce(-1);

export {_foldr as default};