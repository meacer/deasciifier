/**
 * Test cases for Turkish Asciifier/Deasciifier library
 *
 * Author: Mustafa Emre Acer
 * Date:   May 29, 2011
 */
 
DeasciifierTest = TestCase("DeasciifierTest");


DeasciifierTest.prototype.testDeasciify = function() {

  window.console && console.log("===testDeasciify===");
  assertConversionFunc(testData, "asciified", "deasciified", Deasciifier.deasciify);
}

DeasciifierTest.prototype.testSkipURLs = function() {

  // When deasciified, this text should stay the same:
  var skipURLText =
    "Web adresi testi: \n" + 
    "http://www.eksisozluk.com Bir iki adres daha ekleyelim www.odtu.edu.tr \n" + 
    "www.hurriyet.com.tr http://alkislarlayasiyorum.com";
  
  var asciiText = skipURLText;
  var deasciiResult = Deasciifier.deasciify(asciiText);
  assertEquals(asciiText, deasciiResult.text);
}

DeasciifierTest.prototype.testURLRegex = function() {
  var shouldMatch = [
    "http://www.google.com",
    "http://google.com",
    "https://www.google.com",
    "ftp://www.google.com",
    "www.google.com",
    "www.google.net",
    "www.google"
  ];
  var shouldNotMatch = [
    "Test",
    "Test.string",
    "www",
    "www. Test",
    "http:// google.com",
    "google.com"
  ];
  
  var regex = Deasciifier["URLRegex"];
  // Matches
  for (var i=0; i<shouldMatch.length; i++) {
    assertNotNull(shouldMatch[i].match(regex));
  }
  // Non-matches
  for (var i=0; i<shouldNotMatch.length; i++) {
    assertNull(shouldNotMatch[i].match(regex));
  }
  
}
