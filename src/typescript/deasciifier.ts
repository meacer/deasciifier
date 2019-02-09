/// <reference path="./common.ts" />
/// <reference path="./turkish.ts" />

import {
  TextProcessor, TextRange, TextProcessingOptions,
  TextFilter, TextResult
} from "./common"
import { TURKISH_ASCIIFY_TABLE, TURKISH_CHAR_ALIST } from "./turkish"

class SkipList implements TextFilter {
  constructor(private skipRegions: Array<TextRange>) { }

  public shouldExclude(pos: number): boolean {
    for (let i: number = 0; i < this.skipRegions.length; i++) {
      if (pos >= this.skipRegions[i].start &&
        pos <= this.skipRegions[i].end) {
        return true;
      }
    }
    return false;
  }
}

export class Asciifier implements TextProcessor {
  processRange(
    text: string, range: TextRange,
    options: TextProcessingOptions): TextResult {
    if (text === null) {
      return null;
    }
    // There seems to be a bug here. Chrome fails to convert long texts
    // correctly.
    let changedPositions: number[] = [];
    let output: Array<string> = new Array<string>(text.length);
    for (let i: number = 0; i < text.length; i++) {
      let ch: string = text.charAt(i);
      if (i >= range.start && i < range.end) {
        let toggled: string = TURKISH_ASCIIFY_TABLE[ch];
        if (toggled) {
          output[i] = toggled;
          changedPositions.push(i);
          continue;
        }
      }
      output[i] = ch;
    }
    return <TextResult>{
      text: output.join(""),
      changedPositions: changedPositions
    };
  }

  process(text: string, options: TextProcessingOptions): TextResult {
    if (!text) {
      return null;
    }
    return this.processRange(
      text, <TextRange>{ start: 0, end: text.length }, options);
  }
}

export const URL_REGEX: RegExp
  = /\b((((https?|ftp|file):\/\/)|(www\.))[^\s]+)/gi;

export const EMAIL_REGEX: RegExp
  = /((^|\s).*)?@(.*\s)?/gi;

class DefaultSkipFilter {
  static getSkipRegions(
    options: TextProcessingOptions, text: string): SkipList {
    // TODO: Better algorithm here if number of regions grow large
    let regexps: Array<RegExp> = [];
    if (options && options.skipURLs) {
      regexps.push(URL_REGEX);
      regexps.push(EMAIL_REGEX);
    }
    let skipList: Array<TextRange> = [];
    for (let i = 0; i < regexps.length; i++) {
      let regex = regexps[i];
      let match: RegExpMatchArray = null;
      while ((match = regex.exec(text)) != null) {
        let startPos = match.index;
        let endPos = regex.lastIndex;
        let region = new TextRange(startPos, endPos);
        skipList.push(region);
      }
    }
    return new SkipList(skipList);
  }
}

const TURKISH_CONTEXT_SIZE: number = 10;

function make_turkish_downcase_asciify_table(): { [key: string]: string } {
  let ct: { [key: string]: string } = {};
  let ch: string = 'a';
  // Initialize for all characters in English alphabet.
  while (ch <= 'z') {
    ct[ch] = ch;
    ct[ch.toUpperCase()] = ch;
    ch = String.fromCharCode(ch.charCodeAt(0) + 1);  // next char
  }
  // Now check the characters in Turkish alphabet.
  for (let i in TURKISH_CHAR_ALIST) {
    ct[TURKISH_CHAR_ALIST[i]] = i.toLowerCase();
  }
  return ct;
}

