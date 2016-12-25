//// <reference path="../common.ts" />

import { TextRange } from '../common';
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

    // Empty text range.
    result = asciifier.processRange(testdata.TEST_DATA[0].deasciified, <TextRange>{ start: 0, end: 0 }, null);
    expect(result.changedPositions).to.eql([]);
    assert.equal("", result.text);

    // First character of text "T\u00FCrk\u00E7e".
    result = asciifier.processRange(testdata.TEST_DATA[0].deasciified, <TextRange>{ start: 0, end: 1 }, null);
    expect(result.changedPositions).to.eql([]);
    assert.equal("T", result.text);

    // First two character of text is "T\u00FCrk\u00E7e".
    result = asciifier.processRange(testdata.TEST_DATA[0].deasciified, <TextRange>{ start: 0, end: 2 }, null);
    expect(result.changedPositions).to.eql([1]);
    assert.equal("Tu", result.text);

    // All characters of text "T\u00FCrk\u00E7e".
    result = asciifier.processRange(testdata.TEST_DATA[0].deasciified, <TextRange>{ start: 0, end: 6 }, null);
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
});
