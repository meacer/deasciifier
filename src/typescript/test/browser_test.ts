import { App } from '../app';

import codemirror = require('codemirror');

import chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;

const PATTERNS = {
  'c': 'aXa|-bXb|-aX|-Xa',
  'g': 'aXa|-bX|-Xb',
  'i': 'Xk'
};

describe('App', function () {
  let textarea = document.createElement("textarea");
  document.body.appendChild(textarea);

  let cm = codemirror.fromTextArea(textarea);
  let div = document.createElement("div");
  let app = new App(cm, PATTERNS, div);

  it('should asciify', function () {
    cm.setValue("Ağaça çıktık");
    app.asciifySelection();
    assert.equal("Agaca ciktik", cm.getValue());
  });

  it('should asciify selection', function () {
    class TestCase {
      constructor(
        public readonly selection_start: number,
        public readonly selection_end: number,
        public readonly expected_text: string) { }
    }
    const TEST_CASES: Array<TestCase> = [
      // Empty selection:
      new TestCase(0, 0, "Agaca ciktik"),
      // Oversized selection:
      new TestCase(0, 100, "Agaca ciktik"),
      // First character:
      new TestCase(0, 1, "Ağaça çıktık"),
      // Second character:
      new TestCase(1, 2, "Agaça çıktık"),
      // First two characters:
      new TestCase(0, 2, "Agaça çıktık"),
      // First three characters:
      new TestCase(0, 3, "Agaça çıktık"),
      // First four characters:
      new TestCase(0, 4, "Agaca çıktık"),
    ];
    for (let test_case of TEST_CASES) {
      cm.setValue("Ağaça çıktık");
      cm.getDoc().setSelection(
        { line: 0, ch: test_case.selection_start },
        { line: 0, ch: test_case.selection_end });
      app.asciifySelection();
      assert.equal(test_case.expected_text, cm.getValue(),
        `Wrong result for
        start: ${test_case.selection_start},
        end: ${test_case.selection_end}`);
    }
  });

  it('should deasciify', function () {
    cm.setValue("Agaca ciktik");
    app.deasciifySelection();
    assert.equal("Ağaça çıktık", cm.getValue());
  });

  it('should deasciify selection', function () {
    class TestCase {
      constructor(
        public readonly selection_start: number,
        public readonly selection_end: number,
        public readonly expected_text: string) { }
    }
    const TEST_CASES: Array<TestCase> = [
      // Empty selection:
      new TestCase(0, 0, "Ağaça çıktık"),
      // Oversized selection:
      new TestCase(0, 100, "Ağaça çıktık"),
      // First character:
      new TestCase(0, 1, "Agaca ciktik"),
      // Second character:
      new TestCase(1, 2, "Ağaca ciktik"),
      // First two characters:
      new TestCase(0, 2, "Ağaca ciktik"),
      // First three characters:
      new TestCase(0, 3, "Ağaca ciktik"),
      // First four characters:
      new TestCase(0, 4, "Ağaça ciktik"),
    ];
    for (let test_case of TEST_CASES) {
      cm.setValue("Agaca ciktik");
      cm.getDoc().setSelection(
        { line: 0, ch: test_case.selection_start },
        { line: 0, ch: test_case.selection_end });
      app.deasciifySelection();
      assert.equal(test_case.expected_text, cm.getValue(),
        `Wrong result for
        start: ${test_case.selection_start},
        end: ${test_case.selection_end}`);
    }
  });
});
