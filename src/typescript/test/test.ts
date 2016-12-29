import { TextRange, TextProcessingOptions } from '../common';
import { TextHelper } from '../text_helper';
import * as deasciifier from '../deasciifier'
import * as testdata from './testdata';

import chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;

describe('Asciifier', function () {
  let asciifier = new deasciifier.Asciifier();

  it('should asciify', function () {
    assert.equal(
      testdata.TEST_DATA[0].asciified,
      asciifier.process(testdata.TEST_DATA[0].deasciified, null).text);
  });

  it('should asciify range', function () {
    // Null text.
    let result = asciifier.processRange(null, <TextRange>{ start: 0, end: 0 }, null);
    expect(result).to.eql(null);

    // Empty string.
    result = asciifier.processRange("", <TextRange>{ start: 0, end: 10 }, null);
    expect(result.changedPositions).to.eql([]);
    assert.equal("", result.text);

    // Empty range.
    result = asciifier.processRange("Türkçe", <TextRange>{ start: 0, end: 0 }, null);
    expect(result.changedPositions).to.eql([]);
    assert.equal("Türkçe", result.text);

    // First character.
    result = asciifier.processRange("Türkçe", <TextRange>{ start: 0, end: 1 }, null);
    expect(result.changedPositions).to.eql([]);
    assert.equal("Türkçe", result.text);

    // First two characters.
    result = asciifier.processRange("Türkçe", <TextRange>{ start: 0, end: 2 }, null);
    expect(result.changedPositions).to.eql([1]);
    assert.equal("Turkçe", result.text);

    // All characters.
    result = asciifier.processRange("Türkçe", <TextRange>{ start: 0, end: 6 }, null);
    expect(result.changedPositions).to.eql([1, 4]);
    assert.equal("Turkce", result.text);

    // All characters, beyond text length.
    result = asciifier.processRange("Türkçe", <TextRange>{ start: 0, end: 100 }, null);
    expect(result.changedPositions).to.eql([1, 4]);
    assert.equal("Turkce", result.text);
  });
});

function keysOf(dict: { [key: string]: any }): Array<string> {
  let keys: Array<string> = [];
  for (let key in dict) {
    keys.push(key);
  }
  return keys;
}

