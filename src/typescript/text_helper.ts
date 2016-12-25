import { TextRange, KeyCode } from "./common"

export class TextHelper {
  // Returns true if the character c is a word seperator
  static isSeperatorChar(c: string): boolean {
    return (
      c == ' ' || c == '\n' || c == '\r' || c == '.' || c == ',' ||
      c == ';' || c == '?' || c == '!' || c == '(' || c == ')' || c == '<' ||
      c == '>' || c == '[' || c == ']' || c == '{' || c == '}' || c == '/' ||
      c == '\\' || c == '+' || c == '-' || c == '*' || c == '&' || c == '@' ||
      c == ':' || //c == '\'' ||
      c == '"' || c == '|' || c == '~' || c == '#' ||
      c == '%' || c == '^');
  }

  /** Returns true if cursor is inside a word. The following is the truth
   *  table:
   *  Cursor pos    | Return
   * ---------------+-------
   *  test str*ing  | true
   *  test *string  | false
   *  test string*  | false
   *  test* string  | false
   *  *test string  | false
   */
  static isCursorInsideWord(text: string, cursorPos: number): boolean {
    if (cursorPos <= 0 || cursorPos >= text.length) {
      return false;
    }
    // Only true if the character before, the character after are not
    // seperators.
    return this.isSeperatorChar(text.charAt(cursorPos - 1)) == false &&
      this.isSeperatorChar(text.charAt(cursorPos)) == false;
  }

  /** Returns the boundaries of the word the cursor is on.
   */
  static getWordAtCursor(text: string, cursorPos: number): TextRange {
    // We are on a non-seperator character
    let seperatorAfterCursor = this.findNextWordSeperatorPos(text, cursorPos);
    let seperatorBeforeCursor = 0;
    if (seperatorAfterCursor > 0) {
      seperatorBeforeCursor =
        this.findPreviousWordSeperatorPos(text, seperatorAfterCursor - 1);
    }
    return new TextRange(seperatorBeforeCursor + 1, seperatorAfterCursor);
  }

  /** Returns the boundaries of the word right before the cursor. The very
   * first seperators before and after the cursor are searched and returned.
   */
  static getWordBeforeCursor(text: string, cursorPos: number): TextRange {
    // Move back until we find a non-seperator character:
    if (cursorPos >= text.length) {
      cursorPos = text.length - 1;
    }
    while (cursorPos >= 0 && this.isSeperatorChar(text.charAt(cursorPos))) {
      cursorPos--;
    }
    return this.getWordAtCursor(text, cursorPos);
  }


  // Returns true if the keycode c is a word seperator
  private static isSeperatorKeycode(c: number): boolean {
    return (
      c == KeyCode.SPACE ||    // space
      c == KeyCode.ENTER ||    // enter
      c == KeyCode.COMMA ||
      c == KeyCode.PERIOD ||
      c == KeyCode.FORWARD_SLASH ||
      c == KeyCode.DASH ||
      c == KeyCode.SEMICOLON);
    //c == 50 ||      ????
    //c == 56 ||      ???
    //c == 57 ||      ???
    //c == 48);    ????
  }

  private static isWhiteSpace(c: string): boolean {
    return c == ' ' || c == '\n' || c == '\r' || c == '\t';
  }

  private static getPreviousWhiteSpacePos(text: string, currentPos: number): number {
    for (let i: number = currentPos; i >= 0; i--) {
      if (this.isWhiteSpace(text.charAt(i))) {
        return i;
      }
    }
    return -1;
  }

  private static getNextWhiteSpacePos(text: string, currentPos: number): number {
    for (let i: number = currentPos; i < text.length; i++) {
      if (this.isWhiteSpace(text.charAt(i))) {
        return i;
      }
    }
    return -1;
  }

  // Finds the first word seperator before the current cursor position.
  // "a str<cursor>ing here" will return the position of "s"
  private static findPreviousWordSeperatorPos(
    text: string, cursorPos: number): number {
    for (let i: number = cursorPos; i >= 0; i--) {
      if (this.isSeperatorChar(text.charAt(i))) {
        return i;
      }
    }
    return -1;
  }

  // Finds the next word seperator after the current cursor position:
  // "a str<cursor>ing here" will return the position of "g"
  private static findNextWordSeperatorPos(text: string, cursorPos: number): number {
    for (let i: number = cursorPos; i < text.length; i++) {
      if (this.isSeperatorChar(text.charAt(i))) {
        return i;
      }
    }
    return text.length;
  }

  /*private static setSubstring(
    text: string, start: number, end: number, substr: string): string {
    return text.substring(0, start) + substr + text.substring(end);
  }
  */
  /** Returns a list of positions of different characters */
  /*private static getChangedPositions(
    originalText: string, changedText: string): Array<number> {
    let changedPositions: number[] = [];
    for (let i = 0; i < originalText.length && i < changedText.length; i++) {
      if (originalText.charAt(i) != changedText.charAt(i)) {
        changedPositions.push(i);
      }
    }
    return changedPositions;
  }*/
}
