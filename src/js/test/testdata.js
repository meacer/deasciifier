/**
 * Test data used in unit tests
 *
 * Author: Mustafa Emre Acer
 * Date:   May 29, 2011
 */

window.testData = [
  {
    deasciified:
    'T\u00FCrk\u00E7e veya T\u00FCrkiye T\u00FCrk\u00E7esi, varl\u0131\u011F\u0131 '+
    'tam olarak ispatlanamam\u0131\u015F ortak Altay dil ailesine ba\u011Fl\u0131 ' +
    'T\u00FCrk dillerinin O\u011Fuz \u00F6be\u011Fine \u00FCye bir dildir. T\u00FCrk ' +
    'dilleri ailesi b\u00FCnyesindeki O\u011Fuz \u00F6be\u011Finde bulunur. ' +
    'T\u00FCrk\u00E7e d\u00FCnyada en fazla konu\u015Fulan 15. dildir.',
    
    asciified:
    'Turkce veya Turkiye Turkcesi, varligi tam olarak ispatlanamamis ortak Altay ' +
    'dil ailesine bagli Turk dillerinin Oguz obegine uye bir dildir. Turk dilleri ' +
    'ailesi bunyesindeki Oguz obeginde bulunur. Turkce dunyada en fazla konusulan ' +
    '15. dildir.',
    
    js_encoded:
    'T\\u00FCrk\\u00E7e veya T\\u00FCrkiye T\\u00FCrk\\u00E7esi, varl\\u0131\\u011F\\u0131 '+
    'tam olarak ispatlanamam\\u0131\\u015F ortak Altay dil ailesine ba\\u011Fl\\u0131 ' +
    'T\\u00FCrk dillerinin O\\u011Fuz \\u00F6be\\u011Fine \\u00FCye bir dildir. T\\u00FCrk ' +
    'dilleri ailesi b\\u00FCnyesindeki O\\u011Fuz \\u00F6be\\u011Finde bulunur. ' +
    'T\\u00FCrk\\u00E7e d\\u00FCnyada en fazla konu\\u015Fulan 15. dildir.',
    
    html_encoded:
    'T&#252;rk&#231;e veya T&#252;rkiye T&#252;rk&#231;esi, varl&#305;&#287;&#305; ' +
    'tam olarak ispatlanamam&#305;&#351; ortak Altay dil ailesine ba&#287;l&#305; ' +
    'T&#252;rk dillerinin O&#287;uz &#246;be&#287;ine &#252;ye bir dildir. T&#252;rk ' +
    'dilleri ailesi b&#252;nyesindeki O&#287;uz &#246;be&#287;inde bulunur. ' +
    'T&#252;rk&#231;e d&#252;nyada en fazla konu&#351;ulan 15. dildir.'
    
  }
  /*Deasciification fails on the following:
  ,{
    deasciified:
    "Apollo 11, Ay y\u00FCzeyine insanl\u0131 ini\u015F yap\u0131lan ilk uzay u\u00E7u\u015Fu. " +
    "Apollo Tasar\u0131s\u0131'n\u0131n be\u015Finci u\u00E7u\u015Fu, Ay'a yap\u0131lan " + 
    "\u00FC\u00E7\u00FCnc\u00FC u\u00E7u\u015F (ilk iki u\u00E7u\u015Fta insanlar Ay y\u00FCzeyine inmedi)." +
    "Apollo 11, 16 Temmuz 1969'da f\u0131rlat\u0131ld\u0131. M\u00FCrettebat; Komutan Neil Armstrong, " +
    "Komuta Mod\u00FCl\u00FC Pilotu Michael Collins ve Ay mod\u00FCl\u00FC Pilotu Edwin \"Buzz\" Aldrin'den " +
    "olu\u015Fuyordu. 20 Temmuz'da Armstrong ve Aldrin Ay'a inen ilk insanlar oldular. ABD, " +
    "bu u\u00E7u\u015Fla Uzay Yar\u0131\u015F\u0131'n\u0131n ba\u015Fl\u0131ca hedefini rakibi " +
    "Sovyetler'den \u00F6nce ger\u00E7ekle\u015Ftirmi\u015F oldu. Apollo 11 ve di\u011Fer ay " +
    "yolcululuklar\u0131 olan apollo 12, apollo 14, apollo 15, apollo16 ve apollo 17 seferlerinin " +
    "t\u00FCm\u00FCn\u00FCn kurmaca oldu\u011Fu ve o d\u00F6nemde ya\u015Fanmakta olan \u015Fiddetli " +
    "yo\u011Funluktaki so\u011Fuk sava\u015F'ta ABD'ye psikolojik \u00FCst\u00FCnl\u00FCk sa\u011Flanmas\u0131 " +
    "amac\u0131yla b\u00F6yle bir sahtecilik yap\u0131ld\u0131\u011F\u0131 \u015Feklinde ciddi " +
    "dayanaklara sahip iddialar vard\u0131r.",
    
    asciified:
    "Apollo 11, Ay yuzeyine insanli inis yapilan ilk uzay ucusu. Apollo Tasarisi'nin besinci " + 
    "ucusu, Ay'a yapilan ucuncu ucus (ilk iki ucusta insanlar Ay yuzeyine inmedi). Apollo 11, " +
    "16 Temmuz 1969'da firlatildi. Murettebat; Komutan Neil Armstrong, Komuta Modulu Pilotu " +
    "Michael Collins ve Ay modulu Pilotu Edwin \"Buzz\" Aldrin'den olusuyordu. 20 Temmuz'da " +
    "Armstrong ve Aldrin Ay'a inen ilk insanlar oldular. ABD, bu ucusla Uzay Yarisi'nin baslica " +
    "hedefini rakibi Sovyetler'den once gerceklestirmis oldu. Apollo 11 ve diger ay yolcululuklari " +
    "olan apollo 12, apollo 14, apollo 15, apollo16 ve apollo 17 seferlerinin tumunun kurmaca " +
    "oldugu ve o donemde yasanmakta olan siddetli yogunluktaki soguk savas'ta ABD'ye psikolojik " + 
    "ustunluk saglanmasi amaciyla boyle bir sahtecilik yapildigi seklinde ciddi " +
    "dayanaklara sahip iddialar vardir."
  }*/
];

// Helper method for testing the data above:
window.assertConversionFunc = function(dataArray, originalKey, convertedKey, conversionFunc) {
  for (var i=0; i<testData.length; i++) {
    var original = testData[i][originalKey];
    var expected = testData[i][convertedKey];
    if (original && expected) {
      var result = conversionFunc(original);
      window.console && console.log("EXPECTED: " + expected);
      window.console && console.log("RESULT: "   + result.text);
      assertEquals(expected, result.text);
    } else {
      window.console && console.log("Skipping test case " + i + " for function " + conversionFunc.toString());
    }
  }
}
