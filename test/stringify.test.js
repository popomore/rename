'use strict';

require('should');
var stringify = require('../lib/stringify');

describe('rename.stringify', function() {

  it('should stringify object', function() {
    stringify({});

    shouldThrow();
    shouldThrow('');
    shouldThrow(null);
    shouldThrow(undefined);
    shouldThrow([]);
    shouldThrow(/reg/);

    function shouldThrow(obj) {
      (function() {
        stringify(obj);
      }).should.throw('Argument should be object.');
    }
  });

  it('should stringify normal filepath', function() {
    stringify({
      dirname: '/home/admin',
      basename: 'file',
      extname: '.js',
    }).should.eql('/home/admin/file.js');
  });

  it('should stringify filepath without extname', function() {
    stringify({
      dirname: '/home/admin',
      basename: 'file',
      extname: '',
    }).should.eql('/home/admin/file');
  });

  it('should stringify relative filepath', function() {
    stringify({
      dirname: '.',
      basename: 'file',
      extname: '',
    }).should.eql('file');
    stringify({
      dirname: '..',
      basename: 'file',
      extname: '',
    }).should.eql('../file');
  });

  it('should stringify without dirname', function() {
    stringify({
      basename: 'file',
      extname: '.js',
    }).should.eql('file.js');
  });

  it('should stringify without extname', function() {
    stringify({
      dirname: '/home/admin',
      basename: 'file',
    }).should.eql('/home/admin/file');
  });
});
