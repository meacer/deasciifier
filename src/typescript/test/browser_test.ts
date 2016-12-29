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
    cm.setValue("Ağaça çıktık");
    cm.getDoc().setSelection({ line: 0, ch: 0 }, { line: 0, ch: 3 });
    app.asciifySelection();
    assert.equal("Agaça çıktık", cm.getValue());

    cm.getDoc().setSelection({ line: 0, ch: 0 }, { line: 0, ch: 4 });
    app.asciifySelection();
    assert.equal("Agaca çıktık", cm.getValue());
  });

  it('should deasciify', function () {
    cm.setValue("Agaca ciktik");
    app.deasciifySelection();
    assert.equal("Ağaça çıktık", cm.getValue());
  });

  it('should deasciify selection', function () {
    cm.setValue("Agaca ciktik");
    cm.getDoc().setSelection({ line: 0, ch: 0 }, { line: 0, ch: 3 });
    app.deasciifySelection();
    assert.equal("Ağaca ciktik", cm.getValue());

    cm.getDoc().setSelection({ line: 0, ch: 0 }, { line: 0, ch: 4 });
    app.deasciifySelection();
    assert.equal("Ağaça ciktik", cm.getValue());
  });
});