describe('Deasciifier', function () {
  it('should detect URLs', function () {
    const URLS: Array<string> = [
      "http://www.google.com",
      "http://google.com",
      "https://www.google.com",
      "ftp://www.google.com",
      "www.google.com",
      "www.google.net",
      "www.google"
    ];
    const NON_URLS: Array<string> = [
      "Test",
      "Test.string",
      "www",
      "www. Test",
      "http:// google.com",
      "google.com"
    ];
    // Matches
    for (let i = 0; i < URLS.length; i++) {
      assert.isNotNull(URLS[i].match(deasciifier.URL_REGEX), "Case " + i);
    }
    // Non-matches
    for (let i = 0; i < NON_URLS.length; i++) {
      assert.isNull(NON_URLS[i].match(deasciifier.URL_REGEX), "Case " + i);
    }
  });

  const PATTERNS = {
    'c': 'aXa|-bXb|-aX|-Xa',
    'g': 'aXa|-bX|-Xb'
  };

  it('should load patterns', function () {
    let deasc = new deasciifier.Deasciifier();
    deasc.init(PATTERNS);
    expect(keysOf(deasc.turkish_pattern_table)).to.eql(['c', 'g']);
    expect(deasc.turkish_pattern_table['c']).to.eql({ 'aXa': 1, 'bXb': -2, 'aX': -3, 'Xa': -4 });
    expect(deasc.turkish_pattern_table['g']).to.eql({ 'aXa': 1, 'bX': -2, 'Xb': -3 });
  });

  it('should deasciify', function () {
    let deasc = new deasciifier.Deasciifier();
    deasc.init(PATTERNS);

    let result = deasc.process(null, null);
    assert.equal(null, result);

    result = deasc.process("", null);
    assert.equal("", result.text);
    expect(result.changedPositions).to.eql([]);

    result = deasc.process("agaca", null);
    assert.equal("ağaça", result.text);
    expect(result.changedPositions).to.eql([1, 3]);

    result = deasc.process("aGaCa", null);
    assert.equal("aĞaÇa", result.text);
    expect(result.changedPositions).to.eql([1, 3]);

    result = deasc.process("AgAcA", null);
    assert.equal("AğAçA", result.text);
    expect(result.changedPositions).to.eql([1, 3]);

    result = deasc.process("bgbcb", null);
    assert.equal("bgbcb", result.text);
    expect(result.changedPositions).to.eql([]);

    // See the TODO in turkish_match_pattern for this. Default behavior is to
    // deasciify if no pattern matches.
    result = deasc.process("c", null);
    assert.equal("ç", result.text);
    expect(result.changedPositions).to.eql([0]);

    result = deasc.process("caacaac", null);
    assert.equal("caaçaac", result.text);
    expect(result.changedPositions).to.eql([3]);
  });

  it('should deasciify range', function () {
    let deasc = new deasciifier.Deasciifier();
    deasc.init(PATTERNS);

    let result = deasc.processRange("agaca", <TextRange>{ start: 0, end: 0 }, null);
    assert.equal("agaca", result.text);
    expect(result.changedPositions).to.eql([]);

    result = deasc.processRange("agaca", <TextRange>{ start: 0, end: 100 }, null);
    assert.equal("ağaça", result.text);
    expect(result.changedPositions).to.eql([1, 3]);

    result = deasc.processRange("agaca", <TextRange>{ start: 100, end: 0 }, null);
    assert.equal("agaca", result.text);
    expect(result.changedPositions).to.eql([]);

    result = deasc.processRange("agaca", <TextRange>{ start: 0, end: 1 }, null);
    assert.equal("agaca", result.text);
    expect(result.changedPositions).to.eql([]);

    result = deasc.processRange("agaca", <TextRange>{ start: 0, end: 2 }, null);
    assert.equal("ağaca", result.text);
    expect(result.changedPositions).to.eql([1]);

    result = deasc.processRange("agaca", <TextRange>{ start: 0, end: 4 }, null);
    assert.equal("ağaça", result.text);
    expect(result.changedPositions).to.eql([1, 3]);

    result = deasc.processRange("agaca", <TextRange>{ start: 1, end: 2 }, null);
    assert.equal("ağaca", result.text);
    expect(result.changedPositions).to.eql([1]);

    result = deasc.processRange("agaca", <TextRange>{ start: 2, end: 2 }, null);
    assert.equal("agaca", result.text);
    expect(result.changedPositions).to.eql([]);

    result = deasc.processRange("agaca", <TextRange>{ start: 1, end: 4 }, null);
    assert.equal("ağaça", result.text);
    expect(result.changedPositions).to.eql([1, 3]);
  });

  it('should skip URLs', function () {
    let deasc = new deasciifier.Deasciifier();
    deasc.init(PATTERNS);

    let options = <TextProcessingOptions>{ skipURLs: true };
    let result = deasc.process("http://agaca.com agaca", options);
    assert.equal("http://agaca.com ağaça", result.text);
    expect(result.changedPositions).to.eql([18, 20]);
  });
});

