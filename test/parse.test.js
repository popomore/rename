'use strict';

require('should');
var parse = require('../lib/parse');

describe('rename.parse', function() {

  it('should parse string or object', function() {
    parse('');
    parse({});

    shouldThrow();
    shouldThrow(null);
    shouldThrow(undefined);
    shouldThrow([]);
    shouldThrow(/reg/);

    function shouldThrow(obj) {
      (function() {
        parse(obj);
      }).should.throw('Argument should be string or object.');
    }
  });

  describe('string', function() {

    it('should parse normal filepath', function() {
      parse('/home/admin/file.js').should.eql({
        dirname: '/home/admin',
        basename: 'file',
        extname: '.js',
        origin: '/home/admin/file.js'
      });
    });

    it('should parse filepath without extname', function() {
      parse('/home/admin/file').should.eql({
        dirname: '/home/admin',
        basename: 'file',
        extname: '',
        origin: '/home/admin/file'
      });
    });

    it('should parse relative filepath', function() {
      parse('./file').should.eql({
        dirname: '.',
        basename: 'file',
        extname: '',
        origin: './file'
      });
      parse('../file').should.eql({
        dirname: '..',
        basename: 'file',
        extname: '',
        origin: '../file'
      });
      parse('../dir/file').should.eql({
        dirname: '../dir',
        basename: 'file',
        extname: '',
        origin: '../dir/file'
      });
      parse('file').should.eql({
        dirname: '.',
        basename: 'file',
        extname: '',
        origin: 'file'
      });
    });
  });

  describe('object', function() {

    it('should parse empty', function() {
      parse({}).should.eql({
        dirname: '',
        basename: '',
        extname: '',
        origin: ''
      });
    });

    it('should return the origin object', function() {
      var orig = {
        dirname: '/home/admin',
        basename: 'file',
        extname: '.js',
        origin: '/home/admin/file.js'
      };
      parse(orig).should.equal(orig);
    });

    it('should pass custom property', function() {
      parse({hash: '123456'}).should.eql({
        dirname: '',
        basename: '',
        extname: '',
        origin: '',
        hash: '123456'
      });
    });
  });
});
