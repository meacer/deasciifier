/**
 * Test cases for Turkish Asciifier/Deasciifier library
 *
 * Author: Mustafa Emre Acer
 * Date:   May 29, 2011
 */

TurkishEncoderTest = TestCase("TurkishEncoderTest");

TurkishEncoderTest.prototype.testEncodeJS = function(){
  
  window.console && console.log("===testEncodeJS===");
  assertConversionFunc(testData, "deasciified", "js_encoded", TurkishEncoder.encodeJS);
}

TurkishEncoderTest.prototype.testEncodeHTML = function(){
 
  window.console && console.log("===testEncodeHTML===");
  assertConversionFunc(testData, "deasciified", "html_encoded", TurkishEncoder.encodeHTML);
}
