/** Turkish text deasciifier and asciifier JavaScript library.
 *  Deasciifier code directly converted by Mustafa Emre Acer from 
 *  Dr. Deniz Yuret's Emacs Turkish Extension: http://www.denizyuret.com/turkish
 *
 *  Author:  Mustafa Emre Acer
 *  Version: 2.0
 *  Date:    2010-07-08
 */

/** DEASCI_CONFIG_NAME may be provided by a build script. If it is not provided, then
 *  we defaut to "Release".
 */
if (!window.DEASCI_CONFIG_NAME) {
  /** @const */ window.DEASCI_CONFIG_NAME = "Release";
}

/** Configuration options. These are assumed to be read-only and should not change.
 *  Hopefully closure-compiler will understand this and optimize the code.
 */
var BuildConfigs = {
  "Release": {
    DEBUGGER: false,                           // "debugger" statements for IE
    TEXTHILITE_SHOW_BACKGROUND_TEXT: false,
    TEXTHILITE_TRANSPARENT_TEXT: false,
    LOG: false
  },
  "Debug": {
    DEBUGGER: false,                             // "debugger" statements for IE
    TEXTHILITE_SHOW_BACKGROUND_TEXT: true,
    TEXTHILITE_TRANSPARENT_TEXT: true,            // Textarea's text color will be semi transparent
    LOG: true
  }
};

/** @const */ var BuildConfig = BuildConfigs[window.DEASCI_CONFIG_NAME];
