import { TextRange, KeyCode } from "./common"

export class TextHelper {
  // Returns true if the character c is a word separator
  static isSeparatorChar(c: string): boolean {
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
    // separators.
    return this.isSeparatorChar(text.charAt(cursorPos - 1)) == false &&
      this.isSeparatorChar(text.charAt(cursorPos)) == false;
  }

  /** Returns the boundaries of the word the cursor is on.
   */
  static getWordAtCursor(text: string, index: number): TextRange {
    let separator_after = this.findNextWordSeparatorIndex(text, index);
    let separator_before = 0;
    if (separator_after > 0) {
      separator_before =
        this.findPreviousWordSeparatorIndex(text, separator_after - 1);
    }
    return new TextRange(separator_before + 1, separator_after);
  }

  /** Returns the boundaries of the word before or at the given index.
   * If the character at index is a separator, moves back until finding a non-
   * separator character.
   */
  static getWordBeforeCursor(text: string, index: number): TextRange {
    // Move back until finding a non-separator character:
    if (index > text.length) {
      index = text.length;
    }
    index--;
    while (index >= 0 && this.isSeparatorChar(text.charAt(index))) {
      index--;
    }
    return this.getWordAtCursor(text, index);
  }

  // Returns true if the keycode c is a word separator
  private static isSeparatorKeycode(c: number): boolean {
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

  private static getPreviousWhiteSpaceIndex(text: string, index: number): number {
    for (let i: number = index; i >= 0; i--) {
      if (this.isWhiteSpace(text.charAt(i))) {
        return i;
      }
    }
    return -1;
  }

  private static getNextWhiteSpaceIndex(text: string, index: number): number {
    for (let i: number = index; i < text.length; i++) {
      if (this.isWhiteSpace(text.charAt(i))) {
        return i;
      }
    }
    return -1;
  }

  // Returns the index of the first word separator before the given index.
  // E.g. "a str*ing here" returns the index of the space before "s" (1).
  private static findPreviousWordSeparatorIndex(
    text: string, index: number): number {
    for (let i = index; i >= 0; i--) {
      if (this.isSeparatorChar(text.charAt(i))) {
        return i;
      }
    }
    return -1;
  }

  // Returns the index of the next word separator after the given index.
  // E.g. "a str*ing here" returns the index of the space after "g" (8).
  private static findNextWordSeparatorIndex(text: string, index: number): number {
    for (let i = index; i < text.length; i++) {
      if (this.isSeparatorChar(text.charAt(i))) {
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
