'use strict';

require(['./../../elasticframe'], function(ElasticFrame) {
  ElasticFrame.initParent( document.getElementById('bigFrame') );
  ElasticFrame.initParent( document.querySelector('iframe#smallFrame') );
});
