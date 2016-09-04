(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*!
 * elasticframe
 * https://github.com/kwizzn/elasticframe
 * Copyright (c) 2015 Chris Neuhäuser, TYPE10 Media GmbH
 * Licensed under the MIT License
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory();
    } else {
        window.ElasticFrame = factory(); // jshint ignore:line
    }

}(function() {
    //var idCount = 0;
    //var parentID;

    // https://github.com/Modernizr/Modernizr/issues/1894#issuecomment-200691178
    var supportsEventOptions = false;
    try {
      document.addEventListener('test', null, { get passive() { supportsEventOptions = true }});
    } catch(e) {}

    function cancelAnimationFrame(id) {
        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(id);
        } else {
            clearTimeout(id);
        }
    }

    function requestAnimationFrame(callback) {
        if (window.requestAnimationFrame) {
            return window.requestAnimationFrame(callback);
        } else {
            return setTimeout(callback, 16.66);  // 60fps
        }
    }

    /*function debounce(callback) {
        var delay;
        return function() {
            var args = arguments;
            var thisObj = this;
            cancelAnimationFrame(delay);
            delay = requestAnimationFrame(function() {
                callback.apply(thisObj, args);
            });
        };
    }*/

    function getData(json) {
        var data;
        try {
            data = JSON.parse(json);
        } catch(e) {}

        if (data !== null && typeof data === 'object' && data.type === 'elasticframe') {
            return data;
        }
        return {};
    }

    function listen(event, handler, options) {
        if (window.addEventListener) {
            if (!supportsEventOptions && options !== null && typeof options === 'object') options = options.capture;
            window.addEventListener(event, handler, options);
        } else {
            window.attachEvent('on' + event, handler);
        }
    }

    // TODO :: wrap in requestAnimationFrame ?
    function sendHeight() {
        var de = document.documentElement;
        var bd = document.body;
        var height = Math.max(
            bd.scrollHeight, de.scrollHeight,
            bd.offsetHeight, de.offsetHeight,
            bd.clientHeight, de.clientHeight
        );
        window.parent.postMessage(JSON.stringify({ type: 'elasticframe', code: 'height', height: height }), '*');
    }

    function sendHeightRequest(iframe) {
        iframe.contentWindow.postMessage(JSON.stringify({ type: 'elasticframe', code: 'height-request', id: iframe.id }), '*');
    }

    function sendResetRequest() {
         window.parent.postMessage(JSON.stringify({ type: 'elasticframe', code: 'reset-request' }), '*');
    }

    function setHeight(iframe, height) {
        if (!isNaN(height)) {
            console.log(height)
            iframe.style.height = height + 'px';
        } else {
            // This should never happen
            console.log("auto")
            iframe.style.height = 'auto';
        }
    }

    function resetHeight(iframe) {
        iframe.style.height = '0px';
    }

    function initParent(iframe) {
        var heightDelay,resetDelay,resizeDelay;
        if (!iframe.contentWindow.postMessage) return;
        //if (iframe.id === '') iframe.id = 'elasticframe' + (idCount++);
        function resizeIframe() {
            cancelAnimationFrame(heightDelay);
            cancelAnimationFrame(resetDelay);
            cancelAnimationFrame(resizeDelay);
            resizeDelay = requestAnimationFrame(function() {
                console.log("page resizeIframe ("+iframe.id+")")
                resetHeight(iframe);
                sendHeightRequest(iframe);
            });
        }
        listen('message', function(event) {
            var data;
            if (event.source === iframe.contentWindow) {
                data = getData(event.data);
                switch (data.code) {
                    case 'height': {
                        console.log("parent height ("+iframe.id+")")
                        cancelAnimationFrame(heightDelay);
                        heightDelay = requestAnimationFrame(function() {
                            setHeight(iframe, parseInt(data.height));
                        });
                        break;
                    }
                    case 'reset-request': {
                        console.log("parent reset-request ("+iframe.id+")")
                        cancelAnimationFrame(resetDelay);
                        resetDelay = requestAnimationFrame(function() {
                            resetHeight(iframe);
                            sendHeightRequest(iframe);
                        });
                        break;
                    }
                }
            }
        }, { passive: true });
        listen('resize', function(event) {
            console.log("page resize ("+iframe.id+")")
            resizeIframe();
        }, { passive: true });
        return { resize: resizeIframe };
    }

    function initIframe() {
        if (!window.parent || !window.parent.postMessage) return;
        listen('message', function(event) {
            var data = getData(event.data);
            if (data.code === 'height-request') {
                console.log("iframe height-request ("+data.id+")")
                if (document.readyState === 'complete') {
                    sendHeight(data.id);
                } else {
                    listen('load', function() {
                        console.log("iframe load ("+data.id+")")
                        sendHeight(data.id);
                    }, { once: true, passive: true }); 
                }
            }
        }, { passive: true });
        sendResetRequest();
        return { resize: sendResetRequest };
    }

    return {
        initParent: initParent,
        initIframe: initIframe
    };
}));

},{}],2:[function(require,module,exports){
'use strict';
var ElasticFrame = require('../../../elasticframe');
var eframe = ElasticFrame.initIframe();
setTimeout(function() {
  var container = document.getElementById('container');
  for (var i=0; i<5; i++) {
    container.innerHTML += ' ' + container.innerHTML;
  }
  eframe.resize();
}, 100);

},{"../../../elasticframe":1}]},{},[2]);
