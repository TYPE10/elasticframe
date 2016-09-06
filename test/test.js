'use strict';
const expect = require('chai').use( require('chai-as-promised') ).expect;
const Nightmare = require('nightmare');
const resolvePath = require('path').resolve;

const browser = new Nightmare();

Nightmare.action('iframeHeight', function(selector, done) {
  this.evaluate_now(function(selector) {
    const element = document.querySelector(selector);
    return parseFloat( window.getComputedStyle(element,null).getPropertyValue('height') );
  }, done, selector);
});

function fixture(relativePath) {
  return browser
  .goto('file://' + resolvePath(__dirname + '/fixtures/' + relativePath))
  .then(result => expect(result.code).to.equal(200))
  .then(() => browser.wait(250));  // time for scripts to run
}

['Browserify','Global','RequireJS'].forEach(function(test) {
  eval(`
    describe('${test}', function() {
      before(() => fixture('${test.toLowerCase()}/index.html'));
      it('supports content taller than original iframe height', function() {
        return expect(browser.iframeHeight('#bigFrame')).to.eventually.equal(430);
      });
      it('supports content shorter than original iframe height', function() {
        return expect(browser.iframeHeight('#smallFrame')).to.eventually.equal(52);
      });
      it('supports manually resize from within iframe', function() {
        return expect(browser.iframeHeight('#manualFrame1')).to.eventually.equal(286);
      });
      it('supports manually resize from iframe parent', function() {
        return expect(browser.iframeHeight('#manualFrame2')).to.eventually.equal(52);
      });
    });
  `);
});
