// `_escape` : an utility's function
// ----------------------------------

import {createEscaper, escapeMap} from './_internal';

// Functions for escaping strings to/from HTML interpolation.
var _escape = createEscaper(escapeMap);

export {_escape as default};