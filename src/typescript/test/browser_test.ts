import { App } from '../app';

// These tests are run with karma.

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

  let keyboardContainer = document.createElement("div");
  document.body.appendChild(keyboardContainer);

  let cm = codemirror.fromTextArea(textarea);
  let app = new App(cm, PATTERNS, document.body, keyboardContainer);

  beforeEach(function () {
    cm.getDoc().setValue("");
  });

  function checkHighlights(expected: number[]) {
    let marks: codemirror.TextMarker[] = cm.getDoc().getAllMarks();
    assert.equal(expected.length, marks.length);
    for (let i = 0; i < expected.length; i++) {
      expect({
        from: { line: 0, ch: expected[i], sticky: null },
        to: { line: 0, ch: expected[i] + 1, sticky: null }
      }).to.eql(marks[i].find());
    }
  }

  it('should asciify', function () {
    cm.setValue("Ağaça çıktık");
    let result = app.asciifySelection();
    assert.equal("Agaca ciktik", cm.getValue());
    checkHighlights([1, 3, 6, 7, 10]);
    expect(result.text).to.eql("Agaca ciktik");
    expect(result.changedPositions).to.eql([ 1, 3, 6, 7, 10 ]);
  });

  it('should asciify selection', function () {
    class TestCase {
      constructor(
        public readonly selection_start: number,
        public readonly selection_end: number,
        public readonly expected_text: string,
        public readonly expected_highlights: number[]) { }
    }
    const TEST_CASES: Array<TestCase> = [
      // Empty selection:
      new TestCase(0, 0, "Agaca ciktik", [1, 3, 6, 7, 10]),
      // Oversized selection:
      new TestCase(0, 100, "Agaca ciktik", [1, 3, 6, 7, 10]),
      // First character:
      new TestCase(0, 1, "Ağaça çıktık", []),
      // Second character:
      new TestCase(1, 2, "Agaça çıktık", [1]),
      // First two characters:
      new TestCase(0, 2, "Agaça çıktık", [1]),
      // First three characters:
      new TestCase(0, 3, "Agaça çıktık", [1]),
      // First four characters:
      new TestCase(0, 4, "Agaca çıktık", [1, 3]),
    ];
    for (let test_case of TEST_CASES) {
      cm.setValue("Ağaça çıktık");
      cm.getDoc().setSelection(
        { line: 0, ch: test_case.selection_start },
        { line: 0, ch: test_case.selection_end });
      let result = app.asciifySelection();
      expect(result.text).to.eql(test_case.expected_text);
      expect(result.changedPositions).to.eql(test_case.expected_highlights);

      assert.equal(test_case.expected_text, cm.getValue(),
        `Wrong result for
        start: ${test_case.selection_start},
        end: ${test_case.selection_end}`);
      checkHighlights(test_case.expected_highlights);
    }
  });

  it('should deasciify', function () {
    cm.setValue("Agaca ciktik");
    let result = app.deasciifySelection();
    expect(cm.getValue()).to.eql("Ağaça çıktık");
    expect(result.text).to.eql("Ağaça çıktık");
    expect(result.changedPositions).to.eql([ 1, 3, 6, 7, 10 ]);
  });

  it('should deasciify selection', function () {
    class TestCase {
      constructor(
        public readonly selection_start: number,
        public readonly selection_end: number,
        public readonly expected_text: string,
        public readonly expected_highlights: number[]) { }
    }
    const TEST_CASES: Array<TestCase> = [
      // Empty selection:
      new TestCase(0, 0, "Ağaça çıktık", [1, 3, 6, 7, 10]),
      // Oversized selection:
      new TestCase(0, 100, "Ağaça çıktık", [1, 3, 6, 7, 10]),
      // First character:
      new TestCase(0, 1, "Agaca ciktik", []),
      // Second character:
      new TestCase(1, 2, "Ağaca ciktik", [1]),
      // First two characters:
      new TestCase(0, 2, "Ağaca ciktik", [1]),
      // First three characters:
      new TestCase(0, 3, "Ağaca ciktik", [1]),
      // First four characters:
      new TestCase(0, 4, "Ağaça ciktik", [1, 3]),
    ];
    for (let test_case of TEST_CASES) {
      cm.setValue("Agaca ciktik");
      cm.getDoc().setSelection(
        { line: 0, ch: test_case.selection_start },
        { line: 0, ch: test_case.selection_end });
      let result = app.deasciifySelection();
      expect(result.text).to.eql(test_case.expected_text);
      expect(result.changedPositions).to.eql(test_case.expected_highlights);

      assert.equal(test_case.expected_text, cm.getValue(),
        `Wrong result for
        start: ${test_case.selection_start},
        end: ${test_case.selection_end}`);
      checkHighlights(test_case.expected_highlights);
    }
  });

  function putChar(text: string, index: number) {
    assert.equal(1, text.length);
    let pos = cm.getDoc().posFromIndex(index);
    cm.getDoc().replaceRange(text, pos);

    let new_pos = cm.getDoc().posFromIndex(index + text.length);
    cm.getDoc().setSelection(new_pos, null);
    app.onKeyUp(text.charAt(0));
  }

  function putString(text: string, index: number = -1) {
    if (index == -1) {
      index = cm.getDoc().getValue().length;
    }
    for (let i = 0; i < text.length; i++) {
      putChar(text.charAt(i), index + i);
    }
  }

  it('should deasciify word before cursor', function () {
    putString("Agaca");
    assert.equal("Agaca", cm.getValue());
    checkHighlights([]);

    putString(" ");
    assert.equal("Ağaça ", cm.getValue());
    checkHighlights([1, 3]);

    // Should only deasciify the last word.
    cm.setValue("Agaca ");
    putString("ciktik ");
    assert.equal("Agaca çıktık ", cm.getValue());
    checkHighlights([6, 7, 10]);
  });

  it('should not deasciify word after cursor', function () {
    // Type a space character between two words. Only first word should be
    // deasciifed.
    cm.setValue("Agacaciktik");
    // Put cursor after the first word.
    putString(" ", 5);
    assert.equal("Ağaça ciktik", cm.getValue());
    checkHighlights([1, 3]);

    putString("hizla", 6);
    assert.equal("Ağaça hizlaciktik", cm.getValue());
    checkHighlights([1, 3]);

    putString(" ", 11);
    assert.equal("Ağaça hızla ciktik", cm.getValue());
    // TODO: Fix. The previous highlights are removed.
    //checkHighlights([1, 3, 7]);

    putString(".", 12);
    assert.equal("Ağaça hızla .ciktik", cm.getValue());

    putString("!", 19);
    assert.equal("Ağaça hızla .çıktık!", cm.getValue());
    // TODO: Fix. The previous highlights are removed.
    //checkHighlights([1, 3, 7, 12, 13, 16]);
  });
});
