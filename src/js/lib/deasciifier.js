/** @preserve
 *
 * Turkish text deasciifier and asciifier JavaScript library.
 *  Deasciifier code directly converted by Mustafa Emre Acer from
 *  Dr. Deniz Yuret's Emacs Turkish Extension: http://www.denizyuret.com/turkish
 *
 *  Author:  Mustafa Emre Acer
 *  Version: 2.1
 *  Date:    2010-05-21
 */

(function(){

  /**
   * @enum {string}
   */
  var turkish_asciify_table = {
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

  var Asciifier = {

    asciifyRange:function(text, start, end) {
      if (!text || start>=end) {
        return null;
      }
      // There seems to be a bug here. Chrome fails to convert long texts correctly.
      var changedPositions = [];
      var output = new Array(text.length);
      for (var i=0; i<text.length; i++) {
        var ch = text.charAt(i);
        var toggled = turkish_asciify_table[ch];
        if (i>=start && i<=end && toggled) {
          output[i] = toggled;
          changedPositions.push(i);
        } else {
          output[i] = ch;
        }
      }
      return {
        "text":output.join(""),
        "changedPositions":changedPositions
      };
    },

    asciify:function(text) {
      if (!text) {
        return null;
      }
      return Asciifier.asciifyRange(text, 0, text.length-1);
    }
  };

  // Define the namespace:
  if (!window["Deasciifier"]) {
    window["Deasciifier"] = {};
  }
  var Deasciifier = window["Deasciifier"];

  /**
   * @constructor
   */
  Deasciifier.SkipRegion = function(start, end) {
    this.start = start;
    this.end = end;
  }
  /**
   * @constructor
   */
  Deasciifier.SkipList = function(skipRegions) {
    this.skipRegions = skipRegions;
  }
  Deasciifier.SkipList.prototype = {
    shouldExclude:function(pos) {
      for (var i=0; i<this.skipRegions.length; i++) {
        if (pos>=this.skipRegions[i].start && pos<=this.skipRegions[i].end) {
          return true;
        }
      }
      return false;
    }
  }

  // Exported for testing:
  Deasciifier["URLRegex"] = /\b((((https?|ftp|file):\/\/)|(www\.))[^\s]+)/gi;

  Deasciifier.DefaultSkipFilter = {
    getSkipRegions:function(options, text) {
      // TODO: Better algorithm here if number of regions grow large
      var regexps = [];
      if (options && options["skipURLs"]) {
        regexps.push(Deasciifier["URLRegex"])
      }
      var skipList = [];
      for (var i=0; i<regexps.length; i++) {
        var regex = regexps[i];
        var match = null;
        while ((match=regex.exec(text))!=null) {
          var startPos = match.index;
          var endPos = regex.lastIndex;
          var region = new Deasciifier.SkipRegion(startPos, endPos);
          skipList.push(region);
        }
      }
      return new Deasciifier.SkipList(skipList);
    }
  }

  Deasciifier.initialized = false;
  Deasciifier.turkish_context_size = 10;

  var Options = {
    defaults: { // Default options
      "skipURLs":true
    },
    get:function(options, optionName) {
      if (options && options.hasOwnProperty(optionName)) {
        return options[optionName];
      }
      return Options.defaults[optionName];
    },
    getMulti:function(options, optionNames) {
      var ret = {};
      for (var i=0; i<optionNames.length; i++) {
        ret[optionNames[i]] = Options.get(options, optionNames[i]);
      }
      return ret;
    }
  };

  Deasciifier.turkish_char_alist = {
    'c': DEASCII_TR_LOWER_C,
    'C': DEASCII_TR_UPPER_C,
    'g': DEASCII_TR_LOWER_G,
    'G': DEASCII_TR_UPPER_G,
    'i': DEASCII_TR_LOWER_I,
    'I': DEASCII_TR_UPPER_I,
    'o': DEASCII_TR_LOWER_O,
    'O': DEASCII_TR_UPPER_O,
    's': DEASCII_TR_LOWER_S,
    'S': DEASCII_TR_UPPER_S,
    'u': DEASCII_TR_LOWER_U,
    'U': DEASCII_TR_UPPER_U
  };

  Deasciifier.init = function() {
    if (!Deasciifier["patternList"]) {
      return false;
    }

    Deasciifier.make_turkish_asciify_table();
    Deasciifier.make_turkish_downcase_asciify_table();
    Deasciifier.make_turkish_upcase_accents_table();
    Deasciifier.make_turkish_toggle_accent_table();
    Deasciifier.make_pattern_hash();
    Deasciifier.initialized = true;
    return true;
  };

  Deasciifier.make_turkish_asciify_table = function() {
    var ct = {};
    for (var i in Deasciifier.turkish_char_alist) {
      ct[Deasciifier.turkish_char_alist[i]] = i;
    }
    Deasciifier.turkish_asciify_table = ct;
  };

  Deasciifier.make_turkish_downcase_asciify_table = function() {
    var ct = {};
    var ch = 'a';
    // initialize for all characters in English alphabet
    while (ch<='z') {
      ct[ch] = ch;
      ct[ch.toUpperCase()] = ch;
      ch = String.fromCharCode(ch.charCodeAt(0)+1); // next char
    }
    // now check the characters in turkish alphabet
    for (var i in Deasciifier.turkish_char_alist) {
      ct[ Deasciifier.turkish_char_alist[i] ] = i.toLowerCase();
    }
    Deasciifier.turkish_downcase_asciify_table = ct;
  }

  Deasciifier.make_turkish_upcase_accents_table = function() {
    var ct = {};
    var ch = 'a';
    // initialize for all characters in English alphabet
    while (ch<='z') {
      ct[ch] = ch;
      ct[ch.toUpperCase()] = ch;
      ch = String.fromCharCode(ch.charCodeAt(0)+1); // next char
    }
    // now check the characters in turkish alphabet
    // (same as downcase table except for .toUpperCase)
    for (var i in Deasciifier.turkish_char_alist) {
      ct[ Deasciifier.turkish_char_alist[i] ] = i.toUpperCase();
    }
    ct['i'] = 'i';
    ct['I'] = 'I';
    // We will do this part a bit different. Since we have only one
    // correspondence for every character in turkish_char_alist,
    // we will just set the values directly:
    ct['\u0130'] = 'i'; // upper turkish i
    ct['\u0131'] = 'I'; // lower turkish i
    Deasciifier.turkish_upcase_accents_table = ct;
  };

  Deasciifier.make_turkish_toggle_accent_table = function() {
    var ct = {};
    for (var i in Deasciifier.turkish_char_alist) {
      ct[i] = Deasciifier.turkish_char_alist[i]; // ascii to turkish
      ct[Deasciifier.turkish_char_alist[i]] = i; // turkish to ascii
    }
    Deasciifier.turkish_toggle_accent_table = ct;
  }

  Deasciifier.make_pattern_hash = function() {
    // This is precompiled:
    Deasciifier.turkish_pattern_table = Deasciifier["patternList"];
  }

  Deasciifier.turkish_correct_region = function(text, start, end, filter) {

    if (!Deasciifier.initialized) {
      // Try loading pattern list again:
      Deasciifier.init();
      // Fail if still cannot load:
      if (!Deasciifier.initialized) {
        throw "Pattern list not loaded";
      }
    }
    if (!text) {
      return null;
    }
    if (start<0) {
      start = 0;
    }
    if (end>text.length) {
      end = text.length;
    }
    var changedPositions = [];
    for (var i=start; i<end; i++) {
      if (filter && filter.shouldExclude(i)) {
        continue;
      }
      if (Deasciifier.turkish_need_correction(text, i)) {
        text = Deasciifier.turkish_toggle_accent(text, i);
        changedPositions.push(i);
      }
    }
    return {
      "text":text,
      "changedPositions":changedPositions,
      "skippedRegions":filter
    };
  }

  Deasciifier.turkish_toggle_accent = function(text, pos) {
    var alt = Deasciifier.turkish_toggle_accent_table[text.charAt(pos)];
    if (alt) {
      return setCharAt(text, pos, alt);
    }
    return text;
  }

  Deasciifier.turkish_need_correction = function(text, pos) {
    var ch = text.charAt(pos);
    var tr = Deasciifier.turkish_asciify_table[ch];
    if (!tr) {
      tr = ch;
    }
    var pl = Deasciifier.turkish_pattern_table[tr.toLowerCase()];  // Pattern list
    var m = pl && Deasciifier.turkish_match_pattern(text, pos, pl);  // match
    // if m then char should turn into turkish else stay ascii
    // only exception with capital I when we need the reverse
    if (tr=="I") {
      return (ch==tr) ? !m : m;
    }
    // else
    return (ch==tr) ? m: !m;
  }

  Deasciifier.turkish_match_pattern = function(text, pos, dlist) { // dlist: decision list

    var rank = dlist.length * 2;
    var str = Deasciifier.turkish_get_context(
        text, pos, Deasciifier.turkish_context_size);
    var start = 0, s, r;
    var len = str.length;

    while (start<=Deasciifier.turkish_context_size) {
      var end = Deasciifier.turkish_context_size + 1;
      while (end<=len) {
        s = str.substring(start, end);
        r = dlist[s]; // lookup the pattern
        if (r && Math.abs(r)<Math.abs(rank)) {
          rank = r;
        }
        end++;
      }
      start++;
    }
    return rank>0;
  }

  function setCharAt(str, pos, c) {
    // TODO: Improve performance
    return str.substring(0,pos) + c + str.substring(pos+1);
  }

  Deasciifier.turkish_get_context = function(text, pos, size) {

    var s='', space=false, c,x;
    var string_size = 2*size+1;
    for (var j=0; j<string_size; j++) { // make-string
      s = s + ' ';
    }
    s = setCharAt(s, size, 'X');
    var i = size+1;
    var index = pos+1;
    while (i<s.length && !space && index<text.length) {
      c = text.charAt(index);
      x = Deasciifier.turkish_downcase_asciify_table[c];
      if (!x) {
        if (space) {
          i++;
        } else {
          space = true;
        }
      } else {
        s = setCharAt(s, i, x);
        space = false;
        }
      i++; // this is not the way it's done in turkish-mode,
           // i++ is inside else
      //}
      index++;
    } // while (i<s.length && s[index]!=' ')
    s = s.substring(0,i);

    index = pos; // goto_char(p);
    i = size-1;
    space = false;

    index--;
    //while (i>=0 && index>0) {
    while (i>=0 && index>=0) {
      c = text.charAt(index);
      x = Deasciifier.turkish_upcase_accents_table[c];
      if (!x) {
        if (space) {
          i--;
        } else {
          space = true;
        }
      } else {
        s = setCharAt(s, i, x);
        space = false;
        }
      i--; // this is not the way it's done in turkish-mode,
           // i-- is inside else
      //}
      index--;
    } // while (i>=0)
    return s;
  }

  Deasciifier.build_skip_list = function(text, options) {
    var skipOptions = Options.getMulti(options, ["skipURLs"]);
    if (skipOptions) {
      return Deasciifier.DefaultSkipFilter.getSkipRegions(skipOptions, text);
    }
    return null;
  }

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
  }

  Deasciifier.turkish_correct_last_word = function(text, options) {
    if (!text) {
      return null;
    }
    var end = text.length-1;
    var start = 0;
    // TODO: We find the last word by looking at spaces. Periods
    // and line breaks also make new words. Check them too.
    if (text.charAt(end)==' ') {
      start = text.lastIndexOf(' ', end-2);
    } else {
      start = text.lastIndexOf(' ', end-1);
    }
    return Deasciifier.deasciifyRange(text, start, end, options);
  }

  Deasciifier.deasciify = function(text, options) {
    if (!text) {
      return null;
    }
    return Deasciifier.deasciifyRange(text, 0, text.length-1, options);
  }

  // Exports for Closure Compiler:
  window["Asciifier"] = Asciifier;
  Asciifier["asciify"] = Asciifier.asciify;
  Asciifier["asciifyRange"] = Asciifier.asciifyRange;
  window["Deasciifier"] = Deasciifier;
  Deasciifier["deasciify"] = Deasciifier.deasciify;
  Deasciifier["deasciifyRange"] = Deasciifier.deasciifyRange;

})();


