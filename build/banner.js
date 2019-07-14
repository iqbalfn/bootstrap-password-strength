'use strict'

const year = new Date().getFullYear()

function getBanner(pluginFilename) {
  return `/*!
  * Bootstrap Password Strength v0.0.1 (https://iqbalfn.github.io/bootstrap-password-strength/)
  * Copyright 2019 Iqbal Fauzi
  * Licensed under MIT (https://github.com/iqbalfn/bootstrap-password-strength/blob/master/LICENSE)
  */`
}

module.exports = getBanner
