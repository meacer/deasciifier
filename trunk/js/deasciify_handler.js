// Handler for Turkish deasciifier. Provides functions to automatically handle
// deasciifying of text boxes. For learning how to use, please see documentation.
//
// Author:  Mustafa Emre Acer
// Version: 1.1
// Date:    2010-12-13
//
var DeasciifyHandler = {
  // Initializes the handler
  init:function() {
    this._deasciifier = new Deasciifier();
  },
  // Installs the hander to the given textbox.
  install:function(textbox, enabled, afterDeasciifyCallback){
    if (!textbox) {
      return false;
    }
    // Do not install multiple times:
    if (this._installedObjects[textbox]) {
      return;
    }
    // Enable by default:
    if (typeof enabled=="undefined") {
      enabled = true;
    }    
    var keyupHandler = this._getKeyupHandler(textbox);
    this._addEvent(textbox, "keyup", keyupHandler);
    this._keyupHandlers[textbox] = keyupHandler;    
    this._installedObjects[textbox] = true;
    this._enabledObjects[textbox] = enabled;
    this._afterDeasciifyCallbacks[textbox] = afterDeasciifyCallback;
  },
  // Uninstalls the handler from given textbox
  uninstall:function(textbox) {
    if (this._keyupHandlers[textbox]){ 
      this._removeEvent(textbox, "keyup", this._keyupHandlers[textbox]);
      this._installedObjects[textbox] = null;
      this._enabledObjects[textbox] = null;
      this._keyupHandlers[textbox] = null;
    }
  },  
  // Deasciifies the textbox
  deasciify:function(textBox, fullText) {
    if (!textBox) {
      return;
    }
    if (typeof textBox.selectionStart!="undefined") {
      // Firefox, Chrome, Opera, Safari
      var selStart = textBox.selectionStart;
      var selEnd = textBox.selectionEnd;
      if (textBox.selectionStart==textBox.selectionEnd) {
        // If Nothing is selected:
        if (fullText) {
          // Deasciify the whole text
          textBox.value = this._deasciifier.deasciify(textBox.value);
        } else {
          // Deasciify only the current word
          textBox.value = this._deasciify_word_at_cursor(textBox.value, selStart);
        }
      } else {
        // If there is a selection, only deasciify the selection
        textBox.value = this._deasciifier.deasciifyRange(textBox.value, selStart, selEnd);
      }
      // Restore cursor
      textBox.selectionStart = selStart;
      textBox.selectionEnd = selEnd;
    } else {
      // Internet Explorer
      var range = this._getInputSelection(textBox);
      var selStart = range.start;
      var selEnd = range.end;
      if (selStart==selEnd) {
        // If Nothing is selected:
        if (fullText) {
          // Deasciify the whole text
          textBox.value = this._deasciifier.deasciify(textBox.value);
        } else {
          // Deasciify only the current word
          textBox.value = this._deasciify_word_at_cursor(textBox.value, selStart);
        }
      } else {
        // If there is a selection, only deasciify the selection
        textBox.value = this._deasciifier.deasciifyRange(textBox.value, selStart, selEnd);
      }
      // Restore cursor
      var newRange = textBox.createTextRange();
      newRange.collapse(true);
      newRange.moveStart("character", range.startRestore);
      newRange.moveEnd  ("character", range.endRestore-range.startRestore);
      newRange.select();
    }
  },
  // Enables or disables auto-deasciifying
  setEnabled:function(textbox, enabled) {
    this._enabledObjects[textbox] = enabled;
  },
  // Returns true if Auto-deasciifying is enabled for the given textbox
  getEnabled:function(textbox) {
    return this._enabledObjects[textbox] ? true:false;
  },
  // Private members
  _installedObjects:{},
  _enabledObjects:{},
  _keyupHandlers:{},
  _afterDeasciifyCallbacks:{},  // functions called after a deasciification
  // Is the keycode a seperator
  _is_keycode_seperator:function(c) {
    return c==32 || c==13 || c==188 || c==190 || c==191 || c==189 || 
      c==50 || c==186 || c==56 || c==57 || c==48;
  },
  // Is the character a seperator
  _is_seperator:function(c) {
    return (c==' ' || c=='\n' || c=='.' || c==',' || c==';' || c=='?' || c=='!' ||
        c=='(' || c==')' || c=='*' || c=='&' || c=='@' || c=='-');
  },
  // Adds an event to a DOM object
  _addEvent:function(obj, eventName, func) {
    if (obj.addEventListener) {
      obj.addEventListener(eventName, func, false);
    } else {
      if (obj.attachEvent) {
        obj.attachEvent("on"+eventName, func);
      }
    }
  },
  // Removes an event from a DOM obect
  _removeEvent:function(obj, eventName, handler) {
    if (obj.removeEventListener) {
      obj.removeEventListener(eventName, handler);
    } else {
      if (obj.detachEvent) {
        obj.detachEvent("on"+eventName, handler);
      }
    }
  },
  // IE Text selection code from http://stackoverflow.com/questions/235411/
  // Courtesy Tim Down
  _getInputSelection:function(el) {
    var start = 0, end = 0, normalizedValue, range,
      textInputRange, len, endRange;
    var startOffset, endOffset; // How many characters do start and end skew by?  
    range = document.selection.createRange();
    if (range && range.parentElement() == el) {
      len = el.value.length;
      normalizedValue = el.value.replace(/\r\n/g, "\n");
      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());
      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        start = end = len;
        startOffset = 0;
        endOffset = 0;
      } else {
        start = -textInputRange.moveStart("character", -len);
        startOffset = normalizedValue.slice(0, start).split("\n").length - 1;
        start += startOffset;
        
        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd("character", -len);
          endOffset = normalizedValue.slice(0, end).split("\n").length - 1;
          end += endOffset;
        }
      }
    }
    return {
      start: start,
      end: end,
      startRestore: start-startOffset,
      endRestore: end-endOffset
    };
  },  
  // Returns a cross-browser keyup handler
  _getKeyupHandler:function(txt) {
    var me = this;
    return function(e) {
      if (!me._enabledObjects[txt]) {
        return;
      }
      var keyCode;
      if (e) {
        keyCode = (e.which) ? e.which: event.keyCode;
      } else {
        keyCode = event.keyCode;
      }
      if (me._is_keycode_seperator(keyCode)) {
        me.deasciify(txt);
        if (me._afterDeasciifyCallbacks[txt]) {
          // Call the onkeyup event handler
          me._afterDeasciifyCallbacks[txt](txt);
        }
      }
    };
  },  
  // Finds the first word seperator before the current cursor position.
  _find_last_word_seperator:function(text, cursor_pos) {
    if (cursor_pos>=text.length) {
      cursor_pos = text.length-1;
    }
    for (var i=cursor_pos; i>0; i--) {
      // find a seperator with a normal character before it:
      if (this._is_seperator(text.charAt(i)) && !this._is_seperator(text.charAt(i-1))) {
        return i;
      }
    }
    return 0;
  },  
  // Converts the word right before the cursor position:
  _deasciify_word_at_cursor:function(text, cursor_pos) {
    var firstSpace = this._find_last_word_seperator(text, cursor_pos);
    var secondSpace = 0;
    if (firstSpace>0) {
      secondSpace = this._find_last_word_seperator(text, firstSpace-1);
    }
    // Word is between firstSpace and secondSpace:
    return this._deasciifier.deasciifyRange(text, secondSpace, firstSpace);
  }
};
