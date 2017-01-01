import { Position } from "../common";
import { CorrectionMenu, CorrectionCallback } from "../correction_menu";
import {DomElement, DomFactory} from "../view";

import chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;

class TestDomElement implements DomElement {
  public element: any;
  public children: Array<TestDomElement>;
  public className: string;
  public position: Position;
  public hidden: boolean;
  public text: string;
  public clickHandler: Function;
  constructor() {
    this.children = [];
    this.hidden = false;
  }
  appendChild(child: TestDomElement): void {
    this.children.push(child);
  }
  setClassName(name: string): void {
    this.className = name;
  }
  getClassName(): string {
    return this.className;
  }
  setPosition(pos: Position): void {
    this.position = pos;
  }
  hide(): void {
    this.hidden = true;
  }
  show(): void {
    this.hidden = false;
  }
  setText(text: string): void {
    this.text = text;
  }
  getText(): string {
    return this.text;
  }
  clear(): void {
    this.text = "";
    this.children = [];
  }
  setClickHandler(handler: any): void {
    this.clickHandler = handler;
  }
}

class TestDomFactory implements DomFactory {
  createDiv(): TestDomElement {
    return new TestDomElement();
  }
}

describe("Correction menu", function () {
  class TestCorrectionCallback implements CorrectionCallback {
    public called: boolean;
    onchange(text: string): void {
      this.called = true;
    }
  }

  function checkParent(parent: TestDomElement) {
    assert.equal(1, parent.children.length);
    assert.equal(2, parent.children[0].children.length);
    assert.equal("correction-menu-arrow", parent.children[0].children[0].getClassName());
    assert.equal("correction-menu-text", parent.children[0].children[1].getClassName());
  }

  function checkChildrenCountsOfChildren(parent: TestDomElement, expected: Array<number>) {
    assert.equal(expected.length, parent.children.length);
    let counts: Array<number> = [];
    for (let i = 0; i < parent.children.length; i++) {
      counts.push(parent.children[i].children.length);
    }
    expect(counts).to.eql(expected);
  }

  it("should not show non-existent corrections", function () {
    let callback = new TestCorrectionCallback();
    let domFactory = new TestDomFactory();
    let parent = domFactory.createDiv();
    let menu = new CorrectionMenu(parent, callback, domFactory);
    checkParent(parent);

    // .correction-menu-text is empty before show():
    assert.equal(0, parent.children[0].children[1].children.length);
    menu.show(new Position(0, 0), "wxyz");

    // .correction-menu-text has a div for each letter after show(), none of the
    // letters have corrections.
    checkChildrenCountsOfChildren(parent.children[0].children[1], [0, 0, 0, 0]);

    menu.show(new Position(0, 0), "agaclar");
    checkParent(parent);
    // .correction-menu-text has a div for each letter of "agaclar" after
    // show(), g and c have corrections.
    checkChildrenCountsOfChildren(
      parent.children[0].children[1], [0, 2, 0, 2, 0, 0, 0]);
  })
});
