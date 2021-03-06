# ElasticFrame [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
> Make your iframe(s) resize automatically. Cross-domain. Dependency-free.

Same-origin policy prevents reading an iframe's document height from the host page.
ElasticFrame makes your iframe talk to the host page about its actual document height whenever it changes.
The host will then update the iframe height accordingly to avoid scrollbars.


## Features

- Cross-domain
- Light-weight
- CommonJS, AMD & browser global
- This involves including a light-weight script into both the host and the iframe page.


## Setup

Add this to the iframe content page:

```html
<script src="elasticframe.js"></script>
<script>
  ElasticFrame.initIframe();
</script>
```

Then add this to the host page containing the iframe:

```html
<script src="elasticframe.js"></script>
<script>
  ElasticFrame.initParent(HTMLIFrameElement);
</script>
```

For situations where manual resizing is necessary:

```js
var eframe = ElasticFrame.initParent(HTMLIFrameElement);
eframe.resize();
```
```js
var eframe = ElasticFrame.initIframe();
eframe.resize();
```


## Browser compatibility

IE8+, Firefox, Chrome, Safari, Opera


## Contributors:

https://github.com/TYPE10/elasticframe/contributors


## License

Copyright &copy; 2016 [TYPE10 Media](https://github.com/type10)

Licensed under the [MIT license](http://opensource.org/licenses/MIT).


[npm-image]: https://img.shields.io/npm/v/elasticframe.svg
[npm-url]: https://npmjs.org/package/elasticframe
[travis-image]: https://img.shields.io/travis/TYPE10/elasticframe.svg
[travis-url]: https://travis-ci.org/TYPE10/elasticframe
