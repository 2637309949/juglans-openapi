// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

class Option {
  constructor (funk) {
    this.funk = funk
  }
  apply (j) {
    return this.funk(j)
  }
  check (j) {
    return this.funk(j)
  }
}

module.exports.authOption = function (auth) {
  return new Option(function (o) {
    o.options.Auth = auth
    return o
  })
}

module.exports.Option = Option
