
// A text range. |start| is inclusive, |end| is exclusive.
export class TextRange {
  public constructor(
    public readonly start: number, public readonly end: number) { }

  empty() : boolean {
    return this.start >= this.end;
  }
}

export interface TextFilter {
  shouldExclude(pos: number): boolean;
}

export interface TextResult {
  text: string;
  changedPositions: number[];
  //skippedRegions: TextFilter;
}

export class TextProcessingOptions {
  constructor(public skipURLs: boolean) { }
}

export interface TextProcessor {
  processRange(
    text: string, range: TextRange,
    options: TextProcessingOptions): TextResult;
  process(text: string, options: TextProcessingOptions): TextResult;
}

export class KeyCode {
  public static readonly SPACE = 32;
  public static readonly ENTER = 13;
  public static readonly COMMA = 188;
  public static readonly PERIOD = 190;
  public static readonly FORWARD_SLASH = 191;
  public static readonly DASH = 189;
  public static readonly SEMICOLON = 186;
}

export class Position {
  constructor(public top: number, public left: number) { }
}
