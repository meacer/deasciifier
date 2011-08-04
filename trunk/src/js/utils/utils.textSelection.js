/** A cross browser text selection code. Simplifies getting/setting text
 *  selection ranges for textboxes and textareas in HTML pages.
 *
 *  Author:  Mustafa Emre Acer
 *  Version: 1.0
 *  Date:    May 29, 2011
 */
 
(function(){

  /**
   * @constructor
   */
  var SelectionRange = function(start, end, startRestore, endRestore, isIE) {
    this.start = start;
    this.end = end;
    this.startRestore = startRestore;
    this.endRestore = endRestore;
    this.isIE = isIE;
  }
  
  function createRange(start, end, startRestore, endRestore, isIE) {
    return new SelectionRange(start, end, startRestore, endRestore, isIE);
  };
  
  // IE Text selection code, Courtesy Tim Down, from http://stackoverflow.com/questions/235411/
  // Modified for IE 9
  function getIEInputSelection(el) {

    var start = 0, end = 0;
    var startOffset, endOffset; // How many characters do start and end skew by?  
    var range = document.selection.createRange();
    var rangeParent = range.parentElement();
    if (range && rangeParent == el) {
      var len = el.value.length;
      
      // Create a working Range that lives only in the input
      var textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());
      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      var endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        start = end = len;
        startOffset = 0;
        endOffset = 0;
      } else {
        start = -textInputRange.moveStart("character", -len);
        var normalizedValue = el.value.replace(/\r\n/g, "\n");
        var isSkewed = (normalizedValue.length!=len); // True for Pre IE9s
        if (isSkewed) {
           // Older IEs where linebreaks are \r\n
          startOffset = normalizedValue.slice(0, start).split("\n").length - 1;
          start += startOffset;
        } else {
          // IE 9 where linebreaks are \n only
          startOffset = 0;
        }
        
        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd("character", -len);
          if (isSkewed) { // Pre IE9
            endOffset = normalizedValue.slice(0, end).split("\n").length - 1;
            end += endOffset;
          } else {  // IE 9+
            endOffset = 0;
          }
        }
      }
    }
    return createRange(start, end, start-startOffset, end-endOffset, true);
  };
  
  function setIEInputSelection(textElement, range) {
    // Restore cursor
    var newRange = textElement.createTextRange();
    newRange.collapse(true);
    newRange.moveStart("character", range.startRestore);
    newRange.moveEnd  ("character", range.endRestore-range.startRestore);
    newRange.select();
  };

  
  MEA.TextSelection = {
    
    // Selects the portion of the textElement given with range parameter
    getRange:function(textElement) {
      if (document.selection) {
        // IE
        return getIEInputSelection(textElement);
      } else {
        // Others
        return createRange(
          textElement.selectionStart, 
          textElement.selectionEnd, 
          textElement.selectionStart,
          textElement.selectionEnd, 
          false); // isIE
      }
    },
    
    // Selects the portion of the textElement given with range parameter
    setRange:function(textElement, range) { // range: typeof Range
      if (document.selection) {
        // IE:
        setIEInputSelection(textElement, range);
      } else {
        // Others:
        textElement.selectionStart = range.start;
        textElement.selectionEnd = range.end;
      }
    },
    
    // TODO: Fix line breaks for IE
    setSelectionText:function(textElement, newText) {
      var selection = this.getRange(textElement);
      var selLength = selection.end - selection.start;
      textElement.value = textElement.value.substring(0, selection.start) + newText + textElement.value.substring(selection.end);
      var diff = (newText.length-selLength);
      if (selLength==0) {
        // No selection. Both start and end increases:
        selection.start+=diff;
        selection.end+=diff;
        selection.startRestore+=diff;
        selection.endRestore+=diff;
      } else {
        // There was some selection. Starting point doesn't change, end changes:
        selection.end+=diff;
        selection.endRestore+=diff;
      }
      // Restore selection:
      this.setRange(textElement, selection);
    },
    
    // TODO: Fix line breaks for IE
    deleteSelectionText:function(textElement) {
      var selection = this.getRange(textElement);
      var selLength = selection.end - selection.start;
      if (selLength==0) {
        // No selection. Both start and end decreases by one character:
        textElement.value = textElement.value.substring(0, selection.start-1) + textElement.value.substring(selection.end);
        selection.start--;
        selection.end--;
        selection.startRestore--;
        selection.endRestore--;
      } else {
        // There was some selection. Starting point doesn't change, end changes:
        textElement.value = textElement.value.substring(0, selection.start) + textElement.value.substring(selection.end);
        selection.end = selection.start;
        selection.endRestore = selection.end;
      }
      // Restore selection:
      this.setRange(textElement, selection);
    }
  };
  
})();

