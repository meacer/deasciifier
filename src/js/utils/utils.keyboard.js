/**
 *  A virtual keyboard implementation for deasciifier
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *
 */

(function(CSS,TEXT_SELECTION,EVENT_HANDLER){

  /** @const */  var TR_c = '_\u00E7';
  /** @const */  var TR_C = '_\u00C7';
  /** @const */  var TR_g = '_\u011F';
  /** @const */  var TR_G = '_\u011E';
  /** @const */  var TR_i = '_\u0131';
  /** @const */  var TR_I = '_\u0130';
  /** @const */  var TR_o = '_\u00F6';
  /** @const */  var TR_O = '_\u00D6';
  /** @const */  var TR_s = '_\u015F';
  /** @const */  var TR_S = '_\u015E';
  /** @const */  var TR_u = '_\u00FC';
  /** @const */  var TR_U = '_\u00DC';
  /** @const */  var CIRC_a = "\u00E2"; /* a circumflex */
  /** @const */  var CIRC_e = "\u00EA"; /* e circumflex */
  /** @const */  var CIRC_i = "\u00EE"; /* i circumflex */
  /** @const */  var CIRC_o = "\u00F4"; /* o circumflex */
  /** @const */  var CIRC_u = "\u00FB"; /* u circumflex */
  /** @const */  var CIRC_A = "\u00C2"; /* A circumflex */
  /** @const */  var CIRC_E = "\u00CA"; /* E circumflex */
  /** @const */  var CIRC_I = "\u00CE"; /* I circumflex */
  /** @const */  var CIRC_O = "\u00D4"; /* O circumflex */
  /** @const */  var CIRC_U = "\u00DB"; /* U circumflex */
  
  var capsLockOnContainer = null;
  var capsLockOffContainer = null;
  var toggledKeys = {
    "caps":false,
    "shift":false
  };
  
  var KeyboardLayout = {
    specialKeys:{
      "tab":{text:"Tab",          tooltip:"Tab",       style:{'width':'32px', 'textAlign':'left'},  callback:onTabPressed},
      "backspace":{text:"\u2190", tooltip:"Backspace", style:{'width':'25px', 'textAlign':'right'}, callback:onBackspacePressed},
      
      "caps":{text:"Caps",        tooltip:"Caps Lock", style:{'width':'42px', 'textAlign':'left'},  callback:onCapsLockPressed},
      "enter":{text:"Enter",      tooltip:"Enter",     style:{'width':'42px', 'textAlign':'right'}, callback:onEnterPressed},
      
      "shift_l":{text:"Shift",   tooltip:"Shift",      style:{'width':'55px', 'textAlign':'left'},  callback:onShiftPressed},
      "shift_r":{text:"Shift",    tooltip:"Shift",     style:{'width':'55px', 'textAlign':'right'}, callback:onShiftPressed}, // TODO: if shift is toggled, change button style
      
      "space":{text: "",          tooltip:"Space Bar", style:{'width':'140px'}, callback:onSpaceBarPressed},
      "empty":{style:{'visibility':'hidden', 'display':'block', 'width':'100px'}}
    },
    TR_Q:{
      id:"TR_Q",
      name: "T\u00FCrk\u00E7e Q",
      keys:{
        capsOff:
        [
          // The keyboard layout. Letters that start with underscore are shown in bold. Keys
          // that are longer than 1 character but do not start with an underscore are special keys
          // and they should have an entry in specialKeys map
          ["tab", "q", "w", "e", "r", "t", "y", "u", TR_i, "o", "p", TR_g, TR_u, ";", "backspace"],
          ["caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", TR_s, "_i", ":", "enter"],
          ["shift_l", "z", "x", "c", "v", "b", "n", "m", TR_o, TR_c, ",", ".", "shift_r"],
          [CIRC_a, CIRC_e, CIRC_i, CIRC_o, CIRC_u, "space"]
        ],
        capsOn:
        [
          ["tab", "Q", "W", "E", "R", "T","Y", "U", "_I", "O", "P", TR_G, TR_U, ";", "backspace"],
          ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", TR_S, TR_I, ":", "enter"],
          ["shift_l", "Z", "X", "C", "V", "B", "N", "M", TR_O, TR_C, ",", ".", "shift_r"],
          [CIRC_A, CIRC_E, CIRC_I, CIRC_O, CIRC_U, "space"]
        ]
      }
    },
    TR_F: {
      id:"TR_F",
      name: "T\u00FCrk\u00E7e F",
      keys:{
        capsOff:
        [
          // The keyboard layout. Letters that start with underscore are shown in bold. Keys
          // that are longer than 1 character but do not start with an underscore are special keys
          // and they should have an entry in specialKeys map
          ["tab", "f", "g", TR_g, TR_i, "o", "d", "r", "n", "h", "p", "q", "w", "x", "backspace"],
          ["caps", "u", "_i", "e", "a", TR_u, "t", "k", "m", "l", "y", TR_s, ":", "enter"],
          ["shift_l", "j", TR_o, "v", "c", TR_c, "z", "s", "b", ",", ".", ";", "shift_r"],
          [CIRC_a, CIRC_e, CIRC_i, CIRC_o, CIRC_u, "space"]
        ],
        capsOn:
        [
          ["tab", "F", "G", TR_G, "_I", "O", "D", "R", "N", "H", "P", "Q", "W", "X", "backspace"],
          ["caps", "U", TR_I, "E", "A", TR_U, "T", "K", "M", "L", "Y", TR_S, ":", "enter"],
          ["shift_l", "J", TR_O, "V", "C", TR_C, "Z", "S", "B", ",", ".", ";", "shift_r"],
          [CIRC_A, CIRC_E, CIRC_I, CIRC_O, CIRC_U, "space"]
        ]
      }
    }
  };
    
  var isInstalled = false;
  var KEYBOARD =  {
    
    currentLayout: KeyboardLayout.TR_F,

    getTarget:function() {
      return this.target;
    },
    
    install:function(textArea, layoutID, position) {
      this.target = textArea;
      createDOM(position);
      setKeyboardLayout(layoutID || KeyboardLayout.TR_Q.id);
      isInstalled = true;
    },
    
    isInstalled:function() {
      return isInstalled;
    },
    
    position:function(position) {
      this.container.style.top = position.top + "px";
      this.container.style.left = position.left + "px";
    },
    
    getDimensions:function() {
      return CSS.getDimensions(this.container);
    },
    
    isVisible:function() {
      return (this.container.style.display != "none");
    },
    show:function() {
      if (this.container) {
        this.container.style.display = "block";
      }
    },
    hide:function() {
      if (this.container) {
        this.container.style.display = "none";
      }
    }
  };
  
  function onCapsLockPressed() {
    toggledKeys["caps"]=!toggledKeys["caps"];
    updateCapsLockState();
  }
  
  function onShiftPressed() {
    toggledKeys["shift"] = !toggledKeys["shift"]
    // Change caps lock state and update keyboard:
    toggledKeys["caps"] = !toggledKeys["caps"];
    updateCapsLockState();
  }
  
  // TODO: Simulate key press instead of changing text 
  function sendKeys(key){ 
    $(KEYBOARD.getTarget()).focus();
    TEXT_SELECTION.setSelectionText(KEYBOARD.getTarget(), key);
  }
  
  function onEnterPressed() {
    // TODO: \r\n for IE:
    sendKeys("\n");
  }
  
  function onTabPressed() {
    sendKeys("\t");
  }
  
  function onSpaceBarPressed() {
    sendKeys(" ");
  }
  
  function onBackspacePressed() {
    $(KEYBOARD.getTarget()).focus();
    TEXT_SELECTION.deleteSelectionText(KEYBOARD.getTarget());
  }
  
  function updateCapsLockState() {
    if (toggledKeys["caps"]) {
      capsLockOnContainer.style.display = "block";
      capsLockOffContainer.style.display = "none";
    } else {
      capsLockOnContainer.style.display = "none";
      capsLockOffContainer.style.display = "block";
    }
  }

  function onSpecialKey(target, callback) {
    callback(target);
  }
  
  function getOnLetterHandler(keyValue) {
    return function() {
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
  function createButton(value, callback, className) {
    var btn = document.createElement("input");
    btn.type = "button";
    btn.value = value;
    if (className) {
      CSS.addClass(btn, className);
    }
    if (callback) {
      EVENT_HANDLER.bindEvent(btn, "click", callback);
    }
    return btn;
  }
  
  function createLetterKey(value) {
    // Some letters start with 
    var isSpecialLetter = (value.length>1 && value.charAt(0)=="_");
    var keyValue = (isSpecialLetter) ? value.substring(1) : value;
    var btn = createButton(keyValue, getOnLetterHandler(keyValue));
    if (isSpecialLetter) {
      CSS.setStyles(btn, {"fontWeight":"bolder"});
    }
    return btn;
  }

  function createSpecialKey(value) {
    var specialKey = KeyboardLayout.specialKeys[value];
    var btn = createButton(specialKey.text, specialKey.callback);
    if (specialKey.style) {
      CSS.setStyles(btn, specialKey.style);
    }
    if (specialKey.tooltip) {
      btn.title = specialKey.tooltip;
    }
    return btn;
  }
  
  function createPlaceholder() {
    var placeholder = KeyboardLayout.specialKeys["empty"];
    var span = document.createElement("span");
    CSS.setStyles(span, placeholder.style);
    return span;
  }
  
  var layoutSelectBox = document.createElement("select");
  function setKeyboardLayout(layoutID) {
    for (var layoutItem in KeyboardLayout) {
      var layout = KeyboardLayout[layoutItem]; 
      if (layout.id && layout.id==layoutID) {
        KEYBOARD.currentLayout = layout;
        createKeyLayout();
      }
    }
  }
  
  function onChangeKeyboardLayout() {
    setKeyboardLayout(layoutSelectBox.options[layoutSelectBox.selectedIndex].value);
  }
  
  function createOptionsBox() {
    EVENT_HANDLER.bindEvent(layoutSelectBox, "change", onChangeKeyboardLayout);
    layoutSelectBox.options[0] = new Option(KeyboardLayout.TR_Q.name, KeyboardLayout.TR_Q.id);
    layoutSelectBox.options[1] = new Option(KeyboardLayout.TR_F.name, KeyboardLayout.TR_F.id);
    return layoutSelectBox;
  }
  
  function onCloseButton() {
    // TODO: Minimize etc.
    KEYBOARD.hide();
  }
  
  function createControlBar() {
    var node = document.createElement("div");
    CSS.setClass(node, "mea-keyboard-main-controls");
    node.appendChild(createOptionsBox());
    
    // Add close button:
    var closeBtn = createButton("x", onCloseButton, "mea-keyboard-main-btn-close");
    node.appendChild(closeBtn);
    return node;
  }
  
  function createKeyTable(keys) {
    var table = document.createElement("table");
    table.cellPadding = 0;
    table.cellSpacing = 0;
    
    for (var i=0; i<keys.length; i++) {
      var rowTable = document.createElement("table");
      rowTable.cellPadding = 0;
      rowTable.cellSpacing = 0;
      var row = rowTable.insertRow(0);

      for (var k=0; k<keys[i].length; k++) {
        var cell = row.insertCell(k);
        var key = keys[i][k];
        if (key=="empty") { // empty place holder
          cell.appendChild(createPlaceholder());
        } else if (key.length==1 || (key.length>1 && key.charAt(0)=="_")) { // normal letter
          cell.appendChild(createLetterKey(key));
        } else { // special key
          cell.appendChild(createSpecialKey(key));
        }
      }
      var rowCell = table.insertRow(i).insertCell(0);
      //rowTable.style.width = "100%";
      rowTable.align = "left";
      rowCell.appendChild(rowTable);
    }
    CSS.setClass(table, "mea-keyboard-btn-table");
    return table;
  }
  
  function createKeyLayout() {
    capsLockOnContainer = document.createElement("div");
    capsLockOffContainer = document.createElement("div");
    capsLockOnContainer.innerHTML = "";
    capsLockOffContainer.innerHTML = "";
    KEYBOARD.layoutContainer.innerHTML = "";
    
    // Create CAPS on and off tables and by default show caps off:
    var tableCapsOff = createKeyTable(KEYBOARD.currentLayout.keys.capsOff);
    var tableCapsOn = createKeyTable(KEYBOARD.currentLayout.keys.capsOn);
    
    // TODO: Default should be actual keyboard state:
    capsLockOffContainer.appendChild(tableCapsOff);
    capsLockOnContainer.appendChild(tableCapsOn);
    KEYBOARD.layoutContainer.appendChild(capsLockOffContainer);
    KEYBOARD.layoutContainer.appendChild(capsLockOnContainer);
    updateCapsLockState();
  }
  
  function createDOM(position) {
    KEYBOARD.container = document.createElement("div");
    CSS.setClass(KEYBOARD.container, "mea-keyboard-main");
    
    KEYBOARD.layoutContainer = document.createElement("div");
    CSS.setClass(KEYBOARD.layoutContainer, "mea-keyboard-layout");
    
    KEYBOARD.container.appendChild(createControlBar());
    KEYBOARD.container.appendChild(KEYBOARD.layoutContainer);
    
    var body = document.body || document.getElementsByTagName("body")[0];
    body.appendChild(KEYBOARD.container);
    
    KEYBOARD.container.style.top = position.top + "px";
    KEYBOARD.container.style.left = position.left + "px";
  }
  
  function init() {
    CSS.createStyle(".mea-keyboard-main",           "position:absolute; z-index:99999; background:#EfEfEf; border:1px solid #888; box-shadow:0 0 5px #888;");
    CSS.createStyle(".mea-keyboard-layout",         "");
    CSS.createStyle(".mea-keyboard-btn-table",      "padding:2px 2px; ");
    // Default style for buttons in the table:
    CSS.createStyle(".mea-keyboard-btn-table input",            "margin:1px 1px; padding:2px;cursor:pointer;width:25px;height:25px; " +
      "text-align:center; border: 1px solid #333; border-radius:3px; /*background: #f8f8f8;*/; background:-moz-linear-gradient(top,white,#DDD); background-image:-webkit-gradient(linear,0 0,0 100%,from(#fff),to(#ddd))");
    CSS.createStyle(".mea-keyboard-btn-table input:active",     "background: #888; color: white");
    CSS.createStyle(".mea-keyboard-btn-table input:hover",      "box-shadow: 0px 0px 3px #888;");
    
    CSS.createStyle(".mea-keyboard-main-controls",    "text-align:right; padding: 1px;");
    CSS.createStyle(".mea-keyboard-main-btn-close",   "display:inline-block; border:1px solid #888; vertical-align:top; margin:2px 2px; width:16px;height:16px; background: url(static/img/v2.0/close_icon.png); font-size:0");
  }
  init();
  
  MEA.Keyboard = KEYBOARD;
  KEYBOARD["install"] = KEYBOARD.install;
  KEYBOARD["isInstalled"] = KEYBOARD.isInstalled;
  KEYBOARD["position"] = KEYBOARD.position;
  KEYBOARD["getDimensions"] = KEYBOARD.getDimensions;
  KEYBOARD["isVisible"] = KEYBOARD.isVisible;
  KEYBOARD["show"] = KEYBOARD.show;
  KEYBOARD["hide"] = KEYBOARD.hide;
  
  window["MEA"]["Keyboard"] = MEA.Keyboard;
  
})(MEA.CSS, MEA.TextSelection, MEA.EventHandler);