function make_turkish_upcase_accents_table(): { [key: string]: string } {
  let ct: { [key: string]: string } = {};
  let ch: string = 'a';
  // Initialize for all characters in English alphabet.
  while (ch <= 'z') {
    ct[ch] = ch;
    ct[ch.toUpperCase()] = ch;
    ch = String.fromCharCode(ch.charCodeAt(0) + 1);  // next char
  }
  // Now check the characters in Turkish alphabet
  // (same as downcase table except for .toUpperCase).
  for (let i in TURKISH_CHAR_ALIST) {
    ct[TURKISH_CHAR_ALIST[i]] = i.toUpperCase();
  }
  ct['i'] = 'i';
  ct['I'] = 'I';
  // We will do this part a bit different. Since we have only one
  // correspondence for every character in TURKISH_CHAR_ALIST,
  // we will just set the values directly:
  ct['\u0130'] = 'i';  // upper turkish i
  ct['\u0131'] = 'I';  // lower turkish i
  return ct;
}

function make_turkish_toggle_accent_table(): { [key: string]: string } {
  let ct: { [key: string]: string } = {};
  for (let i in TURKISH_CHAR_ALIST) {
    ct[i] = TURKISH_CHAR_ALIST[i];  // ascii to turkish
    ct[TURKISH_CHAR_ALIST[i]] = i;  // turkish to ascii
  }
  return ct;
}

function setCharAt(str: string, pos: number, c: string): string {
  return str.substring(0, pos) + c + str.substring(pos + 1);
}

export class Deasciifier implements TextProcessor {
  private initialized: boolean;
  public turkish_pattern_table: { [key: string]: { [key: string]: number } };

  private TURKISH_DOWNCASE_ASCIIFY_TABLE: { [key: string]: string };
  private TURKISH_UPCASE_ACCENTS_TABLE: { [key: string]: string };
  private TURKISH_TOGGLE_ACCENT_TABLE: { [key: string]: string };
  private patternListLoadedCallback: any;

  constructor() {
    this.initialized = false;
    this.TURKISH_DOWNCASE_ASCIIFY_TABLE =
      make_turkish_downcase_asciify_table();
    this.TURKISH_UPCASE_ACCENTS_TABLE =
      make_turkish_upcase_accents_table();
    this.TURKISH_TOGGLE_ACCENT_TABLE =
      make_turkish_toggle_accent_table();
  }

  setPatternListLoadedCallback(callback: any) {
    this.patternListLoadedCallback = callback;
  }

  turkish_correct_region(
    text: string, start: number, end: number,
    filter: TextFilter): TextResult {
    if (!this.initialized) {
      throw new Error("Pattern list not loaded");
    }
    if (text === null) {
      return null;
    }
    if (start < 0) {
      start = 0;
    }
    if (end > text.length) {
      end = text.length;
    }

    let changedPositions: number[] = [];
    for (let i: number = start; i < end; i++) {
      if (filter && filter.shouldExclude(i)) {
        continue;
      }
      if (this.turkish_need_correction(text, i)) {
        text = this.turkish_toggle_accent(text, i);
        changedPositions.push(i);
      }
    }
    return <TextResult>{
      text: text,
      changedPositions: changedPositions,
      //skippedRegions: filter
    };
  }

  turkish_toggle_accent(text: string, pos: number): string {
    let alt = this.TURKISH_TOGGLE_ACCENT_TABLE[text.charAt(pos)];
    if (alt) {
      return setCharAt(text, pos, alt);
    }
    return text;
  }

  turkish_need_correction(text: string, pos: number): boolean {
    let ch: string = text.charAt(pos);
    let tr: string = TURKISH_ASCIIFY_TABLE[ch];
    if (!tr) {
      tr = ch;
    }
    let pattern_list =
      this.turkish_pattern_table[tr.toLowerCase()];
    let match: boolean =
      pattern_list && this.turkish_match_pattern(text, pos, pattern_list);
    // If match then char should turn into turkish else stay ascii.
    // Only exception with capital I when we need the reverse.
    if (tr == "I") {
      return (ch == tr) ? !match : match;
    }
    return (ch == tr) ? match : !match;
  }

