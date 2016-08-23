                       __
                      /\ \                                                         __
     __  __    ___    \_\ \     __   _ __   ____    ___    ___   _ __    __       /\_\    ____
    /\ \/\ \ /' _ `\  /'_  \  /'__`\/\  __\/ ,__\  / ___\ / __`\/\  __\/'__`\     \/\ \  /',__\
    \ \ \_\ \/\ \/\ \/\ \ \ \/\  __/\ \ \//\__, `\/\ \__//\ \ \ \ \ \//\  __/  __  \ \ \/\__, `\
     \ \____/\ \_\ \_\ \___,_\ \____\\ \_\\/\____/\ \____\ \____/\ \_\\ \____\/\_\ _\ \ \/\____/
      \/___/  \/_/\/_/\/__,_ /\/____/ \/_/ \/___/  \/____/\/___/  \/_/ \/____/\/_//\ \_\ \/___/
                                                                                  \ \____/
                                                                                   \/___/

Underscore.js is a utility-belt library for JavaScript that provides
support for the usual functional suspects (each, map, reduce, filter...)
without extending any core JavaScript objects. 
**It's available in _ES6_ and _UMD_ (_cjs_, _amd_, _iife_) formats**

**ES6 & Beyond usage**:

- partial importation of features (just call the function's name prefixed by `_`).

 (*__nb__: only `_chain` isn't available in this case*)

 ```js
import _template from 'underscore-es/template';

 var basicTemplate = _template("Ok, i use <%= builder %> for my es6 and beyond stuff !");
 var result = basicTemplate({builder: 'rollup'});
 console.log( result ); 
 // => "Ok, i use rollup for my es6 and beyond stuff !"
 ```
- global importation of all features

 ```js
 import _ from 'underscore-es';
 
 _.chain([4,7])
  .union([7,0,3])
  .initial()
  .reverse()
  .head()
  .value()
  // => 0
 ```
- breaking changes

 Since this underscore source code has been rewritten to be more es6 friendly :
 
 *the `_.templateSettings` property is now `_.template.settings`*
 
 ```js
 import _template from 'underscore-es/template';
 
 _template.settings = {
    evaluate: /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g
 };

 var custom = _template('<ul>{{ for (var key in people) { }}<li>{{= people[key] }}</li>{{ } }}</ul>');
 var result = custom({people: {moe: 'Moe', larry: 'Larry', curly: 'Curly'}});
 console.log( result );
 //=> <ul><li>Moe</li><li>Larry</li><li>Curly</li></ul>
 ```
 *the `_.iteratee` shall now (for global importation) be overwritten through `_.setIteratee([fn])` method*
 ```js
 import _iteratee from './underscore-es/iteratee';
 import _setIteratee from './underscore-es/iteratee';
 import _countBy from './underscore-es/countBy';
 import _isRegExp from './underscore-es/isRegExp';
 import _filter from './underscore-es/filter';
 
 _setIteratee( function(value) {
    // RegEx values return a function that returns the number of matches
    if (_isRegExp(value)) return function(obj) {
       return (obj.match(value) || []).length;
    };
    return value;
 });

 // test some methods that claim to be transformed through `_iteratee`
 var collection = ['foo', 'bar', 'bbiz'];
 console.log(_countBy(collection, /b/g))
 //=> {0: 1, 1: 1, 2: 1}
 console.log(_filter(collection, /b/g))
 //=> ['bar', 'bbiz']
 ```
 
[Documentation](https://tnga.github.io/underscore-es) is the place to find what you need to know !

This project adheres to a [code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

For Docs, License, Tests, and pre-packed downloads, see:
http://underscorejs.org

For support and questions, please use
[the gitter channel](https://gitter.im/jashkenas/underscore)
or [stackoverflow](http://stackoverflow.com/search?q=underscore.js)

Underscore is an open-sourced component of DocumentCloud:
https://github.com/documentcloud

Many thanks to our contributors:
https://github.com/jashkenas/underscore/contributors
