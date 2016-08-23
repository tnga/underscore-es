import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/_namespace.js',
	sourceMap: true,
	moduleName: '_',
	format: 'umd',
	plugins: [babel()],
	dest: 'underscore.js',
	banner: '//     Underscore.js 1.8.3 \n' +
					'//     http://underscorejs.org \n' +
					'//     (c) 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors \n' +
					'//     Underscore may be freely distributed under the MIT license.\n'
};