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

- partial importation of features (just import what you need, with a name that suits you).

 ```js
import _template from 'underscore-es/template';

 var basicTemplate = _template("Ok, i use <%= builder %> for my es6 and beyond stuff !");
 var result = basicTemplate({builder: 'rollup'});
 console.log( result ); 
 // => "Ok, i use rollup for my es6 and beyond stuff !"
 ```
 *__nb__: only `_chain` isn't available in this case.* <br/> 
 *another way to use chaining feature here is through `_compose` or `_use`.*
 ```js
 import _use from 'underscore-es/use';
 import _initial from 'underscore-es/initial';
 import _filter from 'underscore-es/filter';
 import _union from 'underscore-es/union';
 import _last from 'underscore-es/last';

 function note (num) {return 'result: '+ (num + 10) + " / 20"}
 var test = _use([1, 2, 3, 6, 9])
           .do(_union, [1, 3, 11], [2, 6])
           .do([], Array.prototype.concat, [10, 14]) // or simply .do([], [].concat, [10, 14])
           .do(_filter, (num) => num % 2 == 0)
           .do(_initial)
           .do(_last)
           .do(note)
           .value();
 console.log( test );
 // => result: 20 / 20
 ```
 
 *import features depending of their category*
 ```js
 import * as $co from 'underscore-es/_collections';
 import * as $ar from 'underscore-es/_arrays';
 import * as $ob from 'underscore-es/_objects';
 import * as $fu from 'underscore-es/_functions';
 import * as $ut from 'underscore-es/_utilities';
 
 console.log( $ar._union([4,7], [7,0,3]) );
 // => [4, 7, 0, 3]
 ```
 
- global importation of all features

 ```js
 import _ from 'underscore-es'; // or from 'underscore-es/_namespace'
 
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
 // => <ul><li>Moe</li><li>Larry</li><li>Curly</li></ul>
 ```
 *the `_.iteratee` shall now (for global importation) be overwritten through `_.setIteratee([fn])` method*
 ```js
 import _iteratee, {_setIteratee} from './underscore-es/iteratee';
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
 // => {0: 1, 1: 1, 2: 1}
 console.log(_filter(collection, /b/g))
 // => ['bar', 'bbiz']
 ```
 
[Documentation](https://tnga.github.io/underscore-es) is the place to find what you need to know !

This project adheres to a [code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.


For support and questions, please use
[the gitter channel](https://gitter.im/jashkenas/underscore)
or [stackoverflow](http://stackoverflow.com/search?q=underscore.js)

Underscore is an open-sourced component of DocumentCloud:
https://github.com/documentcloud

Many thanks to our contributors:
https://github.com/tnga/underscore-es/contributors
https://github.com/jashkenas/underscore/contributors
