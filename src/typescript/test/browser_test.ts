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
    cm.setValue("Agaca ciktik");
    app.deasciifySelection();
    assert.equal("Ağaça çıktık", cm.getValue());
  });
});
