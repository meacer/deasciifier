/**
 * Test cases for Turkish Asciifier/Deasciifier library
 *
 * Author: Mustafa Emre Acer
 * Date:   Dec 3, 2011
 */
 
HtmlDeasciifierTest = TestCase("HtmlDeasciifierTest");

HtmlDeasciifierTest.prototype.testDeasciifyHtml = function() {

  /*// When deasciified, this text should stay the same:
  var html =
    "<a href='http://www.eksisozluk.com' title='Eksi Sozluk'>Bu bir ornegi</a><br>" + 
    "ek<b>s</b>i <u>soz</u>luk<br>test";
  var expected =
    "<a href='http://www.eksisozluk.com' title='Eksi Sozluk'>Bu bir \u00F6rne\u011Fi</a><br>" + 
    "ek<b>\u015F</b>i <u>s\u00F6z</u>l\u00FCk<br>test";
  
  var deasciiResult = MEA.HtmlDeasciifier.deasciify(html);
  assertEquals(expected, deasciiResult.text);
  */
  
  // When deasciified, this text should stay the same:
  var html =
    "deneme  " + 
    "eksi sozluk test";
  var expected =
    "deneme  " + 
    "ek\u015Fi s\u00F6zl\u00FCk test";
  
  var deasciiResult = MEA.HtmlDeasciifier.deasciify(html);
  assertEquals(expected, deasciiResult.text);
}

