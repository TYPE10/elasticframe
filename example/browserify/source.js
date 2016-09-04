'use strict';
var ElasticFrame = require('../../elasticframe');
ElasticFrame.initParent( document.querySelector('iframe#bigFrame') );
ElasticFrame.initParent( document.getElementById('smallFrame') );
ElasticFrame.initParent( document.getElementById('manualFrame1') );

var manualFrame2 = document.getElementById('manualFrame2');
var eframe = ElasticFrame.initParent(manualFrame2);
setTimeout(function() {
  manualFrame2.style.display = 'block';
  eframe.resize();
}, 100);
