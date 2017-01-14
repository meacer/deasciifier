import protractor = require('protractor');

import chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;
let browser = protractor.browser;
let element = protractor.element;
let by = protractor.by;

/*
const PATTERNS = {
  'c': 'aXa|-bXb|-aX|-Xa',
  'g': 'aXa|-bX|-Xb',
  'i': 'Xk'
};*/

describe('App', function () {

  it('should test', function (done) {
    console.log("Testing...");
    browser.ignoreSynchronization = true;

    browser.driver.get(browser.baseUrl + "/interactive_test/test_runner.html");

    /*browser.driver.findElement(by.id("txt")).sendKeys("this is aca test").then(function () {
      console.log("Sent keys");
    });*/

    browser.driver.executeScript("editor.setValue('this is aca test')");
    /*browser.driver.findElement(by.className("CodeMirror")).sendKeys("this is aca test").then(function () {
      console.log("CM SEND KEYS");
     });*/

    /*browser.driver.findElement(by.id("txt")).getAttribute('value').then(function (value) {
      console.log("PROMISE BEFORE");
      console.log(value);
      console.log("PROMISE AFTER");
    });
    */
    browser.driver.findElement(by.className("CodeMirror")).getText().then(function (value) {
      console.log("CM TEXT", value);
    });
    done();
  });
});
