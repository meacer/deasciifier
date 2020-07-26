// Cleans up Turkish text.
//
// Skips characters that are not Latin or Turkish and drops certain characters
// such as combining dot above.

import * as deasciifier from '../deasciifier'
import * as fs from "fs";
import * as process from "process"

if (process.argv.length <= 2) {
  throw "Usage: cleanup <input_file> <optional_output_file>";
}

let input_path = process.argv[2];
let output_path = (process.argv.length > 3) ? process.argv[3] : null;

console.log("Processing ", input_path);
let text = fs.readFileSync(input_path, "utf8");
console.log("File read, cleaning up...");

function isLatinOrTurkish(c: string) : boolean {
  // TODO: Use something more intelligent here.
  return (c.charCodeAt(0) >=32 && c.charCodeAt(0) <= 126) ||
         c == '\n' || c == '\t' || c == '\r' ||
         c == '’' || c == '“' || c == '”' || c == '´' || c == '–' ||
         c == 'â' || c == 'î' || c == 'û' ||
         c == 'é' || c == 'à' || c == 'ë' || c == 'ô' || c == 'œ' || c == 'ê' ||
         c == 'è' ||
         c == 'ç' || c == 'ğ' || c == 'ı' || c == 'ö' || c == 'ş' || c == 'ü';
}

var positions = [];
var output = [];
for (var i = 0; i < text.length; i++) {
  let c = text.charAt(i);
  if (c.charCodeAt(0) == 0x0307) { // Combining dot above
    continue;
  }
  if (isLatinOrTurkish(c)) {
    output.push(c);
    continue;
  }
  positions.push(i);
}

console.log("Found %d odd characters", positions.length);

if (output_path) {
  fs.writeFile(output_path, output.join(""),  function(err) {
    if (err) {
      throw err;
    } else {
      console.log("Wrote cleaned text at %s", output_path);
    }
  });
}
