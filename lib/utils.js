// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const repo = module.exports

repo.formModelName = '/openapi.puData'
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
}

repo.getForm = function (ctx, validator) {
  let puData
  const method = ctx.method.toUpperCase()
  if (method === 'POST') {
    puData = ctx.request.body
  } else {
    puData = ctx.query
  }
  // const validateRet = validator.validate(puData, validator.schemas['/openapi.puData'])
  // console.log(validateRet)
  return puData
}
