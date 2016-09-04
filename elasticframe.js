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
            iframe.style.height = height + 'px';
        } else {
            // This should never happen
            iframe.style.height = 'auto';
        }
    }

    function resetHeight(iframe) {
        iframe.style.height = '0px';
    }

    function initParent(iframe) {
        var heightDelay,resetDelay,resizeDelay;
        if (!iframe.contentWindow.postMessage) return;
        listen('message', function(event) {
            var data;
            if (event.source === iframe.contentWindow) {
                data = getData(event.data);
                switch (data.code) {
                    case 'height': {
                        cancelAnimationFrame(heightDelay);
                        heightDelay = requestAnimationFrame(function() {
                            setHeight(iframe, parseInt(data.height));
                        });
                        break;
                    }
                    case 'reset-request': {
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
            cancelAnimationFrame(heightDelay);
            cancelAnimationFrame(resetDelay);
            cancelAnimationFrame(resizeDelay);
            resizeDelay = requestAnimationFrame(function() {
                resetHeight(iframe);
                sendHeightRequest(iframe);
            });
        }, { passive: true });
    }

    function initIframe() {
        if (!window.parent || !window.parent.postMessage) return;
        listen('message', function(event) {
            var data = getData(event.data);
            if (data.code === 'height-request') {
                if (document.readyState === 'complete') {
                    sendHeight(data.id);
                } else {
                    listen('load', function() {
                        sendHeight(data.id);
                    }, { once: true, passive: true }); 
                }
            }
        }, { passive: true });
        sendResetRequest();
    }

    return {
        initParent: initParent,
        initIframe: initIframe
    };
}));
