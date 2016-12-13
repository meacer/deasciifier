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


  interface SpecialKey {
    text: string;
    tooltip: string;
    value: KeyboardKey;
  }

  const SPECIAL_KEYS: { [key: string]: SpecialKey } = {
    "tab": <SpecialKey>{
      text: "Tab",
      tooltip: "tab",
      value: KeyboardKey.TAB
    },
    "backspace": <SpecialKey>{
      text: "\u2190",
      tooltip: "Backspace",
      value: KeyboardKey.BACKSPACE
    },
    "caps": <SpecialKey>{
      text: "Caps",
      tooltip: "Caps lock",
      value: KeyboardKey.CAPS_LOCK
    },
    "enter": <SpecialKey>{
      text: "Enter",
      tooltip: "Enter",
      value: KeyboardKey.ENTER
    },
    "shift_l": <SpecialKey>{
      text: "Shift",
      tooltip: "Shift",
      value: KeyboardKey.SHIFT
    },
    "shift_r": <SpecialKey>{
      text: "Shift",
      tooltip: "Shift",
      value: KeyboardKey.SHIFT
    },
    "space": <SpecialKey>{
      text: "",
      tooltip: "Space Bar",
      value: KeyboardKey.SPACE
    },
    "empty": <SpecialKey>{
      text: null,
      tooltip: null,
      value: null
    }
  };

  const KeyboardLayout = {
    /*specialKeys: {
      "tab": {
        text: "Tab",
        tooltip: "Tab",
        style: { 'width': '32px', 'textAlign': 'left' },
        callback: onTabPressed
      },
      "backspace": {
        text: "\u2190",
        tooltip: "Backspace",
        style: { 'width': '25px', 'textAlign': 'right' },
        callback: onBackspacePressed
      },
      "caps": {
        text: "Caps",
        tooltip: "Caps Lock",
        style: { 'width': '42px', 'textAlign': 'left' },
        callback: onCapsLockPressed
      },
      "enter": {
        text: "Enter",
        tooltip: "Enter",
        style: { 'width': '42px', 'textAlign': 'right' },
        callback: onEnterPressed
      },
      "shift_l": {
        text: "Shift",
        tooltip: "Shift",
        style: { 'width': '55px', 'textAlign': 'left' },
        callback: onShiftPressed
      },
      "shift_r": {
        text: "Shift",
        tooltip: "Shift",
        style: { 'width': '55px', 'textAlign': 'right' },
        callback: onShiftPressed
      },  // TODO: if shift is toggled, change button style
      "space": {
        text: "",
        tooltip: "Space Bar",
        style: { 'width': '140px' },
        callback: onSpaceBarPressed
      },
      "empty": {
        style: { 'visibility': 'hidden', 'display': 'block', 'width': '100px' }
      }
    },*/

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
            "shift_l", "z", "x", "c", "v", "b", "n", "m",
            TR_o, TR_c, ",", ".", "shift_r"
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
            "shift_l", "Z", "X", "C", "V", "B", "N", "M",
            TR_O, TR_C, ",", ".", "shift_r"
          ],
          [CIRC_A, CIRC_E, CIRC_I, CIRC_O, CIRC_U, "space"]
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
            "tab",
            "f",
            "g",
            TR_g,
            TR_i,
            "o",
            "d",
            "r",
            "n",
            "h",
            "p",
            "q",
            "w",
            "x",
            "backspace"
          ],
          [
            "caps",
            "u",
            "_i",
            "e",
            "a",
            TR_u,
            "t",
            "k",
            "m",
            "l",
            "y",
            TR_s,
            ":",
            "enter"
          ],
          [
            "shift_l",
            "j",
            TR_o,
            "v",
            "c",
            TR_c,
            "z",
            "s",
            "b",
            ",",
            ".",
            ";",
            "shift_r"
          ],
          [CIRC_a, CIRC_e, CIRC_i, CIRC_o, CIRC_u, "space"]
        ],
        capsOn: [
          [
            "tab",
            "F",
            "G",
            TR_G,
            "_I",
            "O",
            "D",
            "R",
            "N",
            "H",
            "P",
            "Q",
            "W",
            "X",
            "backspace"
          ],
          [
            "caps",
            "U",
            TR_I,
            "E",
            "A",
            TR_U,
            "T",
            "K",
            "M",
            "L",
            "Y",
            TR_S,
            ":",
            "enter"
          ],
          [
            "shift_l",
            "J",
            TR_O,
            "V",
            "C",
            TR_C,
            "Z",
            "S",
            "B",
            ",",
            ".",
            ";",
            "shift_r"
          ],
          [CIRC_A, CIRC_E, CIRC_I, CIRC_O, CIRC_U, "space"]
        ]
      }
    }
  };

  let isInstalled = false;

  interface KeyboardCallback {
    onKey(text: string): void;
  }

  export class Keyboard {
    private currentLayout = KeyboardLayout.TR_F;
    private capsLockOnContainer: HTMLDivElement = null;
    private capsLockOffContainer: HTMLDivElement = null;
    private toggledKeys: { [key: string]: boolean } = {
      "caps": false,
      "shift": false
    }

    constructor(private callback: KeyboardCallback, private container: HTMLDivElement) {
    }

    /*getTarget() {
      return this.target;
    }*/
    /*
        install(textArea, layoutID, position, parent) {
          //this.target = textArea;
          createDOM(position, parent);
          setKeyboardLayout(layoutID || KeyboardLayout.TR_Q.id);
          isInstalled = true;
        }
      isInstalled(): boolean {
          return isInstalled;
        }
        
        position(position) {
          this.container.style.top = position.top + "px";
          this.container.style.left = position.left + "px";
        }
    
        getDimensions() { return CSS.getDimensions(this.container); }
    
        isVisible() { return this.container.style.display != "none"; }
    */
    create() {
      createDOM(this.container, null, null);
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


  function onSpecialKeyPressed(key: KeyboardKey) {

  }

  function onCapsLockPressed() {
    toggledKeys["caps"] = !toggledKeys["caps"];
    updateCapsLockState();
  }

  function onShiftPressed() {
    toggledKeys["shift"] = !toggledKeys["shift"]
    // Change caps lock state and update keyboard:
    toggledKeys["caps"] = !toggledKeys["caps"];
    updateCapsLockState();
  }

  // TODO: Simulate key press instead of changing text
  function sendKeys(key) {
    //$(KEYBOARD.getTarget()).focus();
    //TEXT_SELECTION.setSelectionText(KEYBOARD.getTarget(), key);
  }

  function onEnterPressed() {
    // TODO: \r\n for IE:
    sendKeys("\n");
  }

  function onTabPressed() { sendKeys("\t"); }

  function onSpaceBarPressed() { sendKeys(" "); }

  function onBackspacePressed() {
    //$(KEYBOARD.getTarget()).focus();
    //TEXT_SELECTION.deleteSelectionText(KEYBOARD.getTarget());
  }

  /*function updateCapsLockState(layout) {
    if (toggledKeys["caps"]) {
      capsLockOnContainer.style.display = "block";
      capsLockOffContainer.style.display = "none";
    } else {
      capsLockOnContainer.style.display = "none";
      capsLockOffContainer.style.display = "block";
    }
  }*/

  function onSpecialKey(target, callback) { callback(target); }

  function getOnLetterHandler(keyValue) {
    return function () {
      if (toggledKeys["shift"]) {
        onShiftPressed();
      }
      sendKeys(keyValue);
    }
  }

  /**
   * @param {string} value
   * @param {function()} callback
   * @param {string=} className
   */
  function createButton(text: string, callback, className) {
    //var btn = document.createElement("input");
    //var btn = document.createElement("button");
    var btn = document.createElement("div");
    //btn.type = "button";
    //btn.value = text;
    btn.textContent = text;
    //if (className) {
    //  CSS.addClass(btn, className);
    //}
    //if (callback) {
    //  EVENT_HANDLER.bindEvent(btn, "click", callback);
    //}
    return btn;
  }

  function createLetterKey(value: string) {
    // Some letters start with an underscore.
    var isSpecialLetter = (value.length > 1 && value.charAt(0) == "_");
    var keyValue = (isSpecialLetter) ? value.substring(1) : value;
    var btn = createButton(keyValue, getOnLetterHandler(keyValue));
    if (isSpecialLetter) {
      //CSS.setStyles(btn, { "fontWeight": "bolder" });
    }
    return btn;
  }

  function createSpecialKey(value: string) {
    var specialKey = SPECIAL_KEYS[value];
    var btn = createButton(specialKey.text, specialKey.callback);
    if (specialKey.style) {
      //CSS.setStyles(btn, specialKey.style);
    }
    btn.className += " mea-keyboard-special-key";
    if (specialKey.tooltip) {
      btn.title = specialKey.tooltip;
    }
    return btn;
  }

  function createPlaceholder() {
    var placeholder = SPECIAL_KEYS["empty"];
    var span = document.createElement("span");
    //CSS.setStyles(span, placeholder.style);
    return span;
  }

  var layoutSelectBox = document.createElement("select");
  function setKeyboardLayout(layoutID) {
    for (var layoutItem in KeyboardLayout) {
      var layout = KeyboardLayout[layoutItem];
      if (layout.id && layout.id == layoutID) {
        Keyboard.currentLayout = layout;
        createKeyLayout();
      }
    }
  }

  function onChangeKeyboardLayout() {
    setKeyboardLayout(
      layoutSelectBox.options[layoutSelectBox.selectedIndex].value);
  }

  function createOptionsBox() {
    //EVENT_HANDLER.bindEvent(layoutSelectBox, "change", onChangeKeyboardLayout);
    layoutSelectBox.options[0] =
      new Option(KeyboardLayout.TR_Q.name, KeyboardLayout.TR_Q.id);
    layoutSelectBox.options[1] =
      new Option(KeyboardLayout.TR_F.name, KeyboardLayout.TR_F.id);
    return layoutSelectBox;
  }

  /*function onCloseButton() {
    // TODO: Minimize etc.
    keyboard.hide();
  }*/

  function createControlBar() {
    var node = document.createElement("div");
    //CSS.setClass(node, "mea-keyboard-main-controls");
    node.appendChild(createOptionsBox());

    // Add close button:
    //var closeBtn =
    //  createButton("x", onCloseButton, "mea-keyboard-main-btn-close");
    //node.appendChild(closeBtn);
    return node;
  }

  function createKeyTable(keys) {
    //let table: HTMLTableElement = document.createElement("table");
    let table = document.createElement("div");
    //table.cellPadding = 0;
    //table.cellSpacing = 0;

    for (let i = 0; i < keys.length; i++) {
      //let rowTable = document.createElement("table");
      //let rowTable = document.createElement("div");
      //rowTable.className = "mea-keyboard-key-row";
      //rowTable.cellPadding = 0;
      //rowTable.cellSpacing = 0;

      //let row = rowTable.insertRow(0);
      let row = document.createElement("div");
      row.className = "mea-keyboard-key-row";
      table.appendChild(row);

      for (var k = 0; k < keys[i].length; k++) {
        //var cell = row.insertCell(k);
        //var cell = document.createElement("div");
        //cell.className = "mea-keyboard-key";
        var key = keys[i][k];
        let cell = null;
        if (key == "empty") {  // empty place holder
          cell = createPlaceholder();
        } else if (key.length == 1 ||
          (key.length > 1 && key.charAt(0) == "_")) {  // normal letter
          cell = createLetterKey(key);
        } else {  // special key
          cell = createSpecialKey(key);
        }
        cell.className += " mea-keyboard-key";

        row.appendChild(cell);
      }
      //var rowCell = table.insertRow(i).insertCell(0);

      // rowTable.style.width = "100%";
      //rowTable.align = "left";
      //rowCell.appendChild(rowTable);
    }
    //CSS.setClass(table, "mea-keyboard-btn-table");
    table.className = "mea-keyboard-btn-table";
    return table;
  }

  function createKeyLayout(layoutContainer: HTMLDivElement, layout) {
    let capsLockOnContainer = document.createElement("div");
    let capsLockOffContainer = document.createElement("div");
    capsLockOnContainer.innerHTML = "";
    capsLockOffContainer.innerHTML = "";
    layoutContainer.innerHTML = "";

    // Create CAPS on and off tables and by default show caps off:
    var tableCapsOff = createKeyTable(layout.keys.capsOff);
   // var tableCapsOn = createKeyTable(layout.keys.capsOn);

    // TODO: Default should be actual keyboard state:
    capsLockOffContainer.appendChild(tableCapsOff);
    //capsLockOnContainer.appendChild(tableCapsOn);

    layoutContainer.appendChild(capsLockOffContainer);
    layoutContainer.appendChild(capsLockOnContainer);
    //updateCapsLockState();
  }


  function createDOM(container: HTMLDivElement, position, parent): void {
    //this.container = document.createElement("div");
    //CSS.setClass(KEYBOARD.container, "mea-keyboard-main");
    container.className = "mea-keyboard-main";

    let layoutContainer = document.createElement("div");
    createKeyLayout(layoutContainer, KeyboardLayout.TR_Q);
    layoutContainer.className = "mea-keyboard-layout";

    container.appendChild(createControlBar());
    container.appendChild(layoutContainer);

    //parent.appendChild(this.container);
    //this.container.style.top = position.top + "px";
    //this.container.style.left = position.left + "px";
  }

  //Keyboard keyboard = new Keyboard();
  //keyboard.create();

  /*
    MEA.Keyboard = KEYBOARD;
    KEYBOARD["install"] = KEYBOARD.install;
    KEYBOARD["isInstalled"] = KEYBOARD.isInstalled;
    KEYBOARD["position"] = KEYBOARD.position;
    KEYBOARD["getDimensions"] = KEYBOARD.getDimensions;
    KEYBOARD["isVisible"] = KEYBOARD.isVisible;
    KEYBOARD["show"] = KEYBOARD.show;
    KEYBOARD["hide"] = KEYBOARD.hide;
  
    window["MEA"]["Keyboard"] = MEA.Keyboard;*/

}