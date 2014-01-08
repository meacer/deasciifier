// Turkish character encoder for HTML and JavaScript
//
// Author: Mustafa Emre Acer
// Version: 1.1
//
// Converts Turkish characters to HTML and JavaScript codes
//

var TurkishEncoder = {};

(function(){

  /** @enum {string}
  */
  var turkish_html_table = {
    '\u00E7':'&#231;', // turkish lowercase c
    '\u00C7':'&#199;', // turkish uppercase c
    '\u011F':'&#287;', // turkish lowercase g
    '\u011E':'&#286;', // turkish uppercase g
    '\u0131':'&#305;', // turkish lowercase i
    '\u0130':'&#304;', // turkish uppercase i
    '\u00F6':'&#246;', // turkish lowercase o
    '\u00D6':'&#214;', // turkish uppercase o
    '\u015F':'&#351;', // turkish lowercase s
    '\u015E':'&#350;', // turkish uppercase s
    '\u00FC':'&#252;', // turkish lowercase u
    '\u00DC':'&#220;'  // turkish uppercase u
  };
  /** @enum {string}
  */
  var turkish_js_table = {
    '\u00E7':'\\u00E7', // turkish lowercase c
    '\u00C7':'\\u00C7', // turkish uppercase c
    '\u011F':'\\u011F', // turkish lowercase g
    '\u011E':'\\u011E', // turkish uppercase g
    '\u0131':'\\u0131', // turkish lowercase i
    '\u0130':'\\u0130', // turkish uppercase i
    '\u00F6':'\\u00F6', // turkish lowercase o
    '\u00D6':'\\u00D6', // turkish uppercase o
    '\u015F':'\\u015F', // turkish lowercase s
    '\u015E':'\\u015E', // turkish uppercase s
    '\u00FC':'\\u00FC', // turkish lowercase u
    '\u00DC':'\\u00DC'  // turkish uppercase u
  };

  TurkishEncoder.encodeHTML = function(str) {
    return encode(str, turkish_html_table);
  };
  TurkishEncoder.encodeJS = function(str) {
    return encode(str, turkish_js_table);
  };
  
  function encode(text, char_table) {
    // There seems to be a bug here. Chrome fails to convert long texts correctly.
    if (!text) {
      return text;
    }
    var output = new Array(text.length);
    for (var i=0; i<text.length; i++) {
      var ch = text.charAt(i);
      var ascii = char_table[ch] || ch;
      output[i] = ascii;
    }
    // TODO: Add changed positions list:
    return {"text":output.join("")};
  }
  
})();

// Exports for Closure Compiler
window["TurkishEncoder"] = TurkishEncoder;
window["TurkishEncoder"]["encodeJS"] = TurkishEncoder.encodeJS;
window["TurkishEncoder"]["encodeHTML"] = TurkishEncoder.encodeHTML;

