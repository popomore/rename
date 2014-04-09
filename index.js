'use strict';

var dirname = require('path').dirname;
var basename = require('path').basename;
var extname = require('path').extname;
var join = require('path').join;

module.exports = function rename(filepath, opt) {
  var parsedPath = parsePath(filepath);

  if (typeof opt === 'string' && opt !== '') {
    filepath = opt;

  } else if (isFunction(opt)) {
    var result = opt(parsedPath) || parsedPath;
    filepath = join(result.dirname, result.basename + result.extname);

  } else if (isObject(opt)) {
    var dirname = 'dirname' in opt ? opt.dirname : parsedPath.dirname,
      prefix = opt.prefix || '',
      suffix = opt.suffix || '',
      basename = 'basename' in opt ? opt.basename : parsedPath.basename,
      extname = 'extname' in opt ? opt.extname : parsedPath.extname;

    filepath = join(dirname, prefix + basename + suffix + extname);

  } else {
    throw new Error('Unsupported renaming parameter type supplied');
  }

  return filepath;
};

function parsePath(path) {
  var ext = extname(path);
  return {
    dirname: dirname(path),
    basename: basename(path, ext),
    extname: ext
  };
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isFunction(fun) {
  return Object.prototype.toString.call(fun) === '[object Function]';
}
