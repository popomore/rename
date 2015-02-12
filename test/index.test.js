'use strict';

require('should');
var rename = require('..');

describe('rename', function() {

  it('string', function() {
    rename('a.js', 'b.js').should.eql('b.js');
    rename('a.js', '').should.eql('a.js');
    rename({
      basename: 'a',
      extname: '.js'
    }, '').should.eql('a.js');
  });

  it('function', function() {
    function transformer(fileObj) {
      var result = {
        extname: '.css'
      };
      if (fileObj.basename === 'd') {
        result.dirname = fileObj.dirname + '/d';
      }
      result.suffix = fileObj.hash || '-debug';
      return result;
    }

    rename('a/b/c.js', transformer).should.eql('a/b/c-debug.css');
    rename('./a/b/d.js', transformer).should.eql('a/b/d/d-debug.css');
    rename({
      dirname: 'a/b',
      basename: 'c',
      extname: '.js',
      hash: '-abc'
    }, transformer).should.eql('a/b/c-abc.css');
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
    }).should.eql('a/b/pre-f-debug.css');

    rename('../a/b/c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f'
    }).should.eql('../a/b/pre-f-debug.css');

    rename('./c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f'
    }).should.eql('pre-f-debug.css');

    rename('../c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f'
    }).should.eql('../pre-f-debug.css');

    rename('c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f'
    }).should.eql('pre-f-debug.css');

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
  }).should.throw('transformer should be string, function or object.');
}
