// `_template` : an utility's function
// ------------------------------------

import _defaults from './defaults';
import _escape from './escape';
import _ from './_base';
import {noMatch, escapeRegExp, escapeChar} from './_internal';

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
function _template (text, settings, oldSettings) {
	if (!settings && oldSettings) settings = oldSettings;
	settings = _defaults({}, settings, _template.settings);

	// Combine delimiters into one regular expression via alternation.
	let matcher = RegExp([
		(settings.escape || noMatch).source,
		(settings.interpolate || noMatch).source,
		(settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

	// Compile the template source, escaping string literals appropriately.
	let index = 0;
	let source = "__p+='";
	text.replace(matcher, (match, escape, interpolate, evaluate, offset) => {
		source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
		index = offset + match.length;

		if (escape) {
			source += "'+\n((__t=(" + escape + "))==null?'':(typeof _escape == 'function')?_escape(__t):_.escape(__t))+\n'";
		} else if (interpolate) {
			source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
		} else if (evaluate) {
			source += "';\n" + evaluate + "\n__p+='";
		}

		// Adobe VMs need the match returned to produce the correct offset.
		return match;
	});
	source += "';\n";

	// If a variable is not specified, place data values in local scope.
	if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	source = "var __t,__p='',__j=Array.prototype.join," +
		"print=function(){__p+=__j.call(arguments,'');};\n" +
		source + 'return __p;\n';

	let render;
	try {
		render = new Function(settings.variable || 'obj', '_', source);
	} catch (e) {
		e.source = source;
		throw e;
	}

	let template = function (data) {
		return render.call(this, data, _);
	};

	// Provide the compiled source as a convenience for precompilation.
	let argument = settings.variable || 'obj';
	template.source = 'function(' + argument + '){\n' + source + '}';

	return template;
}
// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
_template.settings = {
	evaluate: /<%([\s\S]+?)%>/g,
	interpolate: /<%=([\s\S]+?)%>/g,
	escape: /<%-([\s\S]+?)%>/g
};

export {_template as default};