import { Position } from "../common";
import { CorrectionMenu, CorrectionCallback } from "../correction_menu";
import { DomElement, DomFactory } from "../view";

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

  function checkLayout(element: TestDomElement) {
    assert.equal(1, element.children.length);
    assert.equal("correction-menu-text", element.children[0].getClassName());
  }

  function checkChildren(parent: TestDomElement, expected: Array<string>) {
    assert.equal(expected.length, parent.children.length);
    let children: Array<string> = [];
    for (let child of parent.children) {
      let entry =
        (child.getClassName().indexOf("-alternative") >= 0) ?
          "*" + child.getText() : child.getText();
      children.push(entry);
    }
    expect(children).to.eql(expected);
  }

  it("should not show non-existent corrections", function () {
    let callback = new TestCorrectionCallback();
    let domFactory = new TestDomFactory();
    let container = domFactory.createDiv();
    let menu = new CorrectionMenu(container, callback, domFactory);

    // Empty before show():
    assert.equal(0, container.children.length);

    // None of the letters has corrections.
    menu.show(new Position(0, 0), "wxyz");
    checkLayout(container);
    checkChildren(container.children[0], ["w", "x", "y", "z"]);

    // Two of the letters have corrections.
    menu.show(new Position(0, 0), "abcdefg");
    checkLayout(container);
    checkChildren(container.children[0], ["a", "b", "*c", "d", "e", "f", "*g"]);

    // All letters have corrections.
    menu.show(new Position(0, 0), "cgiosu");
    checkLayout(container);
    checkChildren(container.children[0], ["*c", "*g", "*i", "*o", "*s", "*u"]);
  })
});