describe('TextHelper', function () {
  it('isCursorInsideWord', function () {
    class TestCase {
      constructor(
        public readonly index: number, public readonly expected: boolean) { }
    }
    const TEST_STRING = "abc de  f   g";
    const test_cases: Array<TestCase> = [
      new TestCase(0, false),   // *abc de  f   g
      new TestCase(1, true),    //  a*bc de  f   g
      new TestCase(2, true),    //  ab*c de  f   g
      new TestCase(3, false),   //  abc* de  f   g
      new TestCase(4, false),   //  abc *de  f   g
      new TestCase(5, true),    //  abc d*e  f   g
      new TestCase(6, false),   //  abc de*  f   g
      new TestCase(7, false),   //  abc de * f   g
      new TestCase(8, false),   //  abc de  *f   g
      new TestCase(9, false),   //  abc de   f*  g
      new TestCase(10, false),  //  abc de   f * g
      new TestCase(11, false),  //  abc de   f  *g
      new TestCase(12, false),  //  abc de   f   g*
      // Before the string:
      new TestCase(-1, false),  // *|abc de  f   g
      // Past the end of the string:
      new TestCase(13, false),  //   abc de  f   g|*
    ];
    for (let test_case of test_cases) {
      assert.equal(
        test_case.expected,
        TextHelper.isCursorInsideWord(TEST_STRING, test_case.index),
        "Wrong result for index " + test_case.index);
    }
  });

  it('getWordAtCursor', function () {
    class TestCase {
      constructor(
        public readonly index: number,
        public readonly expected_start: number,
        public readonly expected_end: number) { }
    }
    const TEST_STRING = "abc de  f   g";
    const test_cases: Array<TestCase> = [
      new TestCase(0, 0, 3),    // *abc de  f   g
      new TestCase(1, 0, 3),    // a*bc de  f   g
      new TestCase(2, 0, 3),    // ab*c de  f   g
      new TestCase(3, 0, 3),    // abc* de  f   g
      new TestCase(4, 4, 6),    // abc *de  f   g
      new TestCase(5, 4, 6),    // abc d*e  f   g
      new TestCase(6, 4, 6),    // abc de*  f   g
      new TestCase(7, 7, 7),    // abc de * f   g
      new TestCase(8, 8, 9),    // abc de  *f   g
      new TestCase(9, 8, 9),    // abc de  f*   g
      new TestCase(10, 10, 10), // abc de  f *  g
      new TestCase(11, 11, 11), // abc de  f  * g
      new TestCase(12, 12, 13), // abc de  f   *g
      new TestCase(13, 12, 13), // abc de  f    g*
      // Before the string.
      // TODO: Fix, should return empty range.
      new TestCase(-1, 0, 3),   // *|abc de  f   g
      // Past the end of string.
      // TODO: Fix, should return empty range.
      new TestCase(14, 12, 13), //   abc de  f   g|*
    ];
    for (let test_case of test_cases) {
      expect(
        TextHelper.getWordAtCursor(TEST_STRING, test_case.index)).to.eql(
        new TextRange(test_case.expected_start, test_case.expected_end),
        "Wrong result for index " + test_case.index);
    }
  });

  it('getWordBeforeCursor', function () {
    class TestCase {
      constructor(
        public readonly index: number,
        public readonly expected_start: number,
        public readonly expected_end: number) { }
    }
    const TEST_STRING = "abc de  f   g";
    const test_cases: Array<TestCase> = [
      new TestCase(0, 0, 3),    // *bc de  f   g
      new TestCase(1, 0, 3),    // a*c de  f   g
      new TestCase(2, 0, 3),    // ab* de  f   g
      new TestCase(3, 0, 3),    // abc*de  f   g
      new TestCase(4, 4, 6),    // abc *e  f   g
      new TestCase(5, 4, 6),    // abc d*  f   g
      new TestCase(6, 4, 6),    // abc de* f   g
      new TestCase(7, 4, 6),    // abc de *f   g
      new TestCase(8, 8, 9),    // abc de  *   g
      new TestCase(9, 8, 9),    // abc de  f*  g
      new TestCase(10, 8, 9),   // abc de  f * g
      new TestCase(11, 8, 9),   // abc de  f  *g
      new TestCase(12, 12, 13), // abc de  f   *
      new TestCase(13, 12, 13), // abc de  f   g*

      // Before the string.
      // TODO: Fix, should return empty range.
      new TestCase(-1, 0, 3),   // *|abc de  f   g
      // Past the end of string.
      // TODO: Fix, should return empty range.
      new TestCase(14, 12, 13), //   abc de  f   g|*
    ];
    for (let test_case of test_cases) {
      expect(
        TextHelper.getWordBeforeCursor(TEST_STRING, test_case.index)).to.eql(
        new TextRange(test_case.expected_start, test_case.expected_end),
        "Wrong result for index " + test_case.index);
    }
  });
});
