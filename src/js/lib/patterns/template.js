//
// This file is used to generate the final pattern list.
//
// Author: Mustafa Emre Acer

if (!window["Deasciifier"]) {
  window["Deasciifier"] = {};
}
// Compiled pattern list:
window["Deasciifier"]["patternList"] = $COMPILED_PATTERNS$

// Callback function:
if (window["Deasciifier"]["onPatternListLoaded"]) {
  if (typeof(window["Deasciifier"]["onPatternListLoaded"])=="function") {
    window["Deasciifier"]["onPatternListLoaded"]();
  }
}
