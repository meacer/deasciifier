var base = require('./base');

(function(exports) {

  /** @const */
  var Asciifier = {};

  Asciifier.asciifyRange = function(text, start, end) {
    if (!text || start >= end) {
      return null;
    }
    // There seems to be a bug here. Chrome fails to convert long texts
    // correctly.
    var changedPositions = [];
    var output = new Array(text.length);
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      var toggled = base.TURKISH_ASCIIFY_TABLE[ch];
      if (i >= start && i <= end && toggled) {
        output[i] = toggled;
        changedPositions.push(i);
      } else {
        output[i] = ch;
      }
    }
    return {"text": output.join(""), "changedPositions": changedPositions};
  };

  Asciifier.asciify = function(text) {
    if (!text) {
      return null;
    }
    return Asciifier.asciifyRange(text, 0, text.length - 1);
  };

  /** @const */
  var Deasciifier = {};

  /** @constructor */
  Deasciifier.SkipRegion = function(start, end) {
    this.start = start;
    this.end = end;
  };

  /** @constructor */
  Deasciifier.SkipList = function(skipRegions) {
    this.skipRegions = skipRegions;
  };

  Deasciifier.SkipList.prototype = {
    shouldExclude: function(pos) {
      for (var i = 0; i < this.skipRegions.length; i++) {
        if (pos >= this.skipRegions[i].start &&
            pos <= this.skipRegions[i].end) {
          return true;
        }
      }
      return false;
    }
  };

  /** @const */
  var URL_REGEX = /\b((((https?|ftp|file):\/\/)|(www\.))[^\s]+)/gi;

  /** @const */
  Deasciifier.DefaultSkipFilter = {
    getSkipRegions: function(options, text) {
      // TODO: Better algorithm here if number of regions grow large
      var regexps = [];
      if (options && options["skipURLs"]) {
        regexps.push(URL_REGEX);
      }
      var skipList = [];
      for (var i = 0; i < regexps.length; i++) {
        var regex = regexps[i];
        var match = null;
        while ((match = regex.exec(text)) != null) {
          var startPos = match.index;
          var endPos = regex.lastIndex;
          var region = new Deasciifier.SkipRegion(startPos, endPos);
          skipList.push(region);
        }
      }
      return new Deasciifier.SkipList(skipList);
    }
  };

  Deasciifier.initialized = false;

  /** @const */
  var TURKISH_CONTEXT_SIZE = 10;

  /** @const */
  var Options = {
    defaults: {
      // Default options
      "skipURLs": true
    },

    get: function(options, optionName) {
      if (options && options.hasOwnProperty(optionName)) {
        return options[optionName];
      }
      return Options.defaults[optionName];
    },

    // TODO: remove?
    getMulti: function(options, optionNames) {
      var ret = {};
      for (var i = 0; i < optionNames.length; i++) {
        ret[optionNames[i]] = Options.get(options, optionNames[i]);
      }
      return ret;
    }
  };

  /** @const */
  var TURKISH_CHAR_ALIST = {
    'c': base.DEASCII_TR_LOWER_C,
    'C': base.DEASCII_TR_UPPER_C,
    'g': base.DEASCII_TR_LOWER_G,
    'G': base.DEASCII_TR_UPPER_G,
    'i': base.DEASCII_TR_LOWER_I,
    'I': base.DEASCII_TR_UPPER_I,
    'o': base.DEASCII_TR_LOWER_O,
    'O': base.DEASCII_TR_UPPER_O,
    's': base.DEASCII_TR_LOWER_S,
    'S': base.DEASCII_TR_UPPER_S,
    'u': base.DEASCII_TR_LOWER_U,
    'U': base.DEASCII_TR_UPPER_U
  };

  function make_turkish_asciify_table() {
    var ct = {};
    for (var i in TURKISH_CHAR_ALIST) {
      ct[TURKISH_CHAR_ALIST[i]] = i;
    }
    return ct;
  }

  function make_turkish_downcase_asciify_table() {
    var ct = {};
    var ch = 'a';
    // initialize for all characters in English alphabet
    while (ch <= 'z') {
      ct[ch] = ch;
      ct[ch.toUpperCase()] = ch;
      ch = String.fromCharCode(ch.charCodeAt(0) + 1);  // next char
    }
    // now check the characters in turkish alphabet
    for (var i in TURKISH_CHAR_ALIST) {
      ct[TURKISH_CHAR_ALIST[i]] = i.toLowerCase();
    }
    return ct;
  }

  function make_turkish_upcase_accents_table() {
    var ct = {};
    var ch = 'a';
    // initialize for all characters in English alphabet
    while (ch <= 'z') {
      ct[ch] = ch;
      ct[ch.toUpperCase()] = ch;
      ch = String.fromCharCode(ch.charCodeAt(0) + 1);  // next char
    }
    // now check the characters in turkish alphabet
    // (same as downcase table except for .toUpperCase)
    for (var i in TURKISH_CHAR_ALIST) {
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

  function make_turkish_toggle_accent_table() {
    var ct = {};
    for (var i in TURKISH_CHAR_ALIST) {
      ct[i] = TURKISH_CHAR_ALIST[i];  // ascii to turkish
      ct[TURKISH_CHAR_ALIST[i]] = i;  // turkish to ascii
    }
    return ct;
  }

  Deasciifier.turkish_correct_region = function(text, start, end, filter) {
    if (!Deasciifier.initialized) {
      throw new Error("Pattern list not loaded");
    }
    if (!text) {
      return null;
    }
    if (start < 0) {
      start = 0;
    }
    if (end > text.length) {
      end = text.length;
    }

    var changedPositions = [];
    for (var i = start; i < end; i++) {
      if (filter && filter.shouldExclude(i)) {
        continue;
      }
      if (Deasciifier.turkish_need_correction(text, i)) {
        text = Deasciifier.turkish_toggle_accent(text, i);
        changedPositions.push(i);
      }
    }
    return {
      "text": text,
      "changedPositions": changedPositions,
      "skippedRegions": filter
    };
  };

  Deasciifier.turkish_toggle_accent = function(text, pos) {
    var alt = Deasciifier.turkish_toggle_accent_table[text.charAt(pos)];
    if (alt) {
      return setCharAt(text, pos, alt);
    }
    return text;
  };

  Deasciifier.turkish_need_correction = function(text, pos) {
    var ch = text.charAt(pos);
    var tr = Deasciifier.turkish_asciify_table[ch];
    if (!tr) {
      tr = ch;
    }
    var pl =
        Deasciifier.turkish_pattern_table[tr.toLowerCase()];  // Pattern list
    var m = pl && Deasciifier.turkish_match_pattern(text, pos, pl);  // match
    // if m then char should turn into turkish else stay ascii
    // only exception with capital I when we need the reverse
    if (tr == "I") {
      return (ch == tr) ? !m : m;
    }
    return (ch == tr) ? m : !m;
  };

  Deasciifier.turkish_match_pattern = function(text, pos,
                                               dlist) {  // dlist: decision list
    var rank = dlist.length * 2;
    var str = Deasciifier.turkish_get_context(text, pos, TURKISH_CONTEXT_SIZE);
    var start = 0;
    var len = str.length;

    while (start <= TURKISH_CONTEXT_SIZE) {
      var end = TURKISH_CONTEXT_SIZE + 1;
      while (end <= len) {
        var s = str.substring(start, end);
        var r = dlist[s];  // lookup the pattern
        if (r && Math.abs(r) < Math.abs(rank)) {
          rank = r;
        }
        end++;
      }
      start++;
    }
    return rank > 0;
  };

  function setCharAt(str, pos, c) {
    // TODO: Improve performance
    return str.substring(0, pos) + c + str.substring(pos + 1);
  }

  Deasciifier.turkish_get_context = function(text, pos, size) {
    var s = '';
    var space = false;
    var string_size = 2 * size + 1;
    for (var j = 0; j < string_size; j++) {  // make-string
      s = s + ' ';
    }
    s = setCharAt(s, size, 'X');

    var i = size + 1;
    var index = pos + 1;
    while (i < s.length && !space && index < text.length) {
      var c = text.charAt(index);
      var x = Deasciifier.turkish_downcase_asciify_table[c];
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
      var c = text.charAt(index);
      var x = Deasciifier.turkish_upcase_accents_table[c];
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
  };

  Deasciifier.build_skip_list = function(text, options) {
    var skipOptions = Options.getMulti(options, ["skipURLs"]);
    if (skipOptions) {
      return Deasciifier.DefaultSkipFilter.getSkipRegions(skipOptions, text);
    }
    return null;
  };

  Deasciifier.turkish_correct_last_word = function(text, options) {
    if (!text) {
      return null;
    }
    var end = text.length - 1;
    var start = 0;
    // TODO: We find the last word by looking at spaces. Periods
    // and line breaks also make new words. Check them too.
    if (text.charAt(end) == ' ') {
      start = text.lastIndexOf(' ', end - 2);
    } else {
      start = text.lastIndexOf(' ', end - 1);
    }
    return Deasciifier.deasciifyRange(text, start, end, options);
  };

  Deasciifier.init = function(patternListV2) {
    if (!patternListV2) {
      throw new Error("Pattern list can't be null");
    }
    Deasciifier.turkish_asciify_table = make_turkish_asciify_table();
    Deasciifier.turkish_downcase_asciify_table =
        make_turkish_downcase_asciify_table();
    Deasciifier.turkish_upcase_accents_table =
        make_turkish_upcase_accents_table();
    Deasciifier.turkish_toggle_accent_table =
        make_turkish_toggle_accent_table();
    Deasciifier.turkish_pattern_table = {};
    for (var key in patternListV2) {
      Deasciifier.turkish_pattern_table[key] = {}
      var tokens = patternListV2[key].split("|");
      for (var i = 0; i < tokens.length; i++) {
        var pattern = tokens[i];
        var rank = i + 1;
        if (pattern.charAt(0) == '-') {
          rank = -rank;
          pattern = pattern.substring(1);
        }
        Deasciifier.turkish_pattern_table[key][pattern] = rank;
      }
      Deasciifier.turkish_pattern_table[key]["length"] = tokens.length;
    }
    Deasciifier.initialized = true;
  };

  Deasciifier.deasciifyRange = function(text, start, end, options) {
    // TODO: Better performance.
    // We should return an array of toggled character positions,
    // split the text into characters, toggle required characters and join
    // again. This way we get rid of string operations and use less memory.
    if (!text) {
      return null;
    }
    return Deasciifier.turkish_correct_region(
        text, start, end, Deasciifier.build_skip_list(text, options));
  };

  Deasciifier.deasciify = function(text, options) {
    if (!text) {
      return null;
    }
    return Deasciifier.deasciifyRange(text, 0, text.length - 1, options);
  };

  exports.Asciifier = {
    asciify: Asciifier.asciify,
    asciifyRange: Asciifier.asciifyRange
  };

  exports.Deasciifier = {
    init: Deasciifier.init,
    deasciify: Deasciifier.deasciify,
    deasciifyRange: Deasciifier.deasciifyRange
  };

})(exports);
