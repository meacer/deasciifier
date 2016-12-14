namespace deasciifier {

  const TR_c = '_\u00E7';
  const TR_C = '_\u00C7';
  const TR_g = '_\u011F';
  const TR_G = '_\u011E';
  const TR_i = '_\u0131';
  const TR_I = '_\u0130';
  const TR_o = '_\u00F6';
  const TR_O = '_\u00D6';
  const TR_s = '_\u015F';
  const TR_S = '_\u015E';
  const TR_u = '_\u00FC';
  const TR_U = '_\u00DC';
  const CIRC_a = "\u00E2"; /* a circumflex */
  const CIRC_e = "\u00EA"; /* e circumflex */
  const CIRC_i = "\u00EE"; /* i circumflex */
  const CIRC_o = "\u00F4"; /* o circumflex */
  const CIRC_u = "\u00FB"; /* u circumflex */
  const CIRC_A = "\u00C2"; /* A circumflex */
  const CIRC_E = "\u00CA"; /* E circumflex */
  const CIRC_I = "\u00CE"; /* I circumflex */
  const CIRC_O = "\u00D4"; /* O circumflex */
  const CIRC_U = "\u00DB"; /* U circumflex */

  enum KeyboardKey {
    TAB,
    BACKSPACE,
    CAPS_LOCK,
    ENTER,
    SHIFT,
    SPACE
  }

  interface KeyRow {
    keys: Array<string>;
  }

  interface KeyMap {
    capsOn: Array<KeyRow>;
    capsOff: Array<KeyRow>;
  }

  interface Layout {
    id: string;
    name: string;
    keyMap: KeyMap;
  }

  interface Key {
    type: KeyType;
    value: string;
  }

  const SPECIAL_KEY_TEXTS: { [key: string]: string } = {
    "tab": "tab",
    "backspace": "\u2190",
    "caps": "caps",
    "enter": "enter",
    "shift": "shift",
    "space": "",
  };

  const KeyboardLayout = {
    TR_Q: {
      id: "TR_Q",
      name: "T\u00FCrk\u00E7e Q",
      keys: {
        capsOff: [
          // The keyboard layout. Letters that start with underscore are shown
          // in bold. Keys
          // that are longer than 1 character but do not start with an
          // underscore are special keys
          // and they should have an entry in specialKeys map
          [
            "tab", "q", "w", "e", "r", "t", "y", "u", TR_i, "o", "p",
            TR_g, TR_u, ";", "backspace"
          ],
          [
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l",
            TR_s, "_i", ":", "enter"
          ],
          [
            "shift", "z", "x", "c", "v", "b", "n", "m",
            TR_o, TR_c, ",", ".", "shift"
          ],
          [CIRC_a, CIRC_e, CIRC_i, "space", CIRC_o, CIRC_u]
        ],
        capsOn: [
          [
            "tab", "Q", "W", "E", "R", "T", "Y", "U", "_I", "O", "P",
            TR_G, TR_U, ";", "backspace"
          ],
          [
            "caps", "A", "S", "D", "F", "G", "H", "J", "K", "L",
            TR_S, TR_I, ":", "enter"
          ],
          [
            "shift", "Z", "X", "C", "V", "B", "N", "M",
            TR_O, TR_C, ",", ".", "shift"
          ],
          [CIRC_A, CIRC_E, CIRC_I, "space", CIRC_O, CIRC_U]
        ]
      }
    },

    TR_F: {
      id: "TR_F",
      name: "T\u00FCrk\u00E7e F",
      keys: {
        capsOff: [
          // The keyboard layout. Letters that start with underscore are shown
          // in bold. Keys
          // that are longer than 1 character but do not start with an
          // underscore are special keys
          // and they should have an entry in specialKeys map
          [
            "tab", "f", "g", TR_g, TR_i, "o", "d", "r",
            "n", "h", "p", "q", "w", "x", "backspace"
          ],
          [
            "caps", "u", "_i", "e", "a", TR_u, "t", "k",
            "m", "l", "y", TR_s, ":", "enter"
          ],
          [
            "shift_l", "j", TR_o, "v", "c", TR_c, "z", "s",
            "b", ",", ".", ";", "shift_r"
          ],
          [CIRC_a, CIRC_e, CIRC_i, CIRC_o, CIRC_u, "space"]
        ],
        capsOn: [
          [
            "tab", "F", "G", TR_G, "_I", "O", "D", "R",
            "N", "H", "P", "Q", "W", "X", "backspace"
          ],
          [
            "caps", "U", TR_I, "E", "A", TR_U, "T", "K",
            "M", "L", "Y", TR_S, ":", "enter"
          ],
          [
            "shift_l", "J", TR_O, "V", "C", TR_C, "Z",
            "S", "B", ",", ".", ";", "shift_r"
          ],
          [CIRC_A, CIRC_E, CIRC_I, CIRC_O, CIRC_U, "space"]
        ]
      }
    }
  };

  export interface KeyboardCallback {
    onKey(text: string): void;
  }

  function createButton(
    text: string, value: string, callback: KeyboardCallback): HTMLDivElement {
    var btn = document.createElement("div");
    btn.textContent = text;
    btn.onclick = function () {
      callback.onKey(value);
    }
    return btn;
  }

  function createKey(
    text: string, value: string, is_special: boolean,
    callback: KeyboardCallback): HTMLDivElement {
    if (!is_special) {
      // Letter key.
      return createButton(text, value, callback);
    }
    // Special key:
    text = SPECIAL_KEY_TEXTS[value];
    var btn = createButton(text, value, callback);
    btn.className += " mea-keyboard-special-key";
    return btn;
  }

  function createKeyRow(keys: Array<any>, callback: KeyboardCallback,
    toggledKeys: { [key: string]: boolean }) {

    let row = document.createElement("div");
    row.className = "mea-keyboard-key-row";

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let cell: HTMLDivElement = null;

      if (key.length == 1 ||
        (key.length > 1 && key.charAt(0) == "_")) {
        // Letter key:
        let isSpecialLetter = (key.length > 1 && key.charAt(0) == "_");
        let text = (isSpecialLetter) ? key.substring(1) : key;
        cell = createKey(text, text, false, callback);
        if (isSpecialLetter) {
          cell.className += " mea-keyboard-key-emphasized";
        }
      } else {
        // Special key:
        cell = createKey(null, key, true, callback);
        if (i == keys.length - 1) {
          cell.className += " mea-keyboard-key-last";
        }
      }
      cell.className += " mea-keyboard-key";
      if (key == "caps" && toggledKeys[key]) {
        cell.className += " mea-keyboard-key-active";
      } else if (key == "shift_l" && toggledKeys[key]) {
        cell.className += " mea-keyboard-key-active";
      }
      cell.tabIndex = 1;
      row.appendChild(cell);
    }
    return row;
  }

  function createKeyTable(
    keys, callback: KeyboardCallback,
    toggledKeys: { [key: string]: boolean }) {

    let table = document.createElement("div");
    for (let i = 0; i < keys.length; i++) {
      table.appendChild(createKeyRow(keys[i], callback, toggledKeys));


    }
    table.className = "mea-keyboard-btn-table";
    return table;
  }

  function createKeyLayout(
    layoutContainer: HTMLDivElement, keyMap, callback: KeyboardCallback,
    toggledKeys: { [key: string]: boolean }) {
    layoutContainer.innerHTML = "";

    var table = createKeyTable(keyMap, callback, toggledKeys);
    let container = document.createElement("div");
    container.appendChild(table);

    layoutContainer.appendChild(container);
  }

  function createDOM(
    container: HTMLDivElement, caps: boolean, callback: KeyboardCallback,
    toggledKeys: { [key: string]: boolean }): void {
    container.innerHTML = "";
    container.className = "mea-keyboard-main";

    let layoutContainer = document.createElement("div");
    createKeyLayout(layoutContainer,
      caps ? KeyboardLayout.TR_Q.keys.capsOn : KeyboardLayout.TR_Q.keys.capsOff,
      callback, toggledKeys);
    layoutContainer.className = "mea-keyboard-layout";

    container.appendChild(layoutContainer);
  }

  export class Keyboard implements KeyboardCallback {
    private callback: KeyboardCallback;
    private currentLayout = KeyboardLayout.TR_Q;
    private capsLockOnContainer: HTMLDivElement = null;
    private capsLockOffContainer: HTMLDivElement = null;
    private toggledKeys: { [key: string]: boolean } = {
      "caps": false,
      "shift": false
    }

    constructor(private container: HTMLDivElement) {
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
          this.toggledKeys["caps"] = !this.toggledKeys["caps"];
          this.toggleCaps();
          return;
        case "shift_l":
        case "shift_r":
          this.toggledKeys["shift"] = !this.toggledKeys["shift"];
          this.toggleCaps();
          return;
      }
      if (this.toggledKeys["shift"]) {
        this.toggledKeys["shift"] = false;
        this.toggleCaps();
      }
      this.callback.onKey(text);
    }

    create(callback: KeyboardCallback) {
      this.callback = callback;
      createDOM(
        this.container, this.toggledKeys["caps"], this, this.toggledKeys);
    }

    toggleCaps() {
      createDOM(
        this.container,
        this.toggledKeys["caps"] !== this.toggledKeys["shift"],
        this, this.toggledKeys);
    }

    show() {
      if (this.container) {
        this.container.style.display = "block";
      }
    }

    hide() {
      if (this.container) {
        this.container.style.display = "none";
      }
    }
  }

}