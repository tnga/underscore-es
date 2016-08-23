// `_countBy` : a collection's function
// -------------------------------------

import _has from './has';
import {group} from './_internal';

// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
var _countBy = group( (result, value, key) => {
	if (_has(result, key)) result[key]++;
	else result[key] = 1;
});

export {_countBy as default}; 