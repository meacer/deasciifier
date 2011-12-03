/**
 *  Text helper for deasciifier
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *
 */

(function(){

  if (typeof(MEA)=="undefined") {
    MEA = {};
  }
  // NOTE: text[i] does not work in IE, always use text.charAt(i)
  
  MEA.TextHelper = {
    // Returns true if the keycode c is a word seperator 
    isSeperatorKeycode:function(c) {
      return (
        c==32  ||    // space 
        c==13  ||    // enter
        c==188 || 
        c==190 || 
        c==191 || 
        c==189 || 
        c==50  || 
        c==186 || 
        c==56  || 
        c==57  || 
        c==48);
    },
    
    // Returns true if the character c is a word seperator
    isSeperatorChar:function(c) {
      return (
        c==' ' || c=='\n' || c=='\r' || c=='.' || c==',' || c==';' || c=='?' || c=='!' ||
        c=='(' || c==')' || c=='<' || c=='>' || c=='[' || c==']' || c=='{' || c=='}' || 
        c=='/' || c=='\\' || c=='+' || c=='-' || c=='*' || c=='&' || c=='@' ||c==':' ||
        c=='\'' || c=='"' || c=='|' || c=='~' || c=='#' || c=='%' || c=='^');
    },
    
    isWhiteSpace:function(c) {
      return c==' ' || c=='\n' || c=='\r' || c=='\t';
    },
    
    getPreviousWhiteSpacePos:function(text, currentPos) {
      for (var i=currentPos; i>=0; i--) {
        if (this.isWhiteSpace(text.charAt(i))) {
          return i;
        }
      }
      return -1;
    },
    
    getNextWhiteSpacePos:function(text, currentPos) {
      for (var i=currentPos; i<text.length; i++) {
        if (this.isWhiteSpace(text.charAt(i))) {
          return i;
        }
      }
      return -1;
    },
    
    // Finds the first word seperator before the current cursor position.
    // "a str<cursor>ing here" will return the position of "s"
    findPreviousWordSeperatorPos:function(text, cursorPos) {
      for (var i=cursorPos; i>=0; i--) {
        if (this.isSeperatorChar(text.charAt(i))) {
          return i;
        }
      }
      return -1;
    },
    
    // Finds the next word seperator after the current cursor position:
    // "a str<cursor>ing here" will return the position of "g"
    findNextWordSeperatorPos:function(text, cursorPos) {
      for (var i=cursorPos; i<text.length; i++) {
        if (this.isSeperatorChar(text.charAt(i))) {
          return i;
        }
      }
      return text.length;
    },
    
    /** Returns true if cursor is inside a word. The following is the truth table:
     *  Cursor pos    | Return
     * ---------------+-------
     *  test str*ing  | true
     *  test *string  | false
     *  test string*  | false
     *  test* string  | false
     *  *test string  | false
     */
    isCursorInsideWord:function(text, cursorPos) {
      if (cursorPos<=0 || cursorPos>=text.length) {
        return false;
      }
      // Only true if the character before, the character after are not seperators
      return (
        this.isSeperatorChar(text.charAt(cursorPos-1))==false && 
        this.isSeperatorChar(text.charAt(cursorPos))==false);
    },
    
    /** Returns the boundaries of the word the cursor is on.
     */
    getWordAtCursor:function(text, cursorPos) {
      // We are on a non-seperator character
      var seperatorAfterCursor = this.findNextWordSeperatorPos(text, cursorPos);
      var seperatorBeforeCursor = 0;
      if (seperatorAfterCursor>0) {
        seperatorBeforeCursor = this.findPreviousWordSeperatorPos(text, seperatorAfterCursor-1);
      }
      return {start:seperatorBeforeCursor+1, end:seperatorAfterCursor};
    },
    
    /** Returns the boundaries of the word right before the cursor. The very first seperators
     *  before and after the cursor are searched and returned
     */
    getWordBeforeCursor:function(text, cursorPos) {
      var seperatorAfterCursor;
      // Move back until we find a non-seperator character:
      if (cursorPos>=text.length) {
        cursorPos = text.length-1;
      }
      while (cursorPos>=0 && this.isSeperatorChar(text.charAt(cursorPos))) {
        cursorPos--;
      }
      return this.getWordAtCursor(text, cursorPos);
    },
    
    setSubstring:function(text, start, end, substr) {
      return text.substring(0, start) + substr + text.substring(end);
    },
    
    /** Returns a list of positions of different characters 
    */
    getChangedPositions:function(originalText, changedText) {
      var changedPositions = [];
      for (var i=0; i<originalText.length && i<changedText.length; i++) {
        if (originalText.charAt(i)!=changedText.charAt(i)) {
          changedPositions.push(i);
        }
      }
      return changedPositions;
    }
  }
  
})();
