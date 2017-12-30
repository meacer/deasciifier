var chai = require("chai");
var assert = chai.assert;

var testdata = require('./testdata');
var deasciifier = require('../lib/deasciifier');
var patterns = require('../lib/patterns/_generated_patterns_v2');
var turkish_encoder = require('../lib/turkish_encoder');

describe('Asciifier', function() {
  it('should asciify', function() {
    assert.equal(
        testdata.TEST_DATA[0].asciified,
        deasciifier.Asciifier.asciify(testdata.TEST_DATA[0].deasciified).text);
  });
});

describe('Deasciifier', function() {
  it('should deasciify short text', function() {
    deasciifier.Deasciifier.init(patterns.PATTERN_LIST);
    assert.isNotNull(
        deasciifier.Deasciifier.deasciify("Arkadaslarla agaca ciktik", null));
  });
});

describe('Deasciifier', function() {
  it('should deasciify long text', function() {
    deasciifier.Deasciifier.init(patterns.PATTERN_LIST);
    assert.equal(
        testdata.TEST_DATA[0].deasciified,
        deasciifier.Deasciifier.deasciify(testdata.TEST_DATA[0].asciified)
            .text);
  });
});

describe('Deasciifier', function() {
  it('should detect URLs', function() {
    var URLS = [
      "http://www.google.com",
      "http://google.com",
      "https://www.google.com",
      "ftp://www.google.com",
      "www.google.com",
      "www.google.net",
      "www.google"
    ];
    var NON_URLS = [
      "Test",
      "Test.string",
      "www",
      "www. Test",
      "http:// google.com",
      "google.com"
    ];
    // Matches
    for (var i = 0; i < URLS.length; i++) {
      assert.isNotNull(URLS[i].match(deasciifier.Deasciifier.URL_REGEX));
    }
    // Non-matches
    for (var i = 0; i < NON_URLS.length; i++) {
      assert.isNotNull(NON_URLS[i].match(deasciifier.Deasciifier.URL_REGEX));
    }
  });
});

describe('Deasciifier', function() {
  it('should not deasciify URLs', function() {
    // When deasciified, this text should stay the same:
    var SKIP_URL_TEXT =
        "Web adresi testi: \n" +
        "http://www.eksisozluk.com Bir iki adres daha ekleyelim \n" +
        "www.odtu.edu.tr \n" +
        "www.hurriyet.com.tr http://alkislarlayasiyorum.com";
    deasciifier.Deasciifier.init(patterns.PATTERN_LIST);
    assert.equal(SKIP_URL_TEXT,
                 deasciifier.Deasciifier.deasciify(SKIP_URL_TEXT).text);
  });
});

describe('TurkishEncoder', function() {
  it('should encode Turkish characters', function() {
    assert.equal(
        testdata.TEST_DATA[0].html_encoded,
        turkish_encoder.TurkishEncoder.encodeHTML(
                                          testdata.TEST_DATA[0].deasciified)
            .text);
  });
});
