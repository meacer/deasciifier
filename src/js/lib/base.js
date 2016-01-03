
(function(exports){

  /** @enum {string} */
  exports.TURKISH_ASCIIFY_TABLE = {
    '\u00E7': 'c', // Lowercase turkish c
    '\u00C7': 'C', // Uppercase turkish c
    '\u011F': 'g', // Lowercase turkish g
    '\u011E': 'G', // Uppercase turkish g
    '\u0131': 'i', // Lowercase turkish i
    '\u0130': 'I', // Uppercase turkish i
    '\u00F6': 'o', // Lowercase turkish o
    '\u00D6': 'O', // Uppercase turkish o
    '\u015F': 's', // Lowercase turkish s
    '\u015E': 'S', // Uppercase turkish s
    '\u00FC': 'u', // Lowercase turkish u
    '\u00DC': 'U'  // Uppercase turkish u
  };

  /** @const */  exports.DEASCII_TR_LOWER_C = '\u00E7';
  /** @const */  exports.DEASCII_TR_UPPER_C = '\u00C7';
  /** @const */  exports.DEASCII_TR_LOWER_G = '\u011F';
  /** @const */  exports.DEASCII_TR_UPPER_G = '\u011E';
  /** @const */  exports.DEASCII_TR_LOWER_I = '\u0131';
  /** @const */  exports.DEASCII_TR_UPPER_I = '\u0130';
  /** @const */  exports.DEASCII_TR_LOWER_O = '\u00F6';
  /** @const */  exports.DEASCII_TR_UPPER_O = '\u00D6';
  /** @const */  exports.DEASCII_TR_LOWER_S = '\u015F';
  /** @const */  exports.DEASCII_TR_UPPER_S = '\u015E';
  /** @const */  exports.DEASCII_TR_LOWER_U = '\u00FC';
  /** @const */  exports.DEASCII_TR_UPPER_U = '\u00DC';

})(exports);