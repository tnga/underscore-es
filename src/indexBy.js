// `_indexBy` : a collection's function
// ------------------------------------

import {group} from './_internal';

// Indexes the object's values by a criterion, similar to `groupBy`, but for
// when you know that your index values will be unique.
var _indexBy = group( (result, value, key) => {
	result[key] = value;
});

export {_indexBy as default};