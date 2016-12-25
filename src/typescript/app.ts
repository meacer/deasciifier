/// <reference path="./common.ts" />
/// <reference path="./deasciifier.ts" />
/// <reference path="./correction_menu.ts" />

import {
  TextRange, Position, TextProcessor, TextProcessingOptions,
  TextResult, KeyCode
} from "./common"
import { Deasciifier, Asciifier } from "./deasciifier"
import { CorrectionCallback, CorrectionMenu } from "./correction_menu"
import { KeyboardCallback, Keyboard } from "./keyboard"

class Options {
  public constructor(public highlightChanges: boolean) { }
}

interface TextEditor {
  getText(): string;
  setText(text: string, range?: TextRange): void;

  getSelection(): TextRange;
  setSelection(range: TextRange): void;

  highlightRanges(ranges: Array<TextRange>): void;
  clearHighlights(): void;

  // Returns absolute coordinates of the character at |index|.
  getPosition(index: number): Position;
  // Returns the line height in pixel.
  getLineHeight(): number;

  // Simulates typing |text| at the cursor position.
  putAtCursor(text: string): void;
  // Simulates pressing backspace key at the cursor position.
  deleteCursor(): void;

  // Set focus to the editor.
  focus(): void;
}

interface TextEditorEventListener {
  onkeyup(keyCode: number): void;
  onclick(): void;
}

class CodeMirrorEditor implements TextEditor {
  constructor(
    private editor: any, private eventListener: TextEditorEventListener) {
    editor.getWrapperElement().onkeyup = function (e: any) {
      eventListener.onkeyup(e.keyCode);
    }
    editor.getWrapperElement().onclick = function (e: any) {
      eventListener.onclick();
    }
  }

  public setText(text: string, range?: TextRange) {
    if (range) {
      let rangeStart = this.editor.posFromIndex(range.start);
      let rangeEnd = this.editor.posFromIndex(range.end);
      this.editor.replaceRange(text, rangeStart, rangeEnd);
    } else {
      this.editor.setValue(text);
    }
  }

  public getText(): string {
    return this.editor.getValue();
  }

  public getSelection(): TextRange {
    let start = this.editor.indexFromPos(this.editor.getCursor(true));
    let end = this.editor.indexFromPos(this.editor.getCursor(false));
    return new TextRange(start, end);
  }

  public setSelection(range: TextRange) {
    let rangeStart = this.editor.posFromIndex(range.start);
    let rangeEnd = this.editor.posFromIndex(range.end);
    this.editor.setSelection(rangeStart, rangeEnd);
  }

  public highlightRanges(ranges: Array<TextRange>) {
    for (let range of ranges) {
      let rangeStart = this.editor.posFromIndex(range.start);
      let rangeEnd = this.editor.posFromIndex(range.end);
      this.editor.markText(
        rangeStart, rangeEnd,
        { readOnly: true, className: 'test-css' });
    }
  }

  public clearHighlights() {
    // Not implemented
  }

  public getPosition(index: number): Position {
    let linech = this.editor.posFromIndex(index);
    let coords = this.editor.charCoords(linech);
    return <Position>{ left: coords.left, top: coords.top };
  }

  public getLineHeight(): number {
    return this.editor.defaultTextHeight();
  }

  public putAtCursor(text: string) {
    let selection = this.getSelection();
    this.setText(text, selection);
  }

  public deleteCursor(): void {
    this.editor.execCommand("delCharBefore");
  }

  public focus(): void {
    this.editor.focus();
  }
}

enum TextProcessorMode {
  DEASCIIFY,
  ASCIIFY
}

class DeasciifyProcessor implements TextProcessor {
  private processor: TextProcessor;
  constructor(
    private deasciifier: Deasciifier, private asciifier: Asciifier) {
    this.processor = deasciifier;
  }

  public setMode(mode: TextProcessorMode) {
    if (mode == TextProcessorMode.DEASCIIFY)
      this.processor = this.deasciifier;
    else
      this.processor = this.asciifier;
  }

  public processRange(
    text: string, range: TextRange,
    options: TextProcessingOptions): TextResult {
    return this.processor.processRange(text, range, options);
  }

