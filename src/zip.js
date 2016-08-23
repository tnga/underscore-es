// `_zip` : an array's function
// -----------------------------

import _unzip from './unzip';
import {restArgs} from './_internal';

// Zip together multiple lists into a single array -- elements that share
// an index go together.
var _zip = restArgs(_unzip);

export {_zip as default};