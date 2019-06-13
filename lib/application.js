// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const assert = require('assert').strict
const _ = require('lodash')
const is = require('is')
const utils = require('./utils')
const logger = require('./logger')

function OpenApi ({ urlPrefix, Auth } = {}) {
  if (!(this instanceof OpenApi)) {
    return new OpenApi({ urlPrefix, Auth })
  }
  assert.ok(is.function(Auth), 'Auth can not be empty!')
  assert.ok(is.string(urlPrefix), 'urlPrefix can not be empty!')
  this.options = { urlPrefix, Auth }
  this.apis = OpenApi.apis
}

OpenApi.prototype.plugin = function ({ router, validator }) {
  let { urlPrefix } = this.options
  this.validator = validator
  _.forEach(['post', 'get'], httpMethod => {
    router[httpMethod](urlPrefix, this.requestHandle.bind(this))
  })
  return { openapi: {
    registHandler: this.registHandler.bind(this)
  } }
}

OpenApi.prototype.appAuth = async function (puData, ctx) {
  const { Auth } = this.options
  const appKeySecret = await Auth(puData.AppId)
  const ok = await utils.rsaVerify(puData, appKeySecret)
  if (ok) {
    return appKeySecret
  }
  throw new Error('sign no match')
}

OpenApi.prototype.noti = async function (ctx, noti) {
  try {
    const ret = await utils.postRequest(noti.url, noti.news)
    logger.info(ret)
  } catch (error) {
    await utils.postRequest(noti.url, noti.news)
    logger.warn(error)
  }
}

OpenApi.prototype.findVoke = async function (name, version) {
  const voke = this.apis.find(x => {
    return x.version === version && x.name === name
  })
  if (!voke) {
    logger.warn('voke not exists, ', name, version)
    throw new Error('voke not exists, ', name, version)
  }
  return voke
}

OpenApi.prototype.registHandler = function ({ name, version, voke } = {}) {
  if (!this.apis.find(x => x.name === name && x.version === version)) {
    this.apis.push({ name, version, voke })
    return
  }
  logger.warn('voke has existed ', name, version)
  throw new Error('voke has existed ', name, version)
}

OpenApi.prototype.requestHandle = async function (ctx) {
  try {
    this.validator.addSchema(utils.formModel, utils.formModelName)
    const puData = await utils.getForm(ctx, this.validator)
    const appKeySecret = await this.appAuth(puData, ctx)
    const handler = await this.findVoke(puData.method, puData.version)
    const ret = await handler.voke(appKeySecret, puData)
    if (ret.noti && ret.noti.url) {
      await this.noti(ret.noti, ctx)
    }
    if (ret.retUrl) {
      return ctx.redirect(ret.retUrl)
    }
    if (ret.noti && ret.noti.url) {
      const ok = this.noti(ctx, ret.noti)
      if (!ok) {
        logger.warn('noti to app:', appKeySecret.AppId, ' error')
      }
    }
    ctx.status = 200
    ctx.body = ret.body
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: error.message }
  }
}

module.exports = OpenApi
module.exports.apis = []
