/**
 *  Deasciifier box implementation. Provides methods for handling automatic 
 *  deasciification, corrections and highlighting of text areas.
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *
 */
 
(function(DEASCIIFIER, ASCIIFIER, EVENT_HANDLER, TEXT_SELECTION, TEXT_HILITE, TEXT_HELPER, CORRECTION_MENU, OPTIONS) {


  // Returns an event handler specific to the given textArea 
  function getEventHandler(textArea, handlerFunc) {
    return function(e) {
      if (handlerFunc) {
        return handlerFunc(textArea, e);
      }
    };
  }
  
  var KeyState = {
    isCTRL:false
  };
  var MouseState = {
    isDown:false
  };
  
  /** Event handlers for the DeasciifyBox object
   */
  var HANDLERS = {
  
    onKeyUp:function(textArea, evt){
      // Deasciify the word at the cursor if a seperator key was hit:
      var keyCode = EVENT_HANDLER.getKeyCode(evt);
      if (keyCode==EVENT_HANDLER.KeyCodes.CTRL) {
        KeyState.isCTRL = false;
      }
      
      var instance = BOX.getInstance(textArea);
      if (instance) {
        // Grow the textarea if necessary:
        instance.adjustHeight();
        // corrections popup menu:
        /*if (instance.onMenuKeyUp(evt, KeyState.isCTRL)) {
          //if (isCTRL && keyCode==EVENT_HANDLER.KeyCodes.SPACE) {  // CTRL+Space keyup popped the corrections menu
          //return false;
          //instance.showCorrectionMenuAtCursor();
        }*/
        instance.onKeyUp(keyCode);
      }
    },
    
    onKeyDown:function(textArea, evt) {
      evt = EVENT_HANDLER.getEvent(evt);
      var instance = BOX.getInstance(textArea);
      if (instance) {
        var keyCode = EVENT_HANDLER.getKeyCode(evt);
        if (keyCode==EVENT_HANDLER.KeyCodes.CTRL) {
          KeyState.isCTRL = true;
        }
        // corrections popup menu:
        /*if (instance.onMenuKeyDown(evt, KeyState.isCTRL)) {
          return false;
        }*/
        instance.hideCorrectionMenu();
        
        instance.update();
      }
    },
    
    onChange: function(textArea) {
      var instance = BOX.getInstance(textArea);
      if (instance) {
        instance.update();
      }
    },
    
    onMouseUp:function(textArea, evt) {
      MouseState.isDown = false;
      textArea = EVENT_HANDLER.getTarget(evt);
      
      var instance = BOX.getInstance(textArea);
      if (instance) {
        if (evt.button==EVENT_HANDLER.MouseButtons.Right) {
          // Hide menu on right click
          instance.hideCorrectionMenu();
          return;
        }
        instance.showCorrectionMenuAtCursor();
      }
    },
    
    onMouseDown:function(textArea, evt) {
      MouseState.isDown = true;
      var instance = BOX.getInstance(textArea);
      if (instance) {
        instance.hideCorrectionMenu();
      }
    },
    
    /*onMouseMove:function(textArea, evt) {
      if (MouseState.isDown) {
        // The user may be resizing the textbox:
        textArea = EVENT_HANDLER.getTarget(evt);
        var instance = BOX.getInstance(textArea);
        if (instance) {
          log("Resizing textarea");
          instance.updateDimensions();
        }
      }
    },*/
    onPaste:function(textArea, evt) {
      var instance = BOX.getInstance(textArea);
      if (instance) {
        instance.hideCorrectionMenu();
        instance.update();
      }
    }
  };
  
  var handledEvents = [
    //{name:"key",        handler: HANDLERS.onKey},
    //{name:"keypress",   handler: HANDLERS.onKeyPress},
    {name:"keydown",    handler: HANDLERS.onKeyDown},
    {name:"keyup",      handler: HANDLERS.onKeyUp},
    {name:"change",     handler: HANDLERS.onChange},
    //{name:"click",      handler: HANDLERS.onClick},
    //{name:"focus",      handler: HANDLERS.onFocus},
    {name:"mousedown",  handler: HANDLERS.onMouseDown},
    {name:"mouseup",    handler: HANDLERS.onMouseUp},
    //{name:"mousemove",  handler: HANDLERS.onMouseMove},
    //{name:"scroll",     handler: HANDLERS.onScroll},
    {name:"paste",      handler: HANDLERS.onPaste}
  ];
  
  var uiLang = new MEA.UILang("tr",
    {
      "confirmFullTextDeasciify": {
        "en": "Are you sure you want to convert entire text?",
        "tr": "T\u00FCm metni \u00E7evirmek istedi\u011Finizden emin misiniz?"
      },
      "confirmApplyCorrectionToAll": {
        "en":"Do you want to apply this correction to the entire text?",
        "tr":"Bu de\u011Fi\u015Fikli\u011Fi t\u00FCm metin \u00FCzerinde uygulamak istiyor musunuz?"
      }
    }
  );
  function getUIText(textName) {
    return uiLang.getText(textName);
  }
  
  /** @const */ var OPTION_AUTO_CONVERT     = "auto_convert";
  /** @const */ var OPTION_ENABLE_CORRECTIONS="enable_corrections"; // Enables corrections. If not enabled, corrections are not installed.
  /** @const */ var OPTION_SHOW_CORRECTIONS = "show_corrections";     // Displays corrections. Can be turned on/off any time
  /** @const */ var OPTION_HIGHLIGHT        = "highlight";
  /** @const */ var OPTION_AUTO_GROW        = "auto_grow";
  /** @const */ var OPTION_CONFIRM_FULLTEXT = "fullTextConfirmation";
  /** @const */ var OPTION_RESIZEABLE       = "resizeable";
  
  var defaultOptions = {
    OPTION_AUTO_CONVERT:    true,  // Turns on/off automatic deasciification while typing
    OPTION_HIGHLIGHT:       true,  // Turns on/off text highlighting
    OPTION_AUTO_GROW:       true,  // Turns on/off textarea vertical growing
    OPTION_ENABLE_CORRECTIONS:true, // Installs corrections if true
    OPTION_SHOW_CORRECTIONS:true,   // Turns on/off corrections 
    OPTION_CONFIRM_FULLTEXT:true,  // If true, asks for confirmation before full text deasciification
    OPTION_RESIZEABLE:      true   // Can the textbox be resized?
  };
  

  /** Wrapper object for deasciifier
   */
  var DeasciiConverter = {
    process:function(text) {
      return DEASCIIFIER.deasciify(text);
    },
    processRange:function(text, start, end) {
      return DEASCIIFIER.deasciifyRange(text, start, end);
    },
    toString:function() {
      return "deasciify";
    }
  }
  /** Wrapper object for asciifier
   */
  var AsciiConverter = {
    process:function(text) {
      return ASCIIFIER.asciify(text);
    },
    processRange:function(text, start, end) {
      return ASCIIFIER.asciifyRange(text, start, end);
    },
    toString:function() {
      return "asciify";
    }
  }
  
  
  
  var BOX = {
  
    instances:{},
    
    setUILang:function(lang, param1, param2) {
      uiLang.changeLang(lang, param1, param2);
    }, 
    
    /** Returns the DeasciifyBox instance for the given textArea
     */
    getInstance:function(textArea) {
      return this.instances[textArea];
    },
  
    setInstance:function(textArea, instance) {
      this.instances[textArea] = instance;
    },
    
    getInstances:function() {
      return this.instances;
    },
  
    /** Installs the event handlers for the given textarea
     */
    installEventHandlers:function(textArea) {
      // Install event handlers:
      for (var i=0; i<handledEvents.length; i++) {
        var evt = handledEvents[i];
        var handler = getEventHandler(textArea, evt.handler);
        EVENT_HANDLER.bindEvent(textArea, evt.name, handler); // how to remove this?
      }
    },
  
    /** Installs the deasciifyBox instance for the given textarea
     */
    install:function(textArea, options) {
      if (!textArea) {
        return;
      }
      if (this.getInstance(textArea)) {
        // Already installed for this text area
        return;
      }
      var instance = new this.INSTANCE(textArea, options);
      this.installEventHandlers(textArea);
      instance.init();
      this.setInstance(textArea, instance);
      return instance;
    },
    
    /** Uninstall the deasciifyBox instance from the given textarea
     */
    uninstall:function(textArea) {
      if (!this.getInstance(textArea)) {
        throw "Deasciifier already not installed for this text area";
      }
      for (var i=0; i<handledEvents.length; i++) {
        var e = handledEvents[i];
        EVENT_HANDLER.unbindEvent(textArea, e.name, e.handler);
      }
      this.setInstance(textArea, null);
    },
    
    /** Deasciifies the selection within the textarea. If no text is selected, 
     *  deasciifies the entire textarea.
     *  After deasciification, highlights all of the deasciified characters 
     *  and restores the cursor position.
     */
    deasciifySelection:function(textArea) {
      var instance = this.getInstance(textArea);
      if (instance) {
        instance.processSelection(DeasciiConverter);
      } else {
        throw "DeasciifyBox not installed for this text area";
      }
    },
    
    /** Asciifies the selection within the textarea. If no text is selected, 
     *  asciifies the entire textarea.
     *  After asciification, highlights all of the asciified characters 
     *  and restores the cursor position.
     */
    asciifySelection:function(textArea) {
      var instance = this.getInstance(textArea);
      if (instance) {
        instance.processSelection(AsciiConverter);
      } else {
        throw "DeasciifyBox not installed for this text area";
      }
    },
    
    onResizeWindow:function(evt) {
      // Update all instances:
      var instances = this.getInstances();
      for (var instanceKey in instances) {
        var instance = instances[instanceKey];
        if (instance) {
          instance.onResizeWindow(evt);
        }
      }
    },
    
    /** Updates the dimensions of all associated text areas
     */
    onTimer:function(boxInstance) {
      var instances = boxInstance.getInstances();
      for (var instanceKey in instances) {
        var instance = instances[instanceKey];
        if (instance) {
          //instance.update();
          instance.onResizeWindow(null);
        }
      }
    },
    
    setOption:function(textArea, optionName, optionValue) {
      var instance = this.getInstance(textArea);
      if (instance) {
        instance.options.set(optionName, optionValue);
      }
    }
  };
  
  /**
   *  DeasciifyBox instance created for each textarea 
   * @constructor
   */
  BOX.INSTANCE = function(textArea, options) {
    this.textArea = textArea;
    this.options = new OPTIONS(options, defaultOptions);
    this.textHilite = null;
    this.correction = null;
  }
  
  /** Installs the text highlighter instance for this text area
   */
  BOX.INSTANCE.prototype = {
  
    /** 
     * Initializes the deasciifyBox instance for the associated textarea
     */
    init:function() {
    
      // The parentNode will be the parent of the correction menu. 
      var parentNode = document.body || document.getElementsByTagName("body")[0];
      
      // Create a texthilite object regardless of the option. We use it to
      // get cursor coordinates.
      var textHighlightOptions = new OPTIONS({
        "resizeable":  this.options.get(OPTION_RESIZEABLE, true)
        //"hiliteStyles": "background-color:yellow; border-bottom:1px solid blue",
      });
      this.textHilite = TEXT_HILITE.install(this.textArea, textHighlightOptions);
      
      // Create the correction menu if it's enabled:
      if (this.options.get(OPTION_ENABLE_CORRECTIONS, true)) {
        var instance = this;
        this.correction = {
          position: {start:0, end:0},
          menu : CORRECTION_MENU.create(
            parentNode,
            function(correction){ return instance.onSelectCorrection(correction); },
            function(correction){ return instance.onCorrectionApplyToAll(correction); }
          )
        };
      }
    },
  
    onCorrectionApplyToAll:function(correction) {
      
      var question = getUIText("confirmApplyCorrectionToAll");
      if (this.correction && confirm(question)) {
        
        this.hideCorrectionMenu();
        
        // Convert relative character indices to full text indices:
        var changedPositions = correction["changedPositions"] || [];
        for (var i=0; i<changedPositions.length; i++) {
          changedPositions[i] += this.correction.position.start;
        }
        
        var replacedPositions = this.replaceAll(correction.originalText, correction.text);
        // Add replaced positions to the changed positions list so that we can display
        // all changes including the ones coming from the correction menu:
        changedPositions = changedPositions.concat(replacedPositions);
        if (changedPositions.length>0) {
          this.highlightChanges(changedPositions, true); // forceClear:true
        }
      }
      return true;
    },
  
    replaceAll:function(original, replaced) {
      var originalText = this.textArea.value;
      var regex = new RegExp(original, "g");
      var replacedText = originalText.replace(regex, replaced);
      this.setText(replacedText);
      return TEXT_HELPER.getChangedPositions(originalText, replacedText);
    },
  
    onSelectCorrection:function(correction) {
      if (this.correction) {
        if (correction.reset) {
          // User hit the reset button, hide the menu
          this.hideCorrectionMenu();
        }
        this.applyCorrection(correction);
        return true;
      }
      return false;
    },

    setText:function(text) {
      // BUG: When we set text while the corrections menu is open, the cursor 
      // is reset to the beginning of the text in IE. Also, trying to focus 
      // on the textarea puts it to the end of the text. 
      //this.textArea.focus();  // Problematic in IE
      var selectionRange = TEXT_SELECTION.getRange(this.textArea);
      this.textArea.value = text;
      TEXT_SELECTION.setRange(this.textArea, selectionRange);
      // TODO: Update highlights etc
    },
    
    applyCorrection:function(correction) {
      this.setText(
        TEXT_HELPER.setSubstring(
          this.textArea.value, this.correction.position.start, this.correction.position.end, correction.text));
      // Highlight changed characters:
      var changedPositions = [];
      if (correction["changedPositions"]) {
        for (var i=0; i<correction["changedPositions"].length; i++) {
          changedPositions.push(correction["changedPositions"][i]+this.correction.position.start);
        }
      }
      this.highlightChanges(changedPositions, true);  // forceClear:true
    },
  
    /** 
     * @param {Array} changedPositions
     * @param {boolean=} forceClear
     */
    highlightChanges:function(changedPositions, forceClear) {
      // Highlight results
      if (this.textHilite && this.options.get(OPTION_HIGHLIGHT, true)) {
        if ((changedPositions && changedPositions.length>0) || forceClear) {
          this.textHilite.clear();
          for (var i=0; i<changedPositions.length; i++) {
            var pos = changedPositions[i];
            this.textHilite.hiliteRange(pos, pos+1);
          }
          this.textHilite.update();
        }
      }
    },
  
    /** Displays the conversion results in the textbox and highlights the converted
      * characters if necessary
      */
    displayResults:function(result) {
      if (result && result.text) {
        this.textArea.value = result["text"];
        this.highlightChanges(result["changedPositions"]);
      }
    },

    /*onMenuKeyUp:function(evt, isCTRL) {
      if (this.correction) {
        if (this.correction.menu.isVisible()) {
          // If menu is visible, let it handle the key press
          var keyCode = EVENT_HANDLER.getKeyCode(evt);
          if (keyCode==EVENT_HANDLER.KeyCodes.ENTER) {
            EVENT_HANDLER.cancelEvent(evt);
            return true;
          }
          // If CTRL+Space, ignore the key
          if (isCTRL && keyCode==EVENT_HANDLER.KeyCodes.SPACE) {
            EVENT_HANDLER.cancelEvent(evt);
            return true;
          }
        }
      }
      return false;
    }
    
    onMenuKeyDown:function(evt, isCTRL) {
      if (this.correction) {
        var keyCode = EVENT_HANDLER.getKeyCode(evt);
        if (false && this.correction.menu.isVisible()) {
          // TODO: Make correction menu handle key presses when it's visible
          
          // If menu is visible, let it handle the key press
          if (this.correction.menu.onKeyDown(keyCode)) {
            // correction menu handled the keycode
            EVENT_HANDLER.cancelEvent(evt);
            return true; // event handled
          } else {
            // correction menu did not handle the keycode, hide menu 
            this.hideCorrectionMenu();
          }
        } else {
          if (isCTRL && keyCode==EVENT_HANDLER.KeyCodes.SPACE) {   // CTRL + Space shows the menu
            this.showCorrectionMenuAtCursor();
            EVENT_HANDLER.cancelEvent(evt);
            return true; // event handled
          }
        }
      }
      return false; // event not handled
    }
    */
    hideCorrectionMenu:function() {
      if (this.correction && this.correction.menu) {
        this.correction.menu.hide();
      }
    },
    
    showCorrectionMenuAtCursor:function() {
      if (!this.textHilite || !this.correction || !this.options.get(OPTION_SHOW_CORRECTIONS, true)) {
        return;
      }
      this.hideCorrectionMenu();
      var selectionRange = TEXT_SELECTION.getRange(this.textArea);
      // Since this is a mouse up event, we expect start and end positions
      // to be the same. TODO: Is this always the case?
      if (selectionRange.start==selectionRange.end) {
        var cursorPos = selectionRange.start;
        // Only show the menu if we are in the middle of a word
        if (TEXT_HELPER.isCursorInsideWord(this.textArea.value, cursorPos)==false){
          this.hideCorrectionMenu();
          return;
        }
        var wordBoundary = TEXT_HELPER.getWordAtCursor(this.textArea.value, cursorPos);
        var wordText = this.textArea.value.substring(wordBoundary.start, wordBoundary.end);
        // Don't show menu if there is nothing to suggest
        if (CORRECTION_MENU.hasCorrections(wordText)==false) {
          return;
        }
        
        var wordCoords = this.textHilite.getCoordsFromWord(wordBoundary.start, wordBoundary.end);
        var menuLeft = wordCoords.left;
        var menuTop = wordCoords.top + wordCoords.height + 3;
        var menuWidth = wordCoords.width;

        this.correction.position.start = wordBoundary.start;
        this.correction.position.end = wordBoundary.end;
        this.correction.menu.show(menuLeft, menuTop, menuWidth, wordText);
      }
    },
  
    /** Deasciifies the word before at the cursor and highlights the converted
     *  characters.
     */
    deasciifyCursor:function() {
      var selectionRange = TEXT_SELECTION.getRange(this.textArea);
      var rangeToDeasciify = null;
      if (selectionRange.start==selectionRange.end) {
        // No text selected. Get the boundaries of the last word that is 
        // seperated by space, enter etc
        rangeToDeasciify = TEXT_HELPER.getWordBeforeCursor(this.textArea.value, selectionRange.start);
      } else {
        // A portion of the text is already selected. Deasciify only the selected
        // part
        rangeToDeasciify = {
          start:selectionRange.start,
          end:  selectionRange.end
        };
      }
      // Deasciify the range:
      var result = DeasciiConverter.processRange(
          this.textArea.value, rangeToDeasciify.start, rangeToDeasciify.end);
      // Highlight the results
      this.displayResults(result);
      // Restore cursor:
      TEXT_SELECTION.setRange(this.textArea, selectionRange);
    },
  
    /** Processes the selected text range with the given textProcessor. textProcessor
     *  can be one of DeasciiConverter, AsciiConverter or any other user defined 
     *  filter.
     */
    processSelection:function(textProcessor) {
      if (this.correction.menu) {
        this.hideCorrectionMenu();
      }
      var selectionRange = TEXT_SELECTION.getRange(this.textArea);
      var result = null;
      if (selectionRange.start==selectionRange.end) {
        var question = getUIText("confirmFullTextDeasciify");
        // No selection, process whole text
        if (this.options.get(OPTION_CONFIRM_FULLTEXT, true)) {
          if (!confirm(question)) {
            return false;
          }
        }
        result = textProcessor.process(this.textArea.value);
      } else {
        // Process only the selected range
        result = textProcessor.processRange(this.textArea.value, selectionRange.start, selectionRange.end-1);
      }
      // Highlight the results
      this.displayResults(result);
      // Restore cursor
      TEXT_SELECTION.setRange(this.textArea, selectionRange);
      return true;
    },
    
    onKeyUp:function(keyCode) {
      if (!this.options.get(OPTION_AUTO_CONVERT, true)) {
        return false;
      }
      if (TEXT_HELPER.isSeperatorKeycode(keyCode)) {
        this.deasciifyCursor();
      }
    },
  
    /** Checks the cursor position. If the cursor is before any highligted text,
     * the highlights are cleared. This is done otherwise the highlighted text
     * would just look out of place when a character was entered before it.
     */
    updateHilites:function() {
      if (this.textHilite) {
        var selectionRange = TEXT_SELECTION.getRange(this.textArea);
        this.textHilite.clearIfCursorIsBeforeLastHilite(selectionRange.start);
        this.textHilite.clearIfCursorIsBeforeLastHilite(selectionRange.end);
      }
    },
    
    /** Automatically adjusts the height of the text area based on the height 
     *  of the mirroring <pre> element for this text area. 
     */
    adjustHeight:function() {
      // Add extra lines to text box if the text causes scroll bars to appear:
      if (this.textArea.scrollHeight>this.textArea.clientHeight) {
          var lineHeight = 2*18;
          this.textArea.style.height = 
            this.textArea.scrollHeight + 3 + (lineHeight) + "px";
      }
      if (this.textHilite) {
        this.textHilite.updateDimensions();
      }
    },

    onResizeWindow:function(evt) {
      if (this.textHilite) {
        this.textHilite.updateDimensions();
      }
    },
    
    update:function() {
      this.updateHilites();
      this.adjustHeight();
    }
  };
  
  // Initialize everything
  function init(){
    // Add handlers etc
    EVENT_HANDLER.bindEvent(window, "resize", function(e) { BOX.onResizeWindow(e); });  
    // Handle textarea resize events:
    setInterval(function(){BOX.onTimer(BOX); }, 500);
  }
  init();
  
  MEA.DeasciifyBox = BOX;
  
  // Exports for Closure Compiler:
  BOX["install"]           = BOX.install;
  BOX["uninstall"]         = BOX.uninstall;
  BOX["deasciifySelection"]= BOX.deasciifySelection;
  BOX["asciifySelection"]  = BOX.asciifySelection;
  BOX["setOption"]         = BOX.setOption;
  BOX["setUILang"]         = BOX.setUILang;
  window["DeasciifyBox"]   = MEA.DeasciifyBox;
  
})(window["Deasciifier"], window["Asciifier"], MEA.EventHandler, MEA.TextSelection, MEA.TextHilite, MEA.TextHelper, MEA.CorrectionMenu, MEA.OptionSet);
