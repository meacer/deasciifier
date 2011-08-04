/**
 *  Basic utilities for deasciifier box
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *
 */
 
function log(s) {
  window.BuildConfig && window.BuildConfig.LOG && window.console && window.console.log(s);
}

function debugBreak() {
  if (window.BuildConfig && window.BuildConfig.DEBUGGER) {
    debugger;
  }
}

window["MEA"] = {};
var MEA = window["MEA"];

/** 
* @constructor
*/
MEA.OptionSet = function(options, defaultOptions) {
  this.defaultOptions = defaultOptions;
  this.options = options;
};
MEA.OptionSet.prototype = {
  set:function(name, value) {
    this.options[name] = value;
  },
  get:function(name, defaultValue) {
    var value = this.options[name];
    // Try passed default
    if (typeof(value)=="undefined") {
      value = defaultValue;
    }
    // Try to global default
    if (typeof(value)=="undefined" && this.defaultOptions) {
      value = this.defaultOptions[name];
    }
    return value;
  }
};

/**
 * @constructor 
 */
MEA.UILang = function(currentLang, texts) {
  this.currentLang = currentLang;
  this.texts = texts;
}
MEA.UILang.prototype = {
  changeLang:function(lang) {
    this.currentLang = lang;
  },
  getText:function(textName, param1, param2) {
    var texts = this.texts[textName];
    var text = "";
    if (texts && texts[this.currentLang]) {
      text = texts[this.currentLang];
    }
    return text;
  }
};

