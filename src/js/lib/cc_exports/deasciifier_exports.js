/** @preserve
 *
 * Turkish text deasciifier and asciifier JavaScript library.
 *  Deasciifier code directly converted by Mustafa Emre Acer from
 *  Dr. Deniz Yuret's Emacs Turkish Extension: http://www.denizyuret.com/turkish
 */
var deasciifier = require('../deasciifier');

// Exports for Closure Compiler:
window["Asciifier"] = {
  "asciify": deasciifier.Asciifier.asciify,
  "asciifyRange": deasciifier.Asciifier.asciifyRange
};

window["Deasciifier"] = {
  "init": deasciifier.Deasciifier.init,
  "deasciify": deasciifier.Deasciifier.deasciify,
  "deasciifyRange": deasciifier.Deasciifier.deasciifyRange
}
