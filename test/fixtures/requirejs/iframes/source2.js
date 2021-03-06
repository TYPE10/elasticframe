'use strict';

require(['./../../../../elasticframe'], function(ElasticFrame) {
  var eframe = ElasticFrame.initIframe();
  setTimeout(function() {
    var container = document.getElementById('container');
    for (var i=0; i<5; i++) {
      container.innerHTML += ' ' + container.innerHTML;
    }
    eframe.resize();
  }, 100);
});
