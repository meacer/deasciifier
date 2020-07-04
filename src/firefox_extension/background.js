var MSG_CONVERT_FULL_TEXT = "T\u00FCm metni \u00E7evirmek istedi\u011Finizden emin misiniz?";
var MSG_CHARS_REPLACED = " karakter de\u011Fi\u015Ftirildi";
var MSG_AUTO_CONVERT_ON = "Otomatik \u00E7evrim A\u00C7IK";
var MSG_AUTO_CONVERT_OFF = "Otomatik \u00E7evrim KAPALI";
var MSG_TEXT_WILL_BE_AUTO_CONVERTED = "Se\u00E7ili kutuya T\u00FCrk\u00E7e karakterler siz yazarken otomatik olarak eklenecek";
var MSG_TEXT_WONT_BE_AUTO_CONVERTED = "Se\u00E7ili kutu i\u00E7in T\u00FCrk\u00E7e karakterler otomatik olarak \u00E7evrilmeyecek";
var ICON_NOTIFICATION = "g-logo.png";
var MSG_CONVERT_TURKISH = "T\u00FCrk\u00E7e karakterleri \u00E7evir (Deasciify)";

// Deasciifier
var deasciifier = Deasciifier;

var options = {
  "confirm_conversions": false,
};

function updateOptions(o) {
  options = o;
}

function deasciifyInput(input) {
  // Deasciify the text.
  var text = input.text;
  var isHTML = input.isHTML;
  var selectionStart = input.selectionStart;
  var selectionEnd = input.selectionEnd;
  var result = null;
  if (isHTML) {
    // Deasciifying HTML is not supported in Firefox.
    return;
  }

  // Plain text.

  // Convert only selected part.
  if (selectionStart != selectionEnd) {
    return deasciifier.deasciifyRange(text, selectionStart, selectionEnd);
  }

  // Convert full text.
  if (options.confirm_conversions && !confirm(MSG_CONVERT_FULL_TEXT)) {
    return null;
  }
  return deasciifier.deasciify(text);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var msg = request;
  switch (msg.message) {
    case "TEXT_TO_DEASCIIFY":
    {
      var result = deasciifyInput(msg.input);
      if (result) {
        var toggledCharCnt =
            result.changedPositions ? result.changedPositions.length : 0;
        // Send back the result.
        sendResponse({
          message: "DEASCIIFIED_TEXT",
          text: result.text,
          selectionStart: msg.input.selectionStart,
          selectionEnd: msg.input.selectionEnd
        });
        if (sender && sender.tab) {
          setBrowserActionUI(sender.tab.id, toggledCharCnt);
        }
      }
    }
    break;

    case "NOTHING_TO_DEASCIIFY":
      // Do nothing, popup not supported in Firefox.
      break;

    case "DEASCIIFY_HANDLER_ON":
      showNotification(MSG_AUTO_CONVERT_ON,
                       MSG_TEXT_WILL_BE_AUTO_CONVERTED, 3500);
    break;

    case "DEASCIIFY_HANDLER_OFF":
      showNotification(MSG_AUTO_CONVERT_OFF,
                       MSG_TEXT_WONT_BE_AUTO_CONVERTED, 3500);
    break;

    case "DEASCIIFY_TYPED_TEXT":
    {
      var text = msg.text;
      if (text) {
        var converted = null;
        if (msg.selectionStart == msg.selectionEnd && msg.selectionStart > 0) {
          // Cursor is in the middle of the text
          converted = deasciify_word_at_cursor(text, msg.selectionStart);
        } else {
          converted = deasciifier.turkish_correct_last_word(text);
        }
        if (converted) {
          // Send back deasciified text to content script.
          sendResponse({
            "text": converted.text,
            "selectionStart": msg.selectionStart,
            "selectionEnd": msg.selectionEnd
          });
        }
      }
    }
    break;

    case "UPDATE_OPTIONS":
    updateOptions(msg.options);
    break;
  }
});

function setBrowserActionUI(currentTabId, toggledCharCnt) {
  // Show some information on the extension icon:
  chrome.browserAction.setBadgeText({
    'text': '' + toggledCharCnt,
    'tabId': currentTabId
  });
  chrome.browserAction.setTitle({
    'title': toggledCharCnt + MSG_CHARS_REPLACED,
    'tabId': currentTabId
  });
}

function convertSelectedEditableInTab(tabs) {
  var tab = tabs[0];
  if (!tab) {
    return;
  }
  chrome.tabs.executeScript(tab.id, {file: "execute.js"}, function() {
    chrome.tabs.executeScript(tab.id, {code: "deasciifyActiveElement();"});
  });
};

function ConvertTurkishChars() {
  // Get the current tab:
  chrome.tabs.query({active: true}, convertSelectedEditableInTab);
}

function showNotification(title, text, timeout) {
  var notification = webkitNotifications.createNotification(
    ICON_NOTIFICATION,
    title,
    text
  );
  notification.show();
  setTimeout(function(){ notification.cancel(); }, timeout);
}

function deasciify_word_at_cursor(text, cursorPos) {
  var wordBeforeCursor = MEA.TextHelper.getWordBeforeCursor(text, cursorPos);
  if (wordBeforeCursor) {
    return deasciifier.deasciifyRange(text, wordBeforeCursor.start, wordBeforeCursor.end);
  }
  return null;
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  ConvertTurkishChars();
});

function getContextMenuClickHandler() {
  return function(info, tab) {
    convertSelectedEditableInTab(tab);
  }
}
chrome.contextMenus.create({
  "title": MSG_CONVERT_TURKISH,
  "type": "normal",
  "contexts": ["editable"],
  "onclick": getContextMenuClickHandler()
});

// Popup not support in Firefox.

Deasciifier.onPatternListLoaded = function(patternListV2) {
  Deasciifier.init(patternListV2);
}
