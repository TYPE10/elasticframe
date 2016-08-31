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

    function getDocHeight() {
        var de = document.documentElement,
            bd = document.body;
        return Math.max(
            bd.scrollHeight, de.scrollHeight,
            bd.offsetHeight, de.offsetHeight,
            bd.clientHeight, de.clientHeight
        );
    }

    function listen(target, event, callback) {
        if (target.addEventListener) {
            target.addEventListener(event, callback);
        } else {
            target.attachEvent('on' + event, callback);
        }
    }

    function unlisten(target, event, callback) {
        if (target.removeEventListener) {
            target.removeEventListener(event, callback);
        } else {
            target.detachEvent('on' + event, callback);
        }
    }

    function sendContentHeight(id) {
        var height = getDocHeight();

        if (window.parent && window.parent.postMessage) {
            window.parent.postMessage(JSON.stringify({ type: 'elasticframe', code: 'content-height', id: id, height: height }), '*');
        }
    }

    function sendIframeID(iframe) {
        if (iframe.contentWindow.postMessage) {
            iframe.contentWindow.postMessage(JSON.stringify({ type: 'elasticframe', code: 'id', id: iframe.id }), '*');
        }
    }

    function sendIframeIDRequest() {
        if (window.parent && window.parent.postMessage) {
            window.parent.postMessage(JSON.stringify({ type: 'elasticframe', code: 'id-request' }), '*');
        }
    }

    function setIframeHeight(event) {
        var data = getData(event.data);
        if (data.code === 'content-height' && typeof data.id === 'string') {
            if (!isNaN(parseInt(data.height))) {
                document.getElementById(data.id).style.height = parseInt(data.height) + 'px';
            } else {
                // This should never happen
                document.getElementById(data.id).style.height = 'auto';
            }
        }
    }

    function resetIframeHeight(iframe) {
        iframe.style.height = '0px';
    }

    function initParent(id) {
        var iframe = document.getElementById(id);
        function init(event) {
            if (event.source === iframe.contentWindow && getData(event.data).code === 'id-request') {
                unlisten(window, 'message', init);
                listen(window, 'message', setIframeHeight);
                listen(window, 'resize', function() {
                    resetIframeHeight(iframe);
                });
                sendIframeID(iframe);
                resetIframeHeight(iframe);
            }
        }
        listen(window, 'message', init);
    }

    function initIframe() {
        var id;
        function init(event) {
            var data = getData(event.data);
            if (data.code === 'id' && typeof data.id === 'string') {
                id = data.id;
                unlisten(window, 'message', init);
                listen(window, 'load',   update);
                listen(window, 'resize', update);
                update();
            }
        }
        function update() {
            sendContentHeight(id);
        }
        sendIframeIDRequest();
        listen(window, 'message', init);
    }

    return {
        initParent: initParent,
        initIframe: initIframe
    };
}));
