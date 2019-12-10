const JsamineCore = require('jasmine-core')
// @ts-ignore
global.getJasmineRequireObj = function() {
  return JsamineCore
}

require('jasmine-ajax')
