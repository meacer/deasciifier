// Turkish Deasciifier patterns and pattern compilation code.
// Author: Mustafa Emre Acer
//
// This file compiles the patterns and creates a dictionary from the pattern array.
// It is intended to be used from the build script. Do not include this file in a html page.
// 
var keys = ["c","g","i","o","s","u"];
var keyStrings = [];
for (var i=0; i<keys.length; i++) {
  var key = keys[i];
  var entries = patterns[key];
  var computedEntries = [];
  for (var k=0; k<entries.length; k++) {
    var entry = entries[k];
    var pattern = entry[0];
    var value = entry[1]*k;  // rank is index*(-1|1)
    var computedString = "\"" + pattern + "\":" + value;
    computedEntries.push(computedString);
  }
  // Add the "length" entry:
  computedEntries.push("\"length\":" + k);
  var keyString = "\"" + key + "\":{" + computedEntries.join(",") + "}";
  keyStrings.push(keyString);
}

// This is the compiled pattern string. It is read from build script:
var patternString = "{\n" + keyStrings.join(",\n") + "\n};";

