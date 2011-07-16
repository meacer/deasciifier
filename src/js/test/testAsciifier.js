/**
 * Test cases for Turkish Asciifier/Deasciifier library
 *
 * Author: Mustafa Emre Acer
 * Date:   May 29, 2011
 */

AsciifierTest = TestCase("AsciifierTest");

AsciifierTest.prototype.testAsciify = function(){
 
  window.console && console.log("===testAsciify===");
  assertConversionFunc(testData, "deasciified", "asciified", Asciifier.asciify);
}
