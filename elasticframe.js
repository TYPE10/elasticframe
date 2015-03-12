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
    function getDocHeight() {
        var de = document.documentElement,
            bd = document.body;
        return Math.max(
            bd.scrollHeight, de.scrollHeight,
            bd.offsetHeight, de.offsetHeight,
            bd.clientHeight, de.clientHeight
        );
    }

    function sendIframeHeight() {
        var height = getDocHeight();

        if (window.parent && window.parent.postMessage) {
            window.parent.postMessage(JSON.stringify({ type: 'elasticframe', height: height }), '*');
        }
    }

    function setIframeHeight(ev, id) {
        var data;
        try {
            data = JSON.parse(ev.data);
        } catch(e) {}

        if (typeof data === 'object' && data.type === 'elasticframe' && data.height) {
            document.getElementById(id).style.height = data.height + 'px';
        }
    }

    function initParent(id) {
        if (window.addEventListener) {
            window.addEventListener('message', function(ev) {
                setIframeHeight(ev, id);
            });
        } else {
            window.attachEvent('onmessage', function(ev) {
                setIframeHeight(ev, id);
            });
        }
    }

    function initIframe() {
        if (window.addEventListener) {
            window.addEventListener('load',   sendIframeHeight);
            window.addEventListener('resize', sendIframeHeight);
        } else {
            window.attachEvent('onload',   sendIframeHeight);
            window.attachEvent('onresize', sendIframeHeight);
        }
    }

    return {
        initParent: initParent,
        initIframe: initIframe
    };
}));
