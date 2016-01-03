var patterns = require('../patterns/_generated_patterns');

// Exports for Closure Compiler:
if (window["Deasciifier"]["onPatternListLoaded"]) {
  if (typeof(window["Deasciifier"]["onPatternListLoaded"])=="function") {
    window["Deasciifier"]["onPatternListLoaded"](patterns.PATTERN_LIST);
  }
}
