'use strict';

var dirname = require('path').dirname;
var basename = require('path').basename;
var extname = require('path').extname;
var join = require('path').join;

module.exports = function rename(filepath, opt) {
  var parsedPath = parsePath(filepath), result = {};

  if (typeof opt === 'string' && opt !== '') {
    filepath = opt;

  } else if (isFunction(opt)) {
    result = opt(parsedPath) || parsedPath;
    filepath = joinPath(result);

  } else if (isObject(opt)) {
    result.dirname = choose('dirname', opt, parsedPath);
    result.extname = choose('extname', opt, parsedPath);
    result.basename = [
      opt.prefix || '',
      choose('basename', opt, parsedPath),
      opt.suffix || ''
    ].join('');

    filepath = joinPath(result);

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

function joinPath(path) {
  var filepath = path.dirname !== '' ?
    join(path.dirname, path.basename + path.extname) :
    path.basename + path.extname;

  if (path.dirname.charAt(0) === '.') {
    filepath = './' + filepath;
  }
  return filepath;
}

function choose(name, changed, origin) {
  return name in changed ? (changed[name] || '') : origin[name];
}