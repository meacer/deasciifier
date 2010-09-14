// Turkish character encoder for HTML and JavaScript
//
// Author: Mustafa Emre Acer
//
// Converts Turkish characters to HTML and JavaScript codes


function TurkishEncoder() {
}
TurkishEncoder.turkish_html_table = {
  'ç':'&#231;',
  'Ç':'&#199;',    
  'ğ':'&#287;',
  'Ğ':'&#286;',    
  'ı':'&#305;',
  'İ':'&#304;', 
  'ö':'&#246;',
  'Ö':'&#214;',    
  'ş':'&#351;',
  'Ş':'&#350;',    
  'ü':'&#252;',
  'Ü':'&#220;'
};
TurkishEncoder.turkish_js_table = {
  'ç':'\\u00E7',
  'Ç':'\\u00C7',
  'ğ':'\\u011F',
  'Ğ':'\\u011E',    
  'ı':'\\u0131',
  'İ':'\\u0130', 
  'ö':'\\u00F6',
  'Ö':'\\u00D6',    
  'ş':'\\u015F',
  'Ş':'\\u015E',    
  'ü':'\\u00FC',
  'Ü':'\\u00DC'
};
TurkishEncoder.prototype = {

  encodeHTML:function(str) {
    return this.encode(str, TurkishEncoder.turkish_html_table);
  },
  encodeJS:function(str) {
    return this.encode(str, TurkishEncoder.turkish_js_table);
  },
  
  encode:function(str, char_table) {
    // There seems to be a bug here. Chrome fails to convert long texts correctly.
    this.text = str;
    var output = new Array(this.text.length);
    for (var i=0; i<this.text.length; i++) {
      var ch = this.text.charAt(i);
      var ascii = char_table[ch] || ch;
      output[i] = ascii;
    }
    return output.join("");
  }
};
