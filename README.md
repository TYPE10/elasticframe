ElasticFrame - Make your iframe(s) resize automatically. Cross-domain. Dependency-free.
---------------------------------------------------------------------------------------

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

    <script src="elasticframe.js"></script>
    <script>
      ElasticFrame.initIframe();
    </script>

Then add this to the host page containing the iframe:

    <script src="elasticframe.js"></script>
    <script>
      ElasticFrame.initParent(HTMLIFrameElement);
    </script>


## Browser compatibility

IE8+, Firefox, Chrome, Safari, Opera


## License

Copyright &copy; 2016 [Chris Neuhaeuser](https://github.com/kwizzn), [TYPE10 Media](https://github.com/type10)
Licensed under the [MIT license](http://opensource.org/licenses/MIT).
