var MSG_CONVERT_FULL_TEXT = "T\u00FCm metni \u00E7evirmek istedi\u011Finizden emin misiniz?";
var MSG_SELECT_TEXT_TO_CONVERT = "T\u00FCrk\u00E7e karakterleri \u00E7evirmek i\u00E7in bir metin kutusu se\u00E7in.";
var MSG_CHARS_REPLACED = " karakter de\u011Fi\u015Ftirildi";
var MSG_AUTO_CONVERT_ON = "Otomatik \u00E7evrim A\u00C7IK";
var MSG_AUTO_CONVERT_OFF = "Otomatik \u00E7evrim KAPALI";
var MSG_TEXT_WILL_BE_AUTO_CONVERTED = "Se\u00E7ili kutuya T\u00FCrk\u00E7e karakterler siz yazarken otomatik olarak eklenecek";
var MSG_TEXT_WONT_BE_AUTO_CONVERTED = "Se\u00E7ili kutu i\u00E7in T\u00FCrk\u00E7e karakterler otomatik olarak \u00E7evrilmeyecek";
var ICON_NOTIFICATION = "g-logo.png";
var MSG_CONVERT_TURKISH = "T\u00FCrk\u00E7e karakterleri \u00E7evir (Deasciify)";

// Deasciifier
var deasciifier = Deasciifier;

var deasciifyResult = {textFound:false};
function getDeasciifyResult() { // used by popup.html
  return deasciifyResult;
}

function deasciifyInput(input) {
  // Deasciify the text
  var text = input.text;
  var isHTML = input.isHTML;
  var selectionStart = input.selectionStart;
  var selectionEnd = input.selectionEnd;
  var result = null;
  if (isHTML) {
    // HTML. Always convert full text:
    if (!confirm(MSG_CONVERT_FULL_TEXT)) {
      return null;
    }
    result = MEA.HtmlDeasciifier.deasciify(text);
  } else {
    // Plain text
    if (selectionStart!=selectionEnd) {
      // only selected part
      result = deasciifier.deasciifyRange(text, selectionStart, selectionEnd);
    } else {
      // full text
      if (!confirm(MSG_CONVERT_FULL_TEXT)) {
        return null;
      }
      result = deasciifier.deasciify(text);
    }
  }
  return result;
}

function convertSelectedEditableInTab(tab) {
  if (!tab) {
    return;
  }
  
  var currentTabId = tab.id;
  deasciifyResult.text = MSG_SELECT_TEXT_TO_CONVERT;
  deasciifyResult.textFound = false;
  
  // Connect to the tab
  var port = chrome.tabs.connect(currentTabId);
  if (!port) {
    window.console && console.log("Deasciifier - Could not connect to tab");
    return;
  }
  
  function messageListener(msg) {
    if (msg.message=="TEXT_TO_DEASCIIFY") {
      var result = deasciifyInput(msg.input);
      if (result) {
        var num_toggled_chars = result.changedPositions ? result.changedPositions.length:0;
        deasciifyResult.text = num_toggled_chars + MSG_CHARS_REPLACED;
        deasciifyResult.textFound = true;
        
        // Send back the deasciified text:
        port.postMessage({
          message:"DEASCIIFIED_TEXT",
          text: result.text,                        // deasciified text
          selectionStart:msg.input.selectionStart,  // restore selection
          selectionEnd:msg.input.selectionEnd
        });
        // Show some information on the extension icon:
        chrome.browserAction.setBadgeText({
          'text':''+num_toggled_chars,
          'tabId':currentTabId
        });
        chrome.browserAction.setTitle({
          'title':num_toggled_chars + MSG_CHARS_REPLACED,
          'tabId':currentTabId
        });
      }
      //port.disconnect();
    }
  }
  
  port.onMessage.addListener(messageListener);
  // Request the text to deasciify
  port.postMessage({message: "REQUEST_TEXT"});
}

function ConvertTurkishChars() {
  // Get the current tab:
  chrome.tabs.getSelected(null, convertSelectedEditableInTab);
}

// Handle the messages from the content script on Alt+T key:
chrome.extension.onConnect.addListener(messageListener);

function showNotification(title, text, timeout) {
 if (window.webkitNotifications) {
    var notification = webkitNotifications.createNotification(
      ICON_NOTIFICATION,
      title,           
      text
    );
    notification.show();
    setTimeout(function(){ notification.cancel(); }, timeout);
  }
}
 
function deasciify_word_at_cursor(text, cursorPos) {
  var wordBeforeCursor = MEA.TextHelper.getWordBeforeCursor(text, cursorPos);
  if (wordBeforeCursor) {
    return deasciifier.deasciifyRange(text, wordBeforeCursor.start, wordBeforeCursor.end);
  }
  return null;
}

function messageListener(port) {

  if (port.name=="deasciify_on_typing") {
  
    function onMessageHandler(msg) {
      switch (msg.message) {
        case "DEASCIIFY_HANDLER_ON":
          showNotification(MSG_AUTO_CONVERT_ON, MSG_TEXT_WILL_BE_AUTO_CONVERTED, 3500);
        break;
      
        case "DEASCIIFY_HANDLER_OFF":
          showNotification(MSG_AUTO_CONVERT_OFF, MSG_TEXT_WONT_BE_AUTO_CONVERTED, 3500);
        break;
        
        case "DEASCIIFY_TYPED_TEXT":
          var text = msg.text;
          if (text && deasciifier && port) {
            var converted = null;
            if (msg.selectionStart==msg.selectionEnd && msg.selectionStart>0){ 
              // Cursor is in the middle of the text
              converted = deasciify_word_at_cursor(text, msg.selectionStart);
            } else {
              converted = deasciifier.turkish_correct_last_word(text);
            }
            if (converted) {
              // send back deasciified text to content script
              port.postMessage({
                "message":"DEASCIIFIED_TEXT_ON_TYPING",
                "text":converted.text,
                "selectionStart":msg.selectionStart,
                "selectionEnd":msg.selectionEnd
              });
            }
          }
        break;
      }
    }
    port.onMessage.addListener(onMessageHandler);
  }
}
// Called when the user clicks on the browser action.
/*chrome.browserAction.onClicked.addListener(function(tab) {
  ConvertTurkishChars();
});*/


function getContextMenuClickHandler() {
  return function(info, tab) {
    convertSelectedEditableInTab(tab);
  }
}
chrome.contextMenus.create({
  "title":MSG_CONVERT_TURKISH,
  "type":"normal",
  "contexts":["editable"],
  "onclick":getContextMenuClickHandler()
});