  public process(text: string, options: TextProcessingOptions): TextResult {
    return this.processor.process(text, options);
  }
}

class TextHelper {
  // Returns true if the keycode c is a word seperator
  static isSeperatorKeycode(c: number): boolean {
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

  static isWhiteSpace(c: string): boolean {
    return c == ' ' || c == '\n' || c == '\r' || c == '\t';
  }

  static getPreviousWhiteSpacePos(text: string, currentPos: number): number {
    for (let i: number = currentPos; i >= 0; i--) {
      if (this.isWhiteSpace(text.charAt(i))) {
        return i;
      }
    }
    return -1;
  }

  static getNextWhiteSpacePos(text: string, currentPos: number): number {
    for (let i: number = currentPos; i < text.length; i++) {
      if (this.isWhiteSpace(text.charAt(i))) {
        return i;
      }
    }
    return -1;
  }

  // Finds the first word seperator before the current cursor position.
  // "a str<cursor>ing here" will return the position of "s"
  static findPreviousWordSeperatorPos(
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
  static findNextWordSeperatorPos(text: string, cursorPos: number): number {
    for (let i: number = cursorPos; i < text.length; i++) {
      if (this.isSeperatorChar(text.charAt(i))) {
        return i;
      }
    }
    return text.length;
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

  static setSubstring(
    text: string, start: number, end: number, substr: string): string {
    return text.substring(0, start) + substr + text.substring(end);
  }

  /** Returns a list of positions of different characters */
  static getChangedPositions(
    originalText: string, changedText: string): Array<number> {
    let changedPositions: number[] = [];
    for (let i = 0; i < originalText.length && i < changedText.length; i++) {
      if (originalText.charAt(i) != changedText.charAt(i)) {
        changedPositions.push(i);
      }
    }
    return changedPositions;
  }
}

class CorrectionCallbackImpl implements CorrectionCallback {
  constructor(private box: DeasciiBox) { }
  onchange(text: string) {
    this.box.oncorrectiontextchange(text);
  }
}

class DeasciiBox {
  private options_: Options;
  private correctionMenu: CorrectionMenu;
  private correctionMenuSelection: TextRange;

  constructor(
    private textEditor: TextEditor,
    private textProcessor: DeasciifyProcessor) {
    this.options_ = new Options(true);
    this.correctionMenuSelection = null;
    this.correctionMenu =
      new CorrectionMenu(new CorrectionCallbackImpl(this));
  }

  public oncorrectiontextchange(text: string) {
    this.textEditor.setText(text, this.correctionMenuSelection);
  }

  public onkeyup(keyCode: number) {
    if (TextHelper.isSeperatorChar(String.fromCharCode(keyCode))) {
      this.deasciifyCursor();
    }
  }

  public onclick() {
    let selectionRange = this.textEditor.getSelection();
    // Since this is a mouse up event, we expect start and end positions
    // to be the same. TODO: Is this always the case?
    if (selectionRange.start != selectionRange.end) {
      throw new Error("Unexpected condition");
    }
    let cursorPos = selectionRange.start;
    let text: string = this.textEditor.getText();
    // Only show the menu if we are in the middle of a word
    if (!TextHelper.isCursorInsideWord(text, cursorPos)) {
      this.correctionMenu.hide();
      return;
    }
    let wordBoundary = TextHelper.getWordAtCursor(text, cursorPos);
    let wordText = text.substring(wordBoundary.start, wordBoundary.end);

    // Don't show menu if there is nothing to suggest
    if (!CorrectionMenu.hasCorrections(wordText)) {
      this.correctionMenu.hide();
      return;
    }

    let startCoords = this.textEditor.getPosition(wordBoundary.start);
    let endCoords = this.textEditor.getPosition(wordBoundary.end);

    let middleX = (startCoords.left + endCoords.left) / 2;
    let menuCoords = <Position>{
      left: middleX,
      top: startCoords.top + this.textEditor.getLineHeight()
    }

    this.correctionMenuSelection = wordBoundary;
    this.correctionMenu.show(menuCoords, wordText);
  }

  private deasciifyCursor() {
    let selectionRange = this.textEditor.getSelection();
    let rangeToDeasciify: TextRange = null;
    let text = this.textEditor.getText();
    if (selectionRange.start == selectionRange.end) {
      // No text selected. Get the boundaries of the last word that is
      // seperated by space, enter etc.
      rangeToDeasciify =
        TextHelper.getWordBeforeCursor(text, selectionRange.start);
    } else {
      // A portion of the text is already selected. Deasciify only the
      // selected part.
      rangeToDeasciify = selectionRange;
    }
    // Deasciify the range.
    let result =
      this.textProcessor.processRange(text, rangeToDeasciify, null);
    // Highlight the results.
    this.displayResult(result);
    // Restore cursor.
    this.textEditor.setSelection(selectionRange);
  }

  /** Displays the conversion results in the textbox and highlights the
   * converted characters if necessary.
   */
  private displayResult(result: TextResult) {
    if (result && result.text) {
      this.textEditor.setText(result.text);
      this.highlightChanges(result.changedPositions, false);
    }
  }

  private highlightChanges(
    changedPositions: Array<number>, forceClear: boolean) {
    // Highlight results.
    if (!this.options_.highlightChanges) {
      return;
    }
    if ((!changedPositions || changedPositions.length == 0) && !forceClear) {
      return;
    }
    this.textEditor.clearHighlights();
    let ranges = new Array<TextRange>();
    for (let i = 0; i < changedPositions.length; i++) {
      ranges.push(
        new TextRange(changedPositions[i], changedPositions[i] + 1));
    }
    this.textEditor.highlightRanges(ranges);
  }

  public hideCorrectionMenu() {
    this.correctionMenu.hide();
  }

  public processSelection(mode: TextProcessorMode) {
    let range = this.textEditor.getSelection();
    if (range.start == range.end) {
      range = <TextRange>{ start: 0, end: this.textEditor.getText().length };
    }
    this.textProcessor.setMode(mode);
    let result =
      this.textProcessor.processRange(this.textEditor.getText(), range, null);
    this.textEditor.setText(result.text, range);
    this.highlightChanges(result.changedPositions, false);
  }
}

class KeyboardHandler implements KeyboardCallback {
  constructor(private app: App, private editor: TextEditor) { }
  onKey(key: string) {
    this.app.hideCorrectionMenu();
    this.editor.focus();
    if (key == "backspace") {
      this.editor.deleteCursor();
      return;
    }
    this.editor.putAtCursor(key);
  }
}

// The actual app.
export class App implements TextEditorEventListener {
  private textEditor: TextEditor;
  private deasciiBox: DeasciiBox;
  private keyboardHandler: KeyboardHandler;
  private deasciifier_instance: Deasciifier;
  private asciifier_instance: Asciifier;
  private keyboard: Keyboard;

  constructor(
    codemirror: any, pattern_list: any, keyboard_container: HTMLDivElement) {
    this.deasciifier_instance = new Deasciifier();
    this.deasciifier_instance.init(pattern_list);
    this.asciifier_instance = new Asciifier();

    this.textEditor = new CodeMirrorEditor(codemirror, this);
    this.deasciiBox =
      new DeasciiBox(
        this.textEditor,
        new DeasciifyProcessor(
          this.deasciifier_instance, this.asciifier_instance));

    this.keyboard = new Keyboard(keyboard_container);

    this.keyboardHandler = new KeyboardHandler(this, this.textEditor);
    this.keyboard.create(this.keyboardHandler);
  }

  public deasciifySelection() {
    this.deasciiBox.processSelection(TextProcessorMode.DEASCIIFY);
  }

  public asciifySelection() {
    this.deasciiBox.processSelection(TextProcessorMode.ASCIIFY);
  }

  public hideCorrectionMenu() {
    this.deasciiBox.hideCorrectionMenu();
  }

  public onkeyup(keyCode: number) {
    this.deasciiBox.onkeyup(keyCode);
  }

  public onclick() {
    this.deasciiBox.onclick();
  }
}
