import * as deasciifier from '../deasciifier'
import * as fs from "fs";
import * as process from "process"
import { stringify } from 'querystring';

if (process.argv.length <= 2) {
  throw "Usage: benchmark <input_file> <optional_output_file>";
}

let input_path = process.argv[2];
let output_path = (process.argv.length > 3) ? process.argv[3] : null;

function loadPatterns() {
  const pattern_text = fs.readFileSync("../js/lib/patterns/patterns.json", "utf8");

  const json = JSON.parse(pattern_text)
  var output : Record<string, string> = {};
  for (var key in json) {
    if (key == "__description__") {
      continue;
    }
    var patterns = json[key];
    var out = [];
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i][1] < 0) {
        out.push("-" + patterns[i][0])
      } else {
        out.push(patterns[i][0])
      }
    }
    output[key] = out.join("|");
  }
  return output;
}

function showContext(text: string, pos:number) : string {
  const CONTEXT_SIZE = 20;
  return text.substring(pos - CONTEXT_SIZE, pos) + "<" +
      text.substring(pos, pos + 1) + ">" +
      text.substring(pos + 1, pos + CONTEXT_SIZE);
}

function getIntersection(left: Set<number>, right: Set<number>): Set<number> {
  let intersection = new Set<number>();
  left.forEach(function(pos) {
    if (right.has(pos)) {
      intersection.add(pos);
    }
  });
  return intersection;
}
function getDifference(left: Set<number>, right: Set<number>): Set<number> {
  let difference = new Set<number>();
  left.forEach(function(pos) {
    if (!right.has(pos)) {
      difference.add(pos);
    }
  });
  return difference;
}

console.log("Processing ", input_path);
let text = fs.readFileSync(input_path, "utf8");
console.log("File read, deasciifying...");

let asciifier = new deasciifier.Asciifier();
let deasc = new deasciifier.Deasciifier();
deasc.init(loadPatterns());

let ascii = asciifier.process(text, null);

let startTime = new Date().getTime();
let deascii = deasc.process(ascii.text, null);
let endTime = new Date().getTime();

let asciiPositions = new Set<number>();
let deasciiPositions = new Set<number>();
for (let pos of ascii.changedPositions) {
  asciiPositions.add(pos);
}
for (let pos of deascii.changedPositions) {
  deasciiPositions.add(pos);
}

let intersection = getIntersection(asciiPositions, deasciiPositions);
let misses = getDifference(asciiPositions, deasciiPositions);
let false_positives = getDifference(deasciiPositions, asciiPositions);

console.log("Misses: ");
misses.forEach(function(pos: number) {
   console.log(showContext(text, pos));
});
console.log("=== Stats ===");
console.log("Elapsed time:           %d seconds ", Math.floor((endTime - startTime) / 1000));
console.log("ASCIIfied characters:   %d", asciiPositions.size);
console.log("DEASCIIfied characters: %d", deasciiPositions.size);
console.log("Overlap:         %d (%d%%)", intersection.size, Math.floor(intersection.size * 100 / asciiPositions.size));
console.log("Misses:          %d (%d%%)", misses.size, Math.floor(misses.size * 100 / asciiPositions.size));
console.log("False positives: %d (%d%%)", false_positives.size, Math.floor(false_positives.size * 100 / asciiPositions.size));

if (output_path) {
  fs.writeFile(output_path, deascii.text,  function(err) {
    if (err) {
      throw err;
    } else {
      console.log("Wrote deasciified text at %s", output_path);
    }
  });
}