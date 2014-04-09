'use strict';

require('should');
var rename = require('..');

describe('rename', function() {

  it('string', function() {
    rename('a.js', 'b.js').should.eql('b.js');
    rename('a.js', '').should.eql('a.js');
  });

  it('function', function() {
    rename('a/b/c.js', function(path) {
      path.dirname += '/d';
      path.basename += '-debug';
      path.extname = '.css';
    }).should.eql('a/b/d/c-debug.css');

    rename('./a/b/c.js', function(path) {
      path.dirname += '/d';
      path.basename += '-debug';
      path.extname = '.css';
    }).should.eql('./a/b/d/c-debug.css');
  });

  it('object', function() {
    rename('a/b/c.js', {
      dirname: 'd/e',
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f'
    }).should.eql('d/e/pre-f-debug.css');

    rename('./a/b/c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f'
    }).should.eql('./a/b/pre-f-debug.css');

    rename('a/b/c.js', {
      dirname: null,
      extname: null,
      basename: null
    }).should.eql('');

    rename('a/b/c.js', {}).should.eql('a/b/c.js');
  });

  it('error', function() {
    shouldThrow(null);
    shouldThrow(undefined);
    shouldThrow([]);
    shouldThrow();
  });
});

function shouldThrow(opt) {
  (function() {
    rename('a.js', opt);
  }).should.throw('Unsupported renaming parameter type supplied');
}
