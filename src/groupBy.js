// `_groupBy` : a collection's function
// -------------------------------------

import _has from './has';
import {group} from './_internal';

// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
var _groupBy = group( (result, value, key) => {
	if (_has(result, key)) result[key].push(value);
	else result[key] = [value];
});

export {_groupBy as default};