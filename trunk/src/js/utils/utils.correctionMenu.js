/**
 *  Correction menu for deasciify box. Pops up a window which allows selection
 *  of different letters within a word.
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *
 */
 
(function(CSS, EVENT_HANDLER){

  /** @const */ var CSS_SUGGEST_MENU = "deasc-suggest-menu";
  /** @const */ var CSS_SUGGEST_MENU_CONTAINER = "deasc-suggest-menu-container";
  /** @const */ var CSS_SUGGEST_MENU_BTN_CONTAINER = "deasc-suggest-menu-btn-container";
  /** @const */ var CSS_SUGGEST_MENU_BTN = "deasc-suggest-menu-btn";
  /** @const */ var CSS_SUGGEST_MENU_BTN_CLOSE = "deasc-suggest-menu-btn-close";
  /** @const */ var CSS_SUGGEST_MENU_BTN_APPLY = "deasc-suggest-menu-btn-apply";
  
  /** @const */ var CSS_SUGGEST_ITEM = "deasc-suggest-item";
  /** @const */ var CSS_SUGGEST_ITEM_STATIC = "deasc-suggest-item-static";
  /** @const */ var CSS_SUGGEST_ITEM_STATIC_FIRST = "deasc-suggest-item-static-first";
  /** @const */ var CSS_SUGGEST_ITEM_STATIC_LAST  = "deasc-suggest-item-static-last";
  
  /** @const */ var CSS_SUGGEST_ITEM_DYNAMIC = "deasc-suggest-item-dynamic";
  /** @const */ var CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM = "deasc-suggest-item-dynamic-subitem";
  /** @const */ var CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_FIRST = "deasc-suggest-item-dynamic-subitem-first";
  /** @const */ var CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_LAST = "deasc-suggest-item-dynamic-subitem-last";
  /** @const */ var CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_BOTTOM = "deasc-suggest-item-dynamic-subitem-bottom";
  /** @const */ var CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_CHANGED = "deasc-suggest-item-dynamic-subitem-changed";
  /** @const */ var CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_SELECTED = "deasc-suggest-item-dynamic-subitem-selected";
  
  function initCSS() {
    CSS.createStyle("."+CSS_SUGGEST_MENU,
      "position:absolute; " +
      "display:none; " +
      "line-height: 24px; " + 
      "width:auto;" +
      "background: transparent;" + 
      "border: 0;" +
      "-webkit-user-select: none; -moz-user-select: none; " +
      "padding: 0; margin: 0;" +
      "word-wrap:none;" + 
      "float:left;" + 
      "vertical-align:top;" + 
      "cursor:default;" + 
      "z-index:998;" + 
      "box-sizing: border-box;" +
      "-moz-box-sizing: border-box;" +
      "white-space: nowrap;" +
      "outline: none; " // disable focus box
    );
    CSS.createStyle("."+CSS_SUGGEST_MENU_BTN_CONTAINER, "display:inline-block; float:left; margin-top:2px; margin-left:3px");
    CSS.createStyle("."+CSS_SUGGEST_MENU_BTN,
      "background: transparent url(static/img/v2.0/button-sprite.png) 0 0;" +
      "padding:0; margin:0;" +
      "margin-left:2px;" +
      "text-align:center; " +
      "line-height:15px;" +
      "vertical-align:middle;"+ 
      "width:20px; " +
      "height:20px; " +
      "font-family: Tahoma; " +
      "display:inline-block;" +
      "border:0;" +
      "cursor: pointer;" +
      "font-size:0");
    CSS.createStyle("."+CSS_SUGGEST_MENU_BTN_CLOSE,
      "background-position:0 0px;");
    CSS.createStyle("."+CSS_SUGGEST_MENU_BTN_CLOSE + ":hover",
      "background-position:0 -20px;");
    CSS.createStyle("."+CSS_SUGGEST_MENU_BTN_APPLY,
      "background-position:-20px 0px;");
    CSS.createStyle("."+CSS_SUGGEST_MENU_BTN_APPLY + ":hover",
      "background-position:-20px -20px;"); 
    
    CSS.createStyle("."+CSS_SUGGEST_MENU_CONTAINER,
      "position:relative; " +
      "display:inline-block; " +
      "line-height: 24px; " + 
      "color:#666; cursor: default; " +
      "-webkit-box-shadow: rgb(153, 153, 153) 0px 2px 5px 0px; " +
      "-moz-box-shadow: 0px 2px 5px #999999; " +
      "box-shadow: 0px 2px 5px #999; " +
      "height: 24px; " +
      "background: transparent;" + 
      "border-top: 1px solid #a1a1a1; " +
      "-webkit-user-select: none; -moz-user-select: none; " +
      "padding: 0; margin: 0;" +
      "word-wrap:none;" + 
      "white-space:nowrap;" +
      "float:left;" + 
      "vertical-align:top;" + 
      "cursor:default;" + 
      "outline: none; " // disable focus box
      );
    CSS.createStyle("."+CSS_SUGGEST_ITEM,
      "float:left; " +
      "background: #ECE9D8; " +
      "width:16px; " +
      "text-align:center; " +
      "text-decoration:none;" +
      "margin:0; padding:0;" +
      "vertical-align:top");
   
    // Static items. These are the characters that do not have alternatives, and don't have submenus:
    CSS.createStyle("."+CSS_SUGGEST_ITEM_STATIC,       "border-bottom: 1px solid #AEAEAE; ");
    CSS.createStyle("."+CSS_SUGGEST_ITEM_STATIC_FIRST, "border-left  : 1px solid #aaa");
    CSS.createStyle("."+CSS_SUGGEST_ITEM_STATIC_LAST,  "border-right : 1px solid #aaa");
    
    // Dynamic items. There are the characters with alternatives, and submenus:
    CSS.createStyle("."+CSS_SUGGEST_ITEM_DYNAMIC,      "cursor:pointer;");

    CSS.createStyle("."+CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM, 
      "border-bottom:1px solid #aaa; " +
      "clear:both; " +
      "display:block; " +
      "box-shadow: 0px 3px 5px #999;");
   CSS.createStyle("."+CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM + ":hover",   "background: #3875C9; color:#f8f8f8;"); // Won't work for IE
   CSS.createStyle("."+CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_FIRST,        "border-left:1px solid #aaa");
   CSS.createStyle("."+CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_LAST,         "padding-left:1px;border-right:1px solid #aaa"); // padding is for IE
   CSS.createStyle("."+CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_BOTTOM,       "border-left:1px solid #aaa; border-right:1px solid #aaa");
   CSS.createStyle("."+CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_CHANGED,      "background: lightgreen;");
   CSS.createStyle("."+CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_SELECTED,     "background: lightgreen; ");
  }
  initCSS();
  
  var correctionTable = {
    'c':['c', 'ç'],
    'g':['g', 'ğ'],
    'i':['i', 'ı'],
    'o':['o', 'ö'],
    's':['s', 'ş'],
    'u':['u', 'ü'],
    
    'C':['C', 'Ç'],
    'G':['G', 'Ğ'],
    'I':['I', 'İ'],
    'O':['O', 'Ö'],
    'S':['S', 'Ş'],
    'U':['U', 'Ü'],
    
    'ç':['c', 'ç'],
    'ğ':['g', 'ğ'],
    'ı':['i', 'ı'],
    'ö':['o', 'ö'],
    'ş':['s', 'ş'],
    'ü':['u', 'ü'],
    
    'Ç':['C', 'Ç'],
    'Ğ':['G', 'Ğ'],
    'İ':['I', 'İ'],
    'Ö':['O', 'Ö'],
    'Ş':['S', 'Ş'],
    'Ü':['U', 'Ü']
  };
  function getDeasciifyableChars(text) {
    var chars = [];
    for (var i=0; i<text.length; i++) {
      if (correctionTable[text.charAt(i)]) {
        var values = correctionTable[text.charAt(i)];
        chars.push({position:i, values:values});
      }
    }
    return chars;
  }
  
  MEA.CorrectionMenu = {
    hasCorrections:function(text) {
      return getDeasciifyableChars(text).length>0;
    },
    create:function(parentNode, onSelectHandler, onApplyToAllHandler) {
      var instance = new this.INSTANCE(parentNode, onSelectHandler, onApplyToAllHandler);
      instance.init();
      return instance;
    }
  }
  
  /**
   * @constructor
   */
  MEA.CorrectionMenu.ITEM = function(text, alternatives) {
    this.text = text;
    this.alternatives = alternatives;
  }
  /**
   * @constructor
   */
  MEA.CorrectionMenu.INSTANCE = function(parentNode, onSelectHandler, onApplyToAllHandler) {
    this.parentNode = parentNode;
    this.onSelectHandler = onSelectHandler;
    this.onApplyToAllHandler = onApplyToAllHandler;
    this.domNode = null;
    this.domItems = null;
    this.selectedIndex = -1;
  }
  
  MEA.CorrectionMenu.INSTANCE.prototype = {
  
    init:function() {
      this.domNode = document.createElement("div");
      this.parentNode.appendChild(this.domNode);
      CSS.setClass(this.domNode, CSS_SUGGEST_MENU);
      this.domNode.setAttribute("tabindex", -1);
    },
    
    getCurrentSelection:function() {
      // Get current suggestion:
      var changedPositions = [];
      var currentSuggestion = "";
      for (var i=0; i<this.originalText.length; i++) {
        var selected = this.subMenus[i].text;
        var original = this.originalText.charAt(i);
        if (original!=selected) {
          changedPositions.push(i);
        }
        currentSuggestion += selected;
      }
      var suggestion = {
        originalText: this.originalText,
        text:currentSuggestion, 
        changedPositions:changedPositions, 
        reset:false};
      return suggestion;
    },
    
    resetSelection:function() {
      // reset: true: User hit reset button
      var suggestion = {
        originalText: this.originalText,
        text:this.originalText, 
        changedPositions:[], 
        reset:true};
      return this.onSelectHandler(suggestion);
    },
    applySelectionToAll:function() {
      var suggestion = this.getCurrentSelection();
      return this.onApplyToAllHandler(suggestion);
    },
    
    onSubmenuItemClicked:function(submenuPos, menuItemIndex, selectedValue) {
      // Update the menu
      this.updateSubmenu(submenuPos, selectedValue);
      return this.onSelectHandler(this.getCurrentSelection());
    },
    
    updateSubmenu:function(submenuPos, selectedValue) {
      var subMenu = this.subMenus[submenuPos];
      this.buildSubmenu(subMenu.domNode, subMenu.alternatives, submenuPos, selectedValue);
    },
    
    buildSubmenu:function(parent, items, menuPos, selectedValue) {
      var instance = this;
      function getSubmenuItemClickedHandler(submenuPos, index, value) {
        return function(){
            return instance.onSubmenuItemClicked(submenuPos, index, value);
         };
      }
      function addItem(itemValue, itemPos, isTopItem) {
        var node = document.createElement("span");
        CSS.setClass(node, CSS_SUGGEST_ITEM + " " + CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM);
        if (!isTopItem) {
          CSS.addClass(node, CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_BOTTOM);
        }
        node.innerHTML = itemValue;
        parent.appendChild(node);
        EVENT_HANDLER.bindEvent(node, "click", getSubmenuItemClickedHandler(menuPos, itemPos, itemValue));
        return node;
      }
      this.subMenus[menuPos].text = selectedValue;
      parent.innerHTML = "";
      // First insert the selected item:
      var firstNode = addItem(selectedValue, 0, true);
      if (selectedValue!=this.originalText.charAt(menuPos)) {
        CSS.addClass(firstNode, CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_CHANGED);
      }
      if (menuPos==0) {
        CSS.addClass(firstNode, CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_FIRST);
      }
      if (menuPos==this.subMenus.length-1) {
        CSS.addClass(firstNode, CSS_SUGGEST_ITEM_DYNAMIC_SUBITEM_LAST);
      }
        
      // Then remaining items excluding the selected item
      for (var i=0; i<items.length; i++) {
        if (items[i]!=selectedValue) {
          addItem(items[i], i, false);
        }
      }
    },
    
    buildMenu:function(parentNode, horizontalMenuItems) {
    
      //var table = document.createElement("table");
      //var row = table.insertRow(0);
      //parentNode.appendChild(table);
      //parentNode = row;
      
      for (var i=0; i<horizontalMenuItems.length; i++) {
        var item = horizontalMenuItems[i];
        var child = document.createElement("div");
        //var child = row.insertCell(i);
        if (item.alternatives) {
          // Build a submenu
          CSS.setClass(child, CSS_SUGGEST_ITEM + " " + CSS_SUGGEST_ITEM_DYNAMIC);
          // Default selected item is the corresponding character from the original text:
          var selectedValue = item.text;
          this.buildSubmenu(child, item.alternatives, i, selectedValue);
        } else {
          // Build a static item
          CSS.setClass(child, CSS_SUGGEST_ITEM + " " + CSS_SUGGEST_ITEM_STATIC);
          child.innerHTML = item.text;
          if (i==0) {
            // Add a border to the left of the first item:
            CSS.addClass(child, CSS_SUGGEST_ITEM_STATIC_FIRST);
          } else if (i==horizontalMenuItems.length-1) {
            // Add a border to the right of the last item:
            CSS.addClass(child, CSS_SUGGEST_ITEM_STATIC_LAST);
          }
        }
        horizontalMenuItems[i].domNode = child;
        parentNode.appendChild(child);
      }
    },
    
    createButtons:function() {
      function createButton(text, tipText) {
        var btn = document.createElement("input");
        CSS.setClass(btn, CSS_SUGGEST_MENU_BTN);
        btn.type = "button";
        btn.value = text;
        btn.title = tipText;
        return btn;
      }
      // Add the buttons:
      var btnCancel = createButton("x", "\u0130ptal et");
      var btnApply = createButton("+", "T\u00FCm metne uygula");
      CSS.addClass(btnCancel, CSS_SUGGEST_MENU_BTN_CLOSE);
      CSS.addClass(btnApply, CSS_SUGGEST_MENU_BTN_APPLY);
      
      var btnContainer = document.createElement("div");
      CSS.setClass(btnContainer, CSS_SUGGEST_MENU_BTN_CONTAINER);
      
      btnContainer.appendChild(btnApply);
      btnContainer.appendChild(btnCancel);

      this.domNode.appendChild(btnContainer);
      var instance = this;
      function getResetSelectionHandler() {
        return function(){
          return instance.resetSelection(); 
        };
      }
      function getApplyAllHandler() {
        return function(){
          return instance.applySelectionToAll(); 
        };
      }
      EVENT_HANDLER.bindEvent(btnCancel, "click", getResetSelectionHandler());
      EVENT_HANDLER.bindEvent(btnApply,  "click", getApplyAllHandler());
    },
    
    createMenu:function(text) {
      var lastPos = 0;
      this.subMenus = [];
      for (var i=0; i<text.length; i++) {
        var horizontalMenuItem = null;
        var ch = text.charAt(i);
        if (correctionTable[ch]) {               // The character has alternative characters
          horizontalMenuItem = new MEA.CorrectionMenu.ITEM(ch, correctionTable[ch]);
        } else {
          horizontalMenuItem = new MEA.CorrectionMenu.ITEM(ch, null); // The character has no alternatives
        }
        this.subMenus.push(horizontalMenuItem);
      }
      var menuContainer = document.createElement("div");
      CSS.setClass(menuContainer, CSS_SUGGEST_MENU_CONTAINER);
      this.buildMenu(menuContainer, this.subMenus);
      this.domNode.appendChild(menuContainer);
    },
    
    show:function(leftCoord, topCoord, minWidth, text) {
     
      this.originalText = text;
      this.domNode.innerHTML = "";
      
      this.createMenu(text);
      this.createButtons();
      
      this.selectedIndex = -1;
      this.domNode.style.left = leftCoord + "px";
      this.domNode.style.top = topCoord + "px";
      //this.domNode.style.width = "auto";
      //this.domNode.style.zIndex = 999;
      this.domNode.style.display = "block";     // Show the menu
      
      var calculatedWidth = CSS.getWidth(this.domNode);
      if (calculatedWidth<minWidth) {
        this.domNode.style.width = minWidth + "px";
        calculatedWidth = minWidth;
      }
      
      // Fix for positioning:
      var body = document.body || document.getElementsByTagName("body")[0];
      if (this.parentNode==document.body) {
        this.domNode.style.position = "absolute";        
      } else {
        this.domNode.style.position = "relative";
      }
    },
    
    hide:function() {
      this.domNode.style.display = "none";      // Hide the menu
    },
    
    isVisible:function() {
      return (this.domNode.style.display == "block");
    }
    
    /*update:function() {

    },

    onKeyDown:function(keyCode) {
      
      switch(keyCode) {
        case EVENT_HANDLER.KeyCodes.ENTER:
          return this.onSelection();

        case EVENT_HANDLER.KeyCodes.DOWN_ARROW:
          this.selectedIndex++;
          if (this.selectedIndex>=this.items.length) {
            this.selectedIndex=0;
          }
          this.update();
          return true;
        
        case EVENT_HANDLER.KeyCodes.UP_ARROW:
          this.selectedIndex--;
          if (this.selectedIndex<0) {
            this.selectedIndex = this.items.length-1;
          }
          this.update();
          return true;
      }
      // Return false if key not handled
      return false;
    }*/
  }
  
})(MEA.CSS, MEA.EventHandler);
