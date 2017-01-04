import { DomElement, DomFactory } from "./view"

const SPECIAL_KEY_TEXTS: { [key: string]: string } = {
  "tab": "tab",
  "backspace": "\u2190",
  "caps": "caps",
  "enter": "enter",
  "shift": "shift",
  "space": "",
};

export interface KeyboardCallback {
  onKey(text: string): void;
}

function createButton(
  text: string,
  value: string,
  callback: KeyboardCallback,
  domFactory: DomFactory): DomElement {
  let btn = domFactory.createDiv();
  btn.setText(text);
  btn.setClickHandler(function () {
    callback.onKey(value);
  });
  return btn;
}

function createKeyRow(
  keys: Array<any>,
  callback: KeyboardCallback,
  toggledKeys: { [key: string]: boolean },
  domFactory: DomFactory): DomElement {

  let row = domFactory.createDiv();
  row.setClassName("mea-keyboard-key-row");

  let displayCaps = toggledKeys["caps"] !== toggledKeys["shift"];

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let cell: DomElement = null;
    let classNames: Array<string> = ["mea-keyboard-key"];

    if (key[0] == "[") {
      // Special key.
      key = key.substring(1, key.length - 1);
      cell = createButton(SPECIAL_KEY_TEXTS[key], key, callback, domFactory);
      classNames.push("mea-keyboard-special-key");
    } else {
      // Normal key.
      if (key[0] == '(') {
        // Styled.
        key = key.substring(1, key.length - 1);
        classNames.push("mea-keyboard-key-emphasized");
      }
      if (key.length > 1 && key.indexOf(",") > 0) {
        // Letter key with capital.
        let capsOffKey = key.split(",")[0];
        let capsOnKey = key.split(",")[1];
        if (displayCaps)
          cell = createButton(capsOnKey, capsOnKey, callback, domFactory);
        else
          cell = createButton(capsOffKey, capsOffKey, callback, domFactory);
      } else {
        // No capital letter (e.g. punctuation).
        cell = createButton(key, key, callback, domFactory);
      }
    }
    if (i == keys.length - 1) {
      classNames.push("mea-keyboard-key-last");
    }
    if (toggledKeys[key]) {
      classNames.push("mea-keyboard-key-active");
    }
    cell.setTabIndex(1);
    cell.setClassName(classNames.join(" "));
    row.appendChild(cell);
  }
  return row;
}

function createDOM(
  container: DomElement,
  keys: Array<Array<string>>,
  callback: KeyboardCallback,
  toggledKeys: { [key: string]: boolean },
  domFactory: DomFactory): void {
  container.clear();
  container.setClassName("mea-keyboard-main");

  let layoutContainer = domFactory.createDiv();
  layoutContainer.setClassName("mea-keyboard-layout");

  for (let i = 0; i < keys.length; i++) {
    layoutContainer.appendChild(
      createKeyRow(keys[i], callback, toggledKeys, domFactory));
  }
  container.appendChild(layoutContainer);
}

export class Keyboard implements KeyboardCallback {
  private callback: KeyboardCallback;
  private toggledKeys: { [key: string]: boolean } = {
    "caps": false,
    "shift": false
  }

  constructor(
    private keyLayout: Array<Array<string>>,
    private container: DomElement,
    private domFactory: DomFactory) {
  }

  // KeyboardCallback method:
  onKey(text: string): void {
    switch (text) {
      case "enter":
        this.callback.onKey("\n");
        return;
      case "space":
        this.callback.onKey(" ");
        return;
      case "tab":
        this.callback.onKey("\t");
        return;
      case "caps":
        this.toggleCaps();
        return;
      case "shift":
        this.toggleShift();
        return;
    }
    if (this.toggledKeys["shift"]) {
      this.toggleShift();
    }
    this.callback.onKey(text);
  }

  create(callback: KeyboardCallback) {
    this.callback = callback;
    createDOM(
      this.container, this.keyLayout,
      this, this.toggledKeys, this.domFactory);
  }

  toggleCaps() {
    this.toggledKeys["caps"] = !this.toggledKeys["caps"];
    createDOM(
      this.container,
      this.keyLayout,
      this, this.toggledKeys, this.domFactory);
  }
  toggleShift() {
    this.toggledKeys["shift"] = !this.toggledKeys["shift"];
    createDOM(
      this.container,
      this.keyLayout,
      this, this.toggledKeys, this.domFactory);
  }

  show() {
    if (this.container) {
      this.container.show();
    }
  }

  hide() {
    if (this.container) {
      this.container.hide();
    }
  }
}
