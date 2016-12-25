export class TurkishChars {
  public static readonly LOWER_C = '\u00E7';
  public static readonly UPPER_C = '\u00C7';

  public static readonly LOWER_G = '\u011F';
  public static readonly UPPER_G = '\u011E';

  public static readonly LOWER_I = '\u0131';
  public static readonly UPPER_I = '\u0130';

  public static readonly LOWER_O = '\u00F6';
  public static readonly UPPER_O = '\u00D6';

  public static readonly LOWER_S = '\u015F';
  public static readonly UPPER_S = '\u015E';

  public static readonly LOWER_U = '\u00FC';
  public static readonly UPPER_U = '\u00DC';
}

export const TURKISH_CHAR_ALIST: { [key: string]: string } = {
  'c': TurkishChars.LOWER_C,
  'C': TurkishChars.UPPER_C,
  'g': TurkishChars.LOWER_G,
  'G': TurkishChars.UPPER_G,
  'i': TurkishChars.LOWER_I,
  'I': TurkishChars.UPPER_I,
  'o': TurkishChars.LOWER_O,
  'O': TurkishChars.UPPER_O,
  's': TurkishChars.LOWER_S,
  'S': TurkishChars.UPPER_S,
  'u': TurkishChars.LOWER_U,
  'U': TurkishChars.UPPER_U
};

function make_turkish_asciify_table(): { [key: string]: string } {
  let table: { [key: string]: string } = {};
  for (let key in TURKISH_CHAR_ALIST) {
    let value = TURKISH_CHAR_ALIST[key];
    table[value] = key;
  }
  return table;
}
export const TURKISH_ASCIIFY_TABLE = make_turkish_asciify_table();
