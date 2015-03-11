/*!
 * elasticframe v0.0.1
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
    function sendIframeHeight() {
        var height = Math.min(document.documentElement.scrollHeight, document.documentElement.offsetHeight);

        if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({ type: 'elasticframe', height: height }, '*');
        }
    }

    function setIframeHeight(ev, id) {
        if (ev && typeof ev.data === 'object' && ev.data.type === 'elasticframe' && ev.data.height) {
            document.getElementById(id).style.height = ev.data.height + 'px';
        }
    }

    function initParent(id) {
        window.addEventListener('message', function(ev) {
            setIframeHeight(ev, id);
        });
    }

    function initIframe() {
        window.addEventListener('load',   sendIframeHeight);
        window.addEventListener('resize', sendIframeHeight);
    }

    return {
        initParent: initParent,
        initIframe: initIframe
    };
}));
