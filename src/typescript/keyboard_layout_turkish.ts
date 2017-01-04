
const TR_c = '_\u00E7';
const TR_C = '_\u00C7';
const TR_g = '_\u011F';
const TR_G = '_\u011E';
const TR_i = '_\u0131';
const TR_I = '_\u0130';
const TR_o = '_\u00F6';
const TR_O = '_\u00D6';
const TR_s = '_\u015F';
const TR_S = '_\u015E';
const TR_u = '_\u00FC';
const TR_U = '_\u00DC';
const CIRC_a = "\u00E2"; /* a circumflex */
const CIRC_e = "\u00EA"; /* e circumflex */
const CIRC_i = "\u00EE"; /* i circumflex */
const CIRC_o = "\u00F4"; /* o circumflex */
const CIRC_u = "\u00FB"; /* u circumflex */
const CIRC_A = "\u00C2"; /* A circumflex */
const CIRC_E = "\u00CA"; /* E circumflex */
const CIRC_I = "\u00CE"; /* I circumflex */
const CIRC_O = "\u00D4"; /* O circumflex */
const CIRC_U = "\u00DB"; /* U circumflex */

// Keyboard layout definition:
// - Each row corresponds to a key row.
// - Keys between [ and ] are special keys with special meanings.
// - Keys between ( and ) have special CSS styles.
// - Keys with "," separator have both lower case and upper case letters.
//   First letter is lower case and the second one is upper case.

export const KeyboardLayout: { [key: string]: Array<Array<string>> } = {
  TR_Q: [
    [
      "[tab]", "q,Q", "w,W", "e,E", "r,R", "t,T", "y,Y", "u,U", "(ı,I)", "o,O",
      "p,P", "(ğ,Ğ)", "(ü,Ü)", ";", "[backspace]"
    ],
    [
      "[caps]", "a,A", "s,S", "d,D", "f,F", "g,G", "h,H", "j,J", "k,K", "l,L",
      "(ş,Ş)", "(i,İ)", ":", "[enter]"
    ],
    [
      "[shift]", "z,Z", "x,X", "c,C", "v,V", "b,B", "n,N", "m,M",
      "(ö,Ö)", "(ç,Ç)", ",", ".", "[shift]"
    ],
    [CIRC_a, CIRC_e, CIRC_i, "[space]", CIRC_o, CIRC_u]
  ]
  /*
    TR_F: {
      id: "TR_F",
      name: "T\u00FCrk\u00E7e F",
      keys: {
        capsOff: [
          // The keyboard layout. Letters that start with underscore are shown
          // in bold. Keys
          // that are longer than 1 character but do not start with an
          // underscore are special keys
          // and they should have an entry in specialKeys map
          [
            "tab", "f", "g", TR_g, TR_i, "o", "d", "r",
            "n", "h", "p", "q", "w", "x", "backspace"
          ],
          [
            "caps", "u", "_i", "e", "a", TR_u, "t", "k",
            "m", "l", "y", TR_s, ":", "enter"
          ],
          [
            "shift_l", "j", TR_o, "v", "c", TR_c, "z", "s",
            "b", ",", ".", ";", "shift_r"
          ],
          [CIRC_a, CIRC_e, CIRC_i, CIRC_o, CIRC_u, "space"]
        ],
        capsOn: [
          [
            "tab", "F", "G", TR_G, "_I", "O", "D", "R",
            "N", "H", "P", "Q", "W", "X", "backspace"
          ],
          [
            "caps", "U", TR_I, "E", "A", TR_U, "T", "K",
            "M", "L", "Y", TR_S, ":", "enter"
          ],
          [
            "shift_l", "J", TR_O, "V", "C", TR_C, "Z",
            "S", "B", ",", ".", ";", "shift_r"
          ],
          [CIRC_A, CIRC_E, CIRC_I, CIRC_O, CIRC_U, "space"]
        ]
      }
    }*/
};
