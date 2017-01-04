import { Position } from "../common";
import { CorrectionMenu, CorrectionCallback } from "../correction_menu";
import { Keyboard, KeyboardCallback } from "../keyboard";
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
  public tabIndex: number;
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
  setTabIndex(index: number): void {
    this.tabIndex = index;
  }
}

class TestDomFactory implements DomFactory {
  createDiv(): TestDomElement {
    return new TestDomElement();
  }
}

describe("Correction menu", function () {
  class TestCorrectionCallback implements CorrectionCallback {
    public text: string;
    public onchange(text: string): void {
      this.text = text;
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

  it("should show corrections", function () {
    let callback = new TestCorrectionCallback();
    let domFactory = new TestDomFactory();
    let container = domFactory.createDiv();
    let menu = new CorrectionMenu(container, callback, domFactory);

    // Empty before show():
    assert.equal(0, container.children.length);

    // No corrections.
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

  it("should handle clicks", function () {
    let callback = new TestCorrectionCallback();
    let domFactory = new TestDomFactory();
    let container = domFactory.createDiv();
    let menu = new CorrectionMenu(container, callback, domFactory);

    menu.show(new Position(0, 0), "abcdefg");
    checkLayout(container);
    checkChildren(container.children[0], ["a", "b", "*c", "d", "e", "f", "*g"]);

    menu.view.onclick(0);
    assert.equal(null, callback.text);

    menu.view.onclick(1);
    assert.equal(null, callback.text);

    menu.view.onclick(2);
    assert.equal("abçdefg", callback.text);

    menu.view.onclick(6);
    assert.equal("abçdefğ", callback.text);

    menu.view.onclick(2);
    assert.equal("abcdefğ", callback.text);

    menu.view.onclick(6);
    assert.equal("abcdefg", callback.text);
  });
});

describe('Keyboard', function () {
  class TestKeyboardCallback implements KeyboardCallback {
    public key: string;
    onKey(key: string) {
      this.key = key;
    }
  };

  function checkLayout(container: TestDomElement, isCapsOn: boolean) {
    let rows = container.children[0].children;
    assert.equal(2, rows.length);
    assert.equal(3, rows[0].children.length);

    if (isCapsOn) {
      assert.equal("A", rows[0].children[0].getText());
      assert.equal("B", rows[0].children[1].getText());
      assert.equal("shift", rows[0].children[2].getText());

      assert.equal(2, rows[1].children.length);
      assert.equal("d", rows[1].children[0].getText());
      assert.equal("?", rows[1].children[1].getText());
    } else {
      assert.equal("a", rows[0].children[0].getText());
      assert.equal("b", rows[0].children[1].getText());
      assert.equal("shift", rows[0].children[2].getText());

      assert.equal(2, rows[1].children.length);
      assert.equal("d", rows[1].children[0].getText());
      assert.equal("?", rows[1].children[1].getText());
    }
  }

  let callback = new TestKeyboardCallback();
  let domFactory = new TestDomFactory();
  let container = domFactory.createDiv();
  let layout: Array<Array<string>> = [
    ["a,A", "(b,B)", "[shift]"],
    ["d", "?"]
  ];
  let keyboard: Keyboard = undefined;

  beforeEach(function () {
    keyboard = new Keyboard(layout, container, domFactory);
    keyboard.create(callback);

    assert.equal("mea-keyboard-main", container.getClassName());
    assert.equal(1, container.children.length);
    assert.equal("mea-keyboard-layout", container.children[0].getClassName());
  });

  it('caps lock', function () {
    checkLayout(container, false);

    // Turn on caps lock.
    keyboard.onKey("caps");
    checkLayout(container, true);

    // Type a character. Caps should stay on.
    keyboard.onKey("a");
    checkLayout(container, true);

    // Turn off caps lock.
    keyboard.onKey("caps");
    checkLayout(container, false);
  });

  it('shift', function () {
    // Turn shift on.
    keyboard.onKey("shift");
    checkLayout(container, true);

    // Type a character. Caps should turn off.
    keyboard.onKey("a");
    checkLayout(container, false);
  });

  it('caps lock then shift', function () {
    // Turn on caps lock and shift, caps lock should turn off.
    keyboard.onKey("caps");
    keyboard.onKey("shift");
    checkLayout(container, false);

    // Type a character. Caps should turn on because shift turns off.
    keyboard.onKey("b");
    checkLayout(container, true);

    // Turn off caps lock.
    keyboard.onKey("caps");
    checkLayout(container, false);
  });

  it('shift then caps lock', function () {
    // Turn on caps lock and shift, caps lock should turn off.
    keyboard.onKey("shift");
    keyboard.onKey("caps");
    checkLayout(container, false);

    // Type a character. Caps should turn on because shift turns off.
    keyboard.onKey("b");
    checkLayout(container, true);

    // Turn off caps lock.
    keyboard.onKey("caps");
    checkLayout(container, false);
  });
});
