'use strict';

var debug = require('debug')('rename');
var parse = require('./lib/parse');
var stringify = require('./lib/stringify');
var util = require('./lib/util');

module.exports = rename;
module.exports.parse = parse;
module.exports.stringify = stringify;

/*
  Rename filepath using transformer
*/
function rename(filepath, transformer) {
  /*
    Return a file object

    {
      dirname
      basename
      extname
      origin
    }
  */
  var fileObj = parse(filepath);
  debug('file object');

  // rename it when transformer is string as a filepath
  if (util.isString(transformer)) {
    return transformer || stringify(fileObj);
  }

  /*
    transformed object

    {
      dirname
      prefix
      basename
      suffix
      extname
    }
  */
  var transformed = util.isFunction(transformer) ? transformer(fileObj) : transformer;

  if (!util.isObject(transformed)) {
    throw new Error('transformer should be string, function or object.');
  }

  debug('transform from %j to %j', fileObj, transformed);
  return transform(fileObj, transformed);
}

function transform(fileObj, transformed) {
  var result = {};
  result.dirname = choose('dirname', transformed, fileObj);
  result.extname = choose('extname', transformed, fileObj);
  result.basename = [
    transformed.prefix || '',
    choose('basename', transformed, fileObj),
    transformed.suffix || ''
  ].join('');
  return stringify(result);
}

function choose(name, changed, origin) {
  return name in changed ? (changed[name] || '') : origin[name];
}
