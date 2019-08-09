"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const assert = require('assert').strict;

const _ = require('lodash');

const is = require('is');

const utils = require('./utils');

const logger = require('./logger');

function OpenApi() {
  let {
    urlPrefix,
    Auth
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!(this instanceof OpenApi)) {
    return new OpenApi({
      urlPrefix,
      Auth
    });
  }

  assert.ok(is.function(Auth), 'Auth can not be empty!');
  assert.ok(is.string(urlPrefix), 'urlPrefix can not be empty!');
  this.options = {
    urlPrefix,
    Auth
  };
  this.apis = OpenApi.apis;
}

OpenApi.prototype.plugin = function (_ref) {
  let {
    router,
    validator
  } = _ref;
  let {
    urlPrefix
  } = this.options;
  this.validator = validator;

  _.forEach(['post', 'get'], httpMethod => {
    router[httpMethod](urlPrefix, this.requestHandle.bind(this));
  });

  return {
    openapi: {
      registHandler: this.registHandler.bind(this)
    }
  };
};

OpenApi.prototype.appAuth =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (puData, ctx) {
    const {
      Auth
    } = this.options;
    const appKeySecret = yield Auth(puData.AppId);
    const ok = yield utils.rsaVerify(puData, appKeySecret);

    if (ok) {
      return appKeySecret;
    }

    throw new Error('sign no match');
  });

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

OpenApi.prototype.noti =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (ctx, noti) {
    try {
      const ret = yield utils.postRequest(noti.url, noti.news);
      logger.info(ret);
    } catch (error) {
      yield utils.postRequest(noti.url, noti.news);
      logger.warn(error);
    }
  });

  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

OpenApi.prototype.findVoke =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (name, version) {
    const voke = this.apis.find(x => {
      return x.version === version && x.name === name;
    });

    if (!voke) {
      logger.warn('voke not exists, ', name, version);
      throw new Error('voke not exists, ', name, version);
    }

    return voke;
  });

  return function (_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

OpenApi.prototype.registHandler = function () {
  let {
    name,
    version,
    voke
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!this.apis.find(x => x.name === name && x.version === version)) {
    this.apis.push({
      name,
      version,
      voke
    });
    return;
  }

  logger.warn('voke has existed ', name, version);
  throw new Error('voke has existed ', name, version);
};

OpenApi.prototype.requestHandle =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* (ctx) {
    this.validator.addSchema(utils.formModel, utils.formModelName);
    const puData = yield utils.getForm(ctx, this.validator);
    const appKeySecret = yield this.appAuth(puData, ctx);
    const handler = yield this.findVoke(puData.method, puData.version);
    const ret = yield handler.voke(appKeySecret, puData);

    if (ret.noti && ret.noti.url) {
      yield this.noti(ret.noti, ctx);
    }

    if (ret.noti && ret.noti.url) {
      const ok = this.noti(ctx, ret.noti);

      if (!ok) {
        logger.warn('noti to app:', appKeySecret.AppId, ' error');
      }
    }

    if (ret.retUrl) {
      return ctx.redirect(ret.retUrl);
    }

    ctx.status = 200;
    ctx.body = ret.body;
  });

  return function (_x7) {
    return _ref5.apply(this, arguments);
  };
}();

module.exports = OpenApi;
module.exports.apis = [];