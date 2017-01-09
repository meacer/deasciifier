import { App } from '../app';

import protractor = require('protractor');
import codemirror = require('codemirror');

import chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;
let browser = protractor.browser;
let element = protractor.element;
let by = protractor.by;

const PATTERNS = {
  'c': 'aXa|-bXb|-aX|-Xa',
  'g': 'aXa|-bX|-Xb',
  'i': 'Xk'
};

// Do not wait for Angular.
browser.ignoreSynchronization = true;

describe('App', function () {
  beforeEach(function() {
    //browser.ignoreSynchronization = true;
    browser.get("/interactive_test/test_runner.html", 60000);
  });

  it('should test', function() {
    //browser.ignoreSynchronization = true;
    browser.executeScript(`
      document.title='test';
      //var cm = CodeMirror(document.body);
      var txt = document.createElement("textarea");
      document.body.appendChild(txt);
      var editor = CodeMirror.fromTextArea(document.getElementById("txt"), {
        lineNumbers: false,
        viewportMargin: Infinity,
        lineWrapping: true,
        minHeight: 900,
        height: "dynamic",
        autofocus: true
      });
      //var cm = CodeMirror(document.body, {
      //value: "function myScript(){return 100;}\n",
      //mode:  "javascript"
      //});
      */
    `);
/*
    let textarea = document.createElement("textarea");
    textarea.id = "txt";
    document.body.appendChild(textarea);

    let cm = codemirror.fromTextArea(textarea);
    let div = document.createElement("div");
    let app = new App(cm, PATTERNS, div);
*/

/*

    element(by.id("txt")).sendKeys("this is a test");
  assert.equal("tasdasldkj ", cm.getValue());*/

    //element(by.model('todoList.todoText')).sendKeys('write first protractor test');
    //element(by.css('[value="add"]')).click();

    //var todoList = element.all(by.repeater('todo in todoList.todos'));
    //expect(todoList.count()).toEqual(3);
    //expect(todoList.get(2).getText()).toEqual('write first protractor test');

    // You wrote your first test, cross it off the list
    /*todoList.get(2).element(by.css('input')).click();
    var completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2);
    */
  });
});