  turkish_match_pattern(
    text: string, pos: number, decision_list: any): boolean {
    // TODO: Figure out if this should be negative. When positive, the default
    // behavior is to deasciify the character (e.g. no pattern matches and
    // rank remains equal to Number.MAX_VALUE)
    let rank: number = Number.MAX_VALUE;
    let str: string =
      this.turkish_get_context(text, pos, TURKISH_CONTEXT_SIZE);
    let start: number = 0;
    let len: number = str.length;

    // Selects the pattern with the smallest absolute non-zero rank.
    // E.g. A rank of -1 or 1 will have more priority than a rank of 2 or -2.
    while (start <= TURKISH_CONTEXT_SIZE) {
      let end: number = TURKISH_CONTEXT_SIZE + 1;
      while (end <= len) {
        let s: string = str.substring(start, end);
        let r: number = decision_list[s];  // lookup the pattern
        if (r && Math.abs(r) < Math.abs(rank)) {
          rank = r;
        }
        end++;
      }
      start++;
    }
    return rank > 0;
  }

  turkish_get_context(text: string, pos: number, size: number): string {
    // s is initially (2 * size + 1) spaces.
    let s: string = Array(2 * size + 1 + 1).join(' ');
    s = setCharAt(s, size, 'X');

    let space: boolean = false;
    let i: number = size + 1;
    let index: number = pos + 1;
    while (i < s.length && !space && index < text.length) {
      let c: string = text.charAt(index);
      let x: string = this.TURKISH_DOWNCASE_ASCIIFY_TABLE[c];
      if (!x) {
        if (!space) {
          i++;
          space = true;
        }
      } else {
        s = setCharAt(s, i, x);
        i++;
        space = false;
      }
      index++;
    }

    s = s.substring(0, i);
    index = pos;  // goto_char(p);
    i = size - 1;
    space = false;
    index--;

    while (i >= 0 && index >= 0) {
      let c = text.charAt(index);
      let x = this.TURKISH_UPCASE_ACCENTS_TABLE[c];
      if (!x) {
        if (!space) {
          i--;
          space = true;
        }
      } else {
        s = setCharAt(s, i, x);
        i--;
        space = false;
      }
      index--;
    }
    return s;
  }

  build_skip_list(text: string, options: TextProcessingOptions): SkipList {
    if (options && options.skipURLs) {
      return DefaultSkipFilter.getSkipRegions(options, text);
    }
    return null;
  }

  turkish_correct_last_word(
    text: string, options: TextProcessingOptions): TextResult {
    if (text === null) {
      return null;
    }
    let end: number = text.length;
    let start: number = 0;
    // TODO: We find the last word by looking at spaces. Periods
    // and line breaks also make new words. Check them too.
    if (text.charAt(end) == ' ') {
      start = text.lastIndexOf(' ', end - 2);
    } else {
      start = text.lastIndexOf(' ', end - 1);
    }
    return this.processRange(
      text, <TextRange>{ start: start, end: end }, options);
  }

  public init(patternList: { [key: string]: string }): void {
    if (!patternList) {
      throw new Error("Pattern list can't be null");
    }
    let patternMap: { [key: string]: { [key: string]: number } } = {};
    for (let key in patternList) {
      patternMap[key] = {};
      let char_patterns = patternList[key].split('|');
      for (let i = 0; i < char_patterns.length; i++) {
        let pattern = char_patterns[i];
        let rank = i + 1;
        if (pattern[0] == '-') {
          rank = -rank;
          pattern = pattern.substring(1);
        }
        patternMap[key][pattern] = rank;
      }
    }
    this.turkish_pattern_table = patternMap;
    this.initialized = true;
  }

  public processRange(
    text: string, range: TextRange,
    options: TextProcessingOptions): TextResult {
    // TODO: Better performance.
    // We should return an array of toggled character positions,
    // split the text into characters, toggle required characters and join
    // again. This way we get rid of string operations and use less memory.
    if (text === null) {
      return null;
    }
    return this.turkish_correct_region(
      text, range.start, range.end, this.build_skip_list(text, options));
  }

  public process(text: string, options: TextProcessingOptions): TextResult {
    if (text === null) {
      return null;
    }
    return this.processRange(
      text, <TextRange>{ start: 0, end: text.length }, options);
  }
}
