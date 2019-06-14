"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable indent */
// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const fetch = require('node-fetch');

const RSA = require('node-rsa');

const _ = require('lodash');

const logger = require('./logger');

const repo = module.exports;
repo.formModelName = '/openapi.puData';
repo.formModel = {
  'id': '/openapi.puData',
  'type': 'object',
  'properties': {
    'app_id': {
      'type': 'string',
      'required': true
    },
    'method': {
      'type': 'string',
      'required': true
    },
    'format': {
      'type': 'string',
      'required': true
    },
    'return_url': {
      'type': 'string',
      'required': true
    },
    'sign_type': {
      'type': 'string',
      'required': true
    },
    'timestamp': {
      'type': 'string',
      'required': true
    },
    'version': {
      'type': 'string',
      'required': true
    },
    'notify_url': {
      'type': 'string',
      'required': true
    },
    'app_auth_token': {
      'type': 'string',
      'required': true
    },
    'biz_content': {
      'type': 'string',
      'required': true
    }
  }
};

repo.getForm = function (ctx, validator) {
  let puData;
  const method = ctx.method.toUpperCase();

  if (method === 'POST') {
    puData = ctx.request.body;
  } else {
    puData = ctx.query;
  } // const validateRet = validator.validate(puData, validator.schemas['/openapi.puData'])
  // console.log(validateRet)


  return puData;
};

repo.postRequest =
/*#__PURE__*/
function () {
  var _postRequest = _asyncToGenerator(function* (url, data) {
    const rp = yield fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => ({
      status: res.status,
      data: res.jons()
    }));

    if (rp.status !== 200) {
      throw new Error('noti application error');
    }

    return rp.data;
  });

  function postRequest(_x, _x2) {
    return _postRequest.apply(this, arguments);
  }

  return postRequest;
}();

function map2SignString(puData) {
  const signObject = _.omit(puData, 'sign');

  const signKeys = _.keys(signObject);

  const sortedKeys = _.sortBy(signKeys);

  return sortedKeys.reduce((acc, curr) => {
    acc.push(`${curr}=${puData[curr]}`);
    return acc;
  }, []).join('&');
}

repo.rsaVerify = function (puData, appKeySecret) {
  const sign = puData.sign;
  const signString = map2SignString(puData);
  const rsa = new RSA(null, 'pkcs1-public-pem', {
    signingScheme: 'pkcs1-sha256'
  });
  console.log(signString);

  try {
    rsa.importKey(`-----BEGIN RSA PUBLIC KEY-----
${appKeySecret.publicKey}
-----END RSA PUBLIC KEY-----`, 'pkcs1-public-pem');
  } catch (error) {
    logger.error(error);
    throw new Error('import publicKey error, please check your publicKey');
  }

  try {
    const ok = rsa.verify(signString, sign, 'utf8', 'base64');
    return ok;
  } catch (error) {
    logger.error(error);
    throw new Error('verify sign error');
  }
};

repo.rsaSign = function (puData, appKeySecret) {
  const signString = map2SignString(puData);
  const rsa = new RSA(null, 'pkcs1-private-pem', {
    signingScheme: 'pkcs1-sha256'
  });

  try {
    rsa.importKey(`-----BEGIN RSA PRIVATE KEY-----
${appKeySecret.privateKey}
-----END RSA PRIVATE KEY-----`, 'pkcs1-private-pem');
  } catch (error) {
    logger.error(error);
    throw new Error('import privateKey error, please check your privateKey');
  }

  try {
    const sign = rsa.sign(signString, 'base64', 'utf8');
    return sign;
  } catch (error) {
    logger.error(error);
    throw new Error('sign error');
  }
};