'use strict';

require('should');
var rename = require('..');

describe('rename', function() {

  it('string', function() {
    rename('a.js', 'b.js').should.eql('b.js');
    rename('a.js', '').should.eql('a.js');
    rename('a.js').should.eql('a.js');
    rename('a.js', null).should.eql('a.js');
    rename('a.js', undefined).should.eql('a.js');
    rename({
      basename: 'a',
      extname: '.js',
    }, '').should.eql('a.js');
  });

  it('function', function() {
    function transformer(fileObj) {
      var result = {
        extname: '.css',
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
      hash: '-abc',
    }, transformer).should.eql('a/b/c-abc.css');

    rename('a.js', function() {
      return 'b.js';
    }).should.eql('b.js');
  });

  it('object', function() {
    rename('a/b/c.js', {
      dirname: 'd/e',
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f',
    }).should.eql('d/e/pre-f-debug.css');

    rename('./a/b/c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f',
    }).should.eql('a/b/pre-f-debug.css');

    rename('../a/b/c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f',
    }).should.eql('../a/b/pre-f-debug.css');

    rename('./c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f',
    }).should.eql('pre-f-debug.css');

    rename('../c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f',
    }).should.eql('../pre-f-debug.css');

    rename('c.js', {
      prefix: 'pre-',
      suffix: '-debug',
      extname: '.css',
      basename: 'f',
    }).should.eql('pre-f-debug.css');

    rename('a/b/c.js', {
      dirname: null,
      extname: null,
      basename: null,
    }).should.eql('');

    rename('a/b/c.js', {}).should.eql('a/b/c.js');
  });

  it('object more than once', function() {
    var transform = {
      suffix: '-${hash}',
    };
    rename({ hash: '123', basename: 'c' }, transform).should.eql('c-123');
    rename({ hash: '456', basename: 'c' }, transform).should.eql('c-456');
  });

  it('template', function() {
    rename({
      basename: 'c',
      extname: '.js',
      hash: '111',
    }, {
      suffix: '-${hash}',
    }).should.eql('c-111.js');

    rename({
      basename: 'c',
      extname: '.js',
      hash: '111',
    }, function() {
      return {
        suffix: '-${hash}',
      };
    }).should.eql('c-111.js');

    rename({
      basename: 'c',
      extname: '.js',
      hash: '111',
    }, function() {
      return {
        suffix: '-${noexist}',
      };
    }).should.eql('c-.js');
  });

  it('error', function() {
    shouldThrow([]);
    shouldThrow(true);
  });
});

function shouldThrow(opt) {
  (function() {
    rename('a.js', opt);
  }).should.throw('transformer should be string, function or object.');
}
