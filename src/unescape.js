// `_unescape` : an utility's function
// ------------------------------------

import {createEscaper, unescapeMap} from './_internal';

// Functions for unescaping strings to/from HTML interpolation.
var _unescape = createEscaper(unescapeMap);

export {_unescape as default};