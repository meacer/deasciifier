// Html Deasciifier
// 
// Author: Mustafa Emre Acer
// Version: 1.0
//
(function(){
  
  if (typeof(MEA)=="undefined") {
    MEA = {};
  }
  
  var inlineTags = {
    // List of inline HTML tags. Anything else will be considered a block tag and added \n instead. br is not included in this list:
   "b":1, "i":1, "u":1, 
   "a":1, "abbr":1, "dfn":1, "em":1, "strong":1, 
   "code":1, "samp":1, "kbd":1, "var":1,
   "big":1, "small":1, "strike":1, "tt":1, "font":1, 
   "span":1, "bdo":1, "cite":1, "del":1, "ins":1, "q":1,
   "script":1, "sub":1, "sup":1
  }
  function isInlineTag(tag) {
    return !!inlineTags[tag];
  }
  function getTagName(tagValue) {
    // Strip <, > and / from both sides and return the first tag splitted by space:
    function removeFromStart(str, character) {
      return (str.length>0 && str.charAt(0)==character) ? str.substring(1): str;
    }
    function removeFromEnd(str, character) {
      return (str.length>0 && str.charAt(str.length-1)==character) ? str.substring(0, str.length-1) : str;
    }
    tagValue = removeFromStart(tagValue, "<");
    tagValue = removeFromStart(tagValue, "/");
    tagValue = removeFromEnd(tagValue, ">");
    tagValue = removeFromEnd(tagValue, "/");
    var splitted = tagValue.split(" ");
    return (splitted.length>0) ? splitted[0].toLowerCase() : ""; 
  }
  // Regex to capture HTML tags:
  var regex = /<\/?[^>]+>/gi;
  var SimpleInnerTextExtractor = {
    getHtmlParseInfo:function(originalHTML) {
      var htmlTags = [];
      var lastPos = 0;
      var innerText = "";
      var insertedNewLines = []; // positions of inserted newline characters for block elements
      while ((match = regex.exec(originalHTML))!=null) {
        var rStart = match.index;   // tag start
        var rEnd = regex.lastIndex; // tag end
        var tagValue = match[0];    // full value with < and >
        var tagName = getTagName(tagValue); // tag name
        // TODO: Should not return innertext for script and noscript tags
        if (tagName=="script" || tagName=="noscript" || tagName=="iframe" || tagName=="noframes" || tagName=="frame") {
          throw "Cannot parse html which contains <script>, <noscript>, <iframe>, <noframes> or <frame> tags"; 
        }
        innerText += originalHTML.substring(lastPos, rStart);
        // Update innerText:
        if (!isInlineTag(tagName)) {
          innerText += "\n";
          insertedNewLines.push(innerText.length-1); // \n at end
        }
        lastPos = rEnd;
        htmlTags.push({start:rStart, end:rEnd, width:(rEnd-rStart+1)});
      }
      innerText += originalHTML.substring(lastPos); // text after last tag (or from start if no tags)
      innerText = MEA.HtmlDecoder.decode(innerText);
      return {htmlTags:htmlTags, innerText:innerText, insertedNewLines:insertedNewLines};
    },
    
    encodeEntitiesAndRemoveNewLines:function(innerText, decodeInfo, insertedNewLines) {
      // Put back html entities (e.g.: &nbsp; )
      var reencodedInnerText = MEA.HtmlDecoder.restoreDecoded(innerText, decodeInfo);
      // Remove newlines inserted by block elements:
      var splitted = reencodedInnerText.split("");
      for (var i=0; i<insertedNewLines.length; i++) {
        var pos = insertedNewLines[i];
        if (splitted[pos]=="\n") {
          splitted[pos] = "";
        } else {
          throw "Expected newline character at position " + pos + " of " + reencodedInnerText;
        }
      }
      return splitted.join("");
    },
    
    // Rebuilds the HTML using the deasciified innerText
    rebuildHTML:function(originalHTML, parseInfo, deasciifiedInnerText) {
      
      // First, put "&nbsp;" style entities back and remove new lines for block elements
      var reencodedInnerText = SimpleInnerTextExtractor.encodeEntitiesAndRemoveNewLines(
        deasciifiedInnerText, parseInfo.innerText.decodeInfo, parseInfo.insertedNewLines);
      // If there are no HTML tags, we are done
      var htmlTags = parseInfo.htmlTags;
      if (htmlTags.length==0) {
        return reencodedInnerText;
      }
      var offset = 0;
      var lastTagIndex = 0;
      var chars = [];
      // Compare original html with the deasciified inner text. Replace modified characters in the HTML:
      var outputHTML = originalHTML.split("");
      for (var i=0; i<reencodedInnerText.length; i++) {
        var htmlPos = offset + i;
        while (lastTagIndex<htmlTags.length && htmlPos>=htmlTags[lastTagIndex].start) {
          // skip tags
          offset += (htmlTags[lastTagIndex].width-1);
          lastTagIndex++; 
          htmlPos= offset + i;
       }
        var originalChar = outputHTML[htmlPos];
        var changedChar = reencodedInnerText.charAt(i);
        if (originalChar!=changedChar) {
          outputHTML[htmlPos] = changedChar;
        }
      }
      return outputHTML.join("");
    }
  };
  
  MEA.HtmlDeasciifier = {
    processHtml:function(html, processFunc) {
      var parseInfo = SimpleInnerTextExtractor.getHtmlParseInfo(html);
      if (!parseInfo) {
        return null;
      }
      var processResult = processFunc(parseInfo.innerText.text);
      if (!processResult) {
        return null;
      }
      processResult.text = SimpleInnerTextExtractor.rebuildHTML(html, parseInfo, processResult.text);
      return processResult;
    },
    
    deasciify:function(html) {
      return MEA.HtmlDeasciifier.processHtml(html, Deasciifier.deasciify);
    },
    asciify:function(html) {
      return MEA.HtmlDeasciifier.processHtml(html, Asciifier.asciify);
    }
  }
  
})();
