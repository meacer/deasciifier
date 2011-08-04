/**
 *  Textarea highlighting implementation for deasciifier
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *
 */
 
(function(CSS, TEXT_HELPER) {

  // Define constants:
  /** @const */ var ID_FOR_CURSOR     = "mea-texthilite-cursor-span";
  /** @const */ var TEXTHILITE_CSS    = "mea-texthl-";
  /** @const */ var CSS_WRAPPER_DIV   = TEXTHILITE_CSS + "wrap";
  /** @const */ var CSS_MIRROR_TEXT   = TEXTHILITE_CSS + "mirror";
  /** @const */ var CSS_TEXTAREA      = TEXTHILITE_CSS + "text";
  /** @const */ var CSS_HILITE_SPAN   = TEXTHILITE_CSS + "hl-span";
  /** @const */ var CSS_HILITE_WORD   = TEXTHILITE_CSS + "hl-word";
  /** @const */ var CSS_CURSOR_LAYER  = TEXTHILITE_CSS + "cursor-layer";
  
  var cssWrapper = [
    "z-index: 5;", 
    "position:absolute;", // This should be absolute to be able to position the wrapper under the textbox
    "display:inline-block;",
    "padding:0;",
    "box-sizing: border-box;",
    "-moz-box-sizing: border-box;"
  ];
  var cssMirror = [
    (window.BuildConfig && window.BuildConfig.TEXTHILITE_SHOW_BACKGROUND_TEXT ? "color:blue;":"color:white;"),
    "z-index:9;",
    //"overflow-x: auto;",
    "overflow-x: hidden;",
    "overflow-y: hidden;",
    "background: transparent"
  ];
  var cssTextArea = [
    "z-index: 20;",
    (window.BuildConfig && window.BuildConfig.TEXTHILITE_TRANSPARENT_TEXT ? "opacity:0.2; filter:alpha(opacity=20);" : ""),
    //"overflow-x: auto;",
    "overflow-x: hidden;",
    "overflow-y: hidden;",
    "background: transparent;",
    "color:black;",
    "position:relative;"
    //"resize:none;"              // disable resizing, the textbox will auto grow
  ];
  var cssCommon = [       // Common for textarea and pre
    "position:absolute;",     // TODO: This causes problems with textarea resizing, so keep it and disable resizing. Autogrow the textbox
    "left:0;top:0;",
    "right:0;bottom:0;"
    // borders are set programmatically
  ];
  var cssTextCommon = [        // Common for all items that show text
    //"font-weight: normal;",
    //"font-family:Arial;",
    //"font-size:16px;",
    //"text-transform: none;",
    //"text-decoration: none;",
    //"font-style: normal;",
    //"margin:0;",
    //"padding:4px;", // Padding:4px gives a nice padding but causes overflow in Safari
    //"direction:ltr;",
    //"text-align: left;",
    //"vertical-align: baseline;",
    //"line-height: 18px;",
    //"resize:none;",
    
    "box-sizing: border-box;",
    "-moz-box-sizing: border-box;",
    "white-space: pre-wrap;",
    "word-wrap: break-word;",
    "word-spacing:0;",
    "letter-spacing:0;"
  ];
  var cssHilite = [
    //"background:lightgreen;",
    "background: #A4FE2A;",
    "opacity:1.0;",
    "color:lightgreen;",
    "padding:0; margin:0;"
  ];
  
  // CSS styles for text highlighting
  var cssStyles = [
    ["."+CSS_WRAPPER_DIV,
      cssWrapper
    ],
    ["."+CSS_MIRROR_TEXT,
      [cssCommon.join(";") + ";" + cssTextCommon.join(";") + ";" + cssMirror.join(";")]
    ],
    ["."+CSS_CURSOR_LAYER,
      [cssCommon.join(";") + ";" + cssTextCommon.join(";") + ";" + cssMirror.join(";")]
    ],
    
    ["."+CSS_TEXTAREA,
      [/*cssCommon.join(";") + ";" + */cssTextCommon.join(";") + ";" + cssTextArea.join(";")]
    ],
    ["."+CSS_HILITE_SPAN, 
      [cssTextCommon.join(";") + ";" + cssHilite.join(";") + ";display:inline;"]
    ],
    ["."+CSS_HILITE_WORD,
      [cssTextCommon.join(";") + ";background-color:yellow; display:inline; word-wrap:none;"]
    ]
  ];
  // Initialize CSS:
  CSS.createStyles(cssStyles);
  
  // Adds children to a dom node using document fragment for performance:
  function addChildren(domNode, childNodes) {
    var fragment = document.createDocumentFragment();
    for (var i=0; i<childNodes.length; i++) {
      fragment.appendChild(childNodes[i]);
    }
    domNode.appendChild(fragment);
  }
  
  function createHiliteSpan(text) {
    var span = document.createElement("span");
    span.className = CSS_HILITE_SPAN;
    span.appendChild(document.createTextNode(text));
    span.setAttribute("class", CSS_HILITE_SPAN);
    return span;
  }
  
  function normalizeText(text) {
    //return text.replace(/\r\n/g, "\n"); //.replace("\n", "<br>");
    return text;
  }
  
  function sortFunc(a,b) {
    return a.start-b.start;
  }
  
  function replaceNewlines(text) {
    return text.replace(/((\r\n)|\n)/g, "<br/>");
  }
  
    
  var TEXTHILITE = {
    install:function(textArea, options) {
      var instance = new TEXTHILITE.INSTANCE(textArea);
      instance.createDOM(options);
      instance.update();
      return instance;
    }
  };
  
  /**
   * @constructor
   */
  TEXTHILITE.RANGE = function(start, end) {
    this.start = start;
    this.end = end;
  }
  
  /** Represents the areas to be highlighted. Each hiliteArea corresponds to one
   * word that is delimited by whitespaces. This object is used to simulate 
   * word-wrapping behaviour, it contains a word in a <span> element and the 
   * actually hilited regions are children of this span. This way the wrapping
   * span element is not broken in the middle.
   * @constructor
   */
  TEXTHILITE.hiliteArea = function(start, end, text) {
    this.start = start;
    this.end = end;
    this.text = text;
    this.hiliteRanges = [];
    this.domNode = null;
  }
  
  TEXTHILITE.hiliteArea.prototype = {
    
    addRange:function(range) {
      this.hiliteRanges.push(range);
    },
    
    build:function() {
      this.domNode = document.createElement("span");
      CSS.setClass(this.domNode, CSS_HILITE_WORD);
      
      // Sort the hilite ranges:
      var childNodes = [];
      this.hiliteRanges = this.hiliteRanges.sort(sortFunc);
      var lastPos = 0;
      // Build a domNode from this hiliteRange
      for (var i=0; i<this.hiliteRanges.length; i++) {
        var range = this.hiliteRanges[i];
        var rangeStart = range.start-this.start;  // relative to the area's start
        var rangeEnd = range.end-this.start;      // relative to the area's start
        var unformattedText = this.text.substring(lastPos, rangeStart);
        childNodes.push(document.createTextNode(unformattedText));
        
        var hiliteNode = document.createElement("span");
        CSS.setClass(hiliteNode, CSS_HILITE_SPAN);
        hiliteNode.innerHTML = this.text.substring(rangeStart, rangeEnd);
        childNodes.push(hiliteNode);
        lastPos = rangeEnd;
      }
      if (lastPos<this.text.length) {
        childNodes.push(document.createTextNode(this.text.substring(lastPos)));
      }
      addChildren(this.domNode, childNodes);
    }
  };
  
  /**
   * @constructor
   */
  TEXTHILITE.INSTANCE = function(textArea) {
    this.textArea = textArea;
    this.hiliteRanges = [];     // TextHilite.RANGE
    this.lastHilitedPos = -1;   // The last cursor position which is highlighted.
                                // Used to check if cursor position is after the last highlighted position.
    
    this.wrapperDiv = null;     // The parent <div> element that wraps textarea and other elements
    this.overlayDiv = null;     // The <div> element that has a high z-index and shows before others. Used for popup menus.
    this.hiliteLayer = null;    // The element used for highlighting text
    this.cursorLayer = null;    // The element used for determining cursor coordinates 
  
    //this.placeholderDiv = null; // This element will be empty. It is used for measuring CSS width/heights.
    
    // Areas to be highlighted:
    this.hiliteAreasMap = {};
    this.hiliteAreas = [];
  }
  
  TEXTHILITE.INSTANCE.prototype = {
  
    getParentNode:function() {
      return this.wrapperDiv;
    },

    updateDimensions:function() {
      
      var textDimensions = CSS.getDimensions(this.textArea);
      if (textDimensions.width==this.prevDimensions.width && textDimensions.height==this.prevDimensions.height) {
        return;
      }
      this.prevDimensions = textDimensions;

      log("Textarea: Width: " + textDimensions.width + ", Height: "+ textDimensions.height);
      log("Textarea: PrevWidth: " + this.prevDimensions.width + ", PrevHeight: "+ this.prevDimensions.height);
      log("Textarea: Relative Top: " + textDimensions.relativeTop + ", Relative Left: " + textDimensions.relativeLeft);
      
      this.wrapperDiv.style.top = textDimensions.relativeTop + "px";
      this.wrapperDiv.style.left = textDimensions.relativeLeft + "px";
      
      // placeholderDiv has zero width and height but some borders. Based on what 
      // we receive from getDimensions, we will use it to adjust the width for different
      // browsers. E.g. if we receive width=0, this means browser ignores borders.
      /*var placeholderDimensions = CSS.getDimensions(this.placeholderDiv);
      if (placeholderDimensions.width==1 && placeholderDimensions.height==1) {
        // getDimensions returned the width and height including the borders. 
        // Remove borders from the width:
        //textDimensions.width += CSS.getBorderWidth(this.textArea);
        //textDimensions.height += CSS.getBorderHeight(this.textArea);
      }*/
      CSS.setWidth(this.wrapperDiv, textDimensions.width);
      CSS.setHeight(this.wrapperDiv, textDimensions.height);
      
      CSS.setWidth(this.cursorLayer, textDimensions.width);
      CSS.setHeight(this.cursorLayer, textDimensions.height);
      
      CSS.setWidth(this.hiliteLayer, textDimensions.width);
      CSS.setHeight(this.hiliteLayer, textDimensions.height);
    },
 
    createDOM:function(options) {
    
      this.textArea.style.zIndex = 20;
      this.textZIndex = 20;//this.textArea.style.zIndex ? parseInt(this.textArea.style.zIndex, 10): 10;
      this.options = options;

      // Create the wrapping (parent) div
      this.wrapperDiv = document.createElement("div");
      CSS.setClass(this.wrapperDiv, CSS_WRAPPER_DIV);
      CSS.setStyles(this.wrapperDiv, {"zIndex":this.textZIndex}); // Send the wrapper div to the background
      if (this.options.get("resizeable", true)) {
        CSS.setStyles(this.textArea, {"resize":"both"});
      }
      
      // No need to copy margins as wrapperDiv is absolute positioned anyway:
      CSS.copyStyles(this.wrapperDiv, this.textArea, ["background*"]);
      // Make the textarea transparent:
      CSS.setClass(this.textArea, CSS_TEXTAREA);
      CSS.setStyles(this.textArea, {"background":"transparent"});
      
      // This will hold popup menus etc
      this.overlayDiv = document.createElement("div");
      CSS.setStyles(this.overlayDiv, {"position":"absolute", "zIndex":999});
      
      // Create the element which will be a mirror of the textarea
      this.hiliteLayer = document.createElement("div");
      CSS.setClass(this.hiliteLayer, CSS_MIRROR_TEXT);
      CSS.setStyles(this.hiliteLayer, {"zIndex":this.textZIndex - 1}); // Send the mirroring pre to the background

      // Create the element used for obtaining text coordinates:
      this.cursorLayer = document.createElement("div");
      CSS.setClass(this.cursorLayer, CSS_CURSOR_LAYER);
      CSS.setStyles(this.cursorLayer, {
        "visibility":"hidden",        // We don't need to show this
        "zIndex":this.textZIndex - 2
      }); 
      
      // Copy css properties starting with the following from textarea to the clone elements:
      var stylesToCopy = [
        "border-left-color", "border-left-width", "border-left-style", 
        "border-right-color", "border-right-width", "border-right-style", 
        "border-top-color", "border-top-width",  "border-top-style", 
        "border-bottom-color", "border-bottom-width", "border-bottom-style",
        "padding-left", "padding-top", "padding-right", "padding-bottom",
        
        "font-family", "font-size", "font-style", "font-weight",
        //"text*",
        "text-align", "text-decoration", "text-transform",
        "line-height",
        "direction",
        "vertical-align"];
      CSS.copyStyles(this.cursorLayer, this.textArea, stylesToCopy);
      CSS.copyStyles(this.hiliteLayer, this.textArea, stylesToCopy);
      
      //this.placeholderDiv = document.createElement("div");
      //CSS.copyStyles(this.placeholderDiv, this.textArea, stylesToCopy);
      //CSS.setStyles(this.placeholderDiv, {"width":"1px", "height":"1px"});
      
      // Make the borders white because on Safari and IE6 they don't match exactly with the textarea:
      var borderStyles = {
        "border-left-color":"white", 
        "border-right-color":"white", 
        "border-top-color":"white", 
        "border-bottom-color":"white"
      };
      CSS.setStyles(this.cursorLayer,    borderStyles);
      CSS.setStyles(this.hiliteLayer,    borderStyles);
      //CSS.setStyles(this.placeholderDiv, borderStyles);
      
      // Add the mirroring <pre> inside the wrapper div:
      this.wrapperDiv.appendChild(this.hiliteLayer);
      this.wrapperDiv.appendChild(this.cursorLayer);
      //this.wrapperDiv.appendChild(this.placeholderDiv);
      this.textArea.parentNode.insertBefore(this.overlayDiv, this.textArea);
      this.textArea.parentNode.insertBefore(this.wrapperDiv, this.textArea);
      
      this.prevDimensions = {};
      this.update();
    },
  
    getText:function() {
      return this.textArea.value;
    },
    
    getHiliteArea:function(startPos) {
      return this.hiliteAreasMap[startPos];
    },
    
    createHiliteArea:function(start, end) {
      var text = this.getText().substring(start, end);
      var hiliteArea = new TEXTHILITE.hiliteArea(start, end, text);
      this.hiliteAreas.push(hiliteArea);
      // Also add to a map for fast querying:
      this.hiliteAreasMap[start] = hiliteArea;
      return hiliteArea;
    },
  
    /** Rebuilds and displays the highlighted regions for this highlighter's textbox
     */
    update:function() {
      
      this.hiliteRanges = this.hiliteRanges.sort(sortFunc);
      var fullText = this.getText();
      
      // Set hilite styles if options override them:
      var hiliteStyles = this.options["hiliteStyles"] || "";

      var lastPos = 0;
      var htmlCodes = [];
      for (var i=0; i<this.hiliteRanges.length; i++) {
        var range = this.hiliteRanges[i];
        // Add unformatted text:
        htmlCodes.push(fullText.substring(lastPos, range.start));
        
        // Add formatted text:
        var hiliteText = fullText.substring(range.start, range.end);
        htmlCodes.push("<span class='" + CSS_HILITE_SPAN + "' style='" + hiliteStyles + "'>" + hiliteText + "</span>");
        lastPos = range.end;
      }
      if (lastPos>0) {
        // Add any remaining unformatted text:
        htmlCodes.push(fullText.substring(lastPos));
      }
      
      // Replace line breaks (\n or \r\n) with <br>s 
      this.hiliteLayer.innerHTML = replaceNewlines(htmlCodes.join(""));
      this.updateDimensions();
    },
  
    _update:function() {
    
      // Sort the ranges
      //this.hiliteRanges = this.hiliteRanges.sort(sortFunc);
      this.hiliteAreas = this.hiliteAreas.sort(sortFunc);
        
      this.updateDimensions();
      //var fullText = normalizeText(this.getText());
      var fullText = this.getText();
      
      // Update and build the html for hiliteAreas
      for (var i=0; i<this.hiliteAreas.length; i++) {
        this.hiliteAreas[i].build();
      }
      
      var childNodes = [];
      var strings = [];
      var lastPos = 0;
      /*for (var i=0; i<this.hiliteRanges.length; i++) {
        var range = this.hiliteRanges[i];
        var substr = fullText.substring(lastPos, range.start);
        childNodes.push(document.createTextNode(substr));
        
        var hiliteStr = fullText.substring(range.start, range.end);
        
        childNodes.push(createHiliteSpan(hiliteStr));
        lastPos = range.end;
      }*/
      function addLine(lineText) {
        if (lineText.length>0) {
          if (lineText=="<br>") {
            lineText = "&nbsp;<br>";
          }
          var span = document.createElement("span");
          span.innerHTML = lineText;
          span.setAttribute("style", "background-color:orange; display:block; clear:both");
          childNodes.push(span);
        }
      }
      // Adds a new span for every line seperated with \n
      function addMultilineText(unformattedText) {
        var lineText = "";
        for (var k=0; k<unformattedText.length; k++) {
          var c = unformattedText.charAt(k);
          if (c!='\n' && c!='\r') {
            lineText += c;
          } else if (c=='\n') {
            lineText += "<br>";
            addLine(lineText);
            lineText = "";
          }
        }
        // Add any remaining text:
        addLine(lineText);
      }
      
      for (var i=0; i<this.hiliteAreas.length; i++) {
        var area = this.hiliteAreas[i];
        var unformattedText = fullText.substring(lastPos, area.start);
        // Add text until the hilitearea:
        //childNodes.push(document.createTextNode(normalizeText(unformattedText)));
        addMultilineText(unformattedText);

        /*
        var unformattedLines = unformattedText.split("\n");
        for (var k=0; k<unformattedLines.length; k++) {
          var span = document.createElement("span");
          var unformattedLine = unformattedLines[k];
          if (k!=unformattedLines.length-1) {
            unformattedLine += "<br>";
          }
          span.innerHTML = unformattedLine;
          //span.style = 
          span.setAttribute("style", "background-color:orange");
          childNodes.push(span);
        }*/
        
        // Add the hilitearea itself:
        childNodes.push(area.domNode);
        lastPos = area.end;
      }
      // Add the last item:
      if (lastPos<fullText.length) {
        addMultilineText(fullText.substring(lastPos));
        //childNodes.push(document.createTextNode(fullText.substring(lastPos)));
      }
      
      // Use document fragment to speed up adding child nodes:
      // (See http://code.google.com/speed/articles/javascript-dom.html)
      this.hiliteLayer.innerHTML = "";
      addChildren(this.hiliteLayer, childNodes);
      this.updateDimensions();
    },
    
    /** Returns the pixel coordinates of the given word within the textarea
     *  @param wordStart Index of the first character of the word 
     *  @param wordEnd Index of the last character of the word
     */
    getCoordsFromWord:function(wordStart, wordEnd) {
      // Insert a temporary <span> element into the cursorPos and return the
      // CSS offset of the span. Finally remove the temporary span element.
      var fullText = this.getText();

      var textBefore = fullText.substring(0, wordStart);        // Text before cursor
      var textCursor = fullText.substring(wordStart, wordEnd);  // Word between the given coords
      var textAfter = fullText.substring(wordEnd);              // Text after cursor, required for word breaks
      
      var html = textBefore + 
        "<span id='" + ID_FOR_CURSOR +"' style='display:inline'>" + textCursor + "</span>" + textAfter;
      this.cursorLayer.innerHTML = replaceNewlines(html);
      var cursorNode = document.getElementById(ID_FOR_CURSOR);
      return CSS.getDimensions(cursorNode);
    },

    /** Removes all highlight regions. No text will be highlighted
     */
    clear:function() {
      this.hiliteRanges = [];
      this.lastHilitedPos = -1;
      
      this.hiliteAreas = [];
      this.hiliteAreasMap = {};
    },

    /** Adds a highlight range for the textbox
     *  @param start Starting position of the highlight region
     *  @param end End position of the highlight region
     */
    hiliteRange:function(start, end) {
      // TODO: handle range intersections:
      if (start>=end) {
        return;
      }
      var range = new TEXTHILITE.RANGE(start, end);
      this.hiliteRanges.push(range);
      // Update the last highlighted position:
      if (this.lastHilitedPos==-1 || end>this.lastHilitedPos) {
        this.lastHilitedPos = end;
      }
      
      // Check if we already have a hiliteArea item for this range. Search for the
      // first whitespace before the start. We assume that there are no whitespaces
      // between start and end:
      var prevWhiteSpace = TEXT_HELPER.getPreviousWhiteSpacePos(this.getText(), start);
      var existingHiliteArea = this.getHiliteArea(prevWhiteSpace+1);
      if (existingHiliteArea) {
        existingHiliteArea.addRange(range);
      } else {
        // Create a new hilite area and add the range
        var nextWhiteSpace = TEXT_HELPER.getNextWhiteSpacePos(this.getText(), start);
        var hiliteArea = this.createHiliteArea(prevWhiteSpace+1, nextWhiteSpace);
        hiliteArea.addRange(range);
      }
    },
    
    /** Sets highlight ranges for the textbox
     *
     *  @param ranges Array of TEXTHILITE.RANGE objects
     */
    setHiliteRanges:function(ranges) {
      this.hiliteRanges = ranges;
      // Sorting is done at the update() method
      
      // Update the last highlighted position:
      for (var i=0; i<ranges.length; i++) {
        if (this.lastHilitedPos==-1 || ranges[i].end>this.lastHilitedPos) {
          this.lastHilitedPos = ranges[i].end;
        }
      }
    },
  
    /** Clear all highlighted regions if the cursor position is before any of the 
     *  regions (such as a new word is entered in the middle of a long text, where 
     *  there are highlighted regions after the cursor). We are doing this to prevent
     *  showing any highlighted regions out of order.
     */
    clearIfCursorIsBeforeLastHilite:function(cursorPos) {
      if (cursorPos<this.lastHilitedPos) {
        this.clear();
        this.update();
      }
    }
  };
  
  MEA.TextHilite = TEXTHILITE;
  
})(MEA.CSS, MEA.TextHelper);
