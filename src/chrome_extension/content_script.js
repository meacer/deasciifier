// Author: Mustafa Emre Acer
//
// Chrome deasciifier content script: Communicates with the background page so 
// that we don't need to include deasciifier.js in every page.

(function(){

function getActiveInput() {
  var activeElement = document.activeElement;
  if (activeElement) {
    // Gmail style html inputs:
    if (activeElement.tagName=="IFRAME") {
      activeElement = activeElement.contentDocument.activeElement;
      if (activeElement && activeElement.tagName=="BODY" && activeElement.isContentEditable) {
        return activeElement;
      }
      return null;
    }
    if (activeElement.tagName=="INPUT" || activeElement.tagName=="TEXTAREA") {
      return activeElement;
    }
  }
  return null;
}

function getTextToConvert(element) {
  if (isSimpleTextBox(element)) {
    return {
      isPlainText:    true,
      text:           element.value, 
      selectionStart: element.selectionStart,
      selectionEnd:   element.selectionEnd
    }
  }
  if (isContentEditableElement(element)) {
    return {
      isHTML: true,
      text:   element.innerHTML
    }
  }
  return null;
}

function isSimpleTextBox(element) {
  return (element && element.tagName=="INPUT" || element.tagName=="TEXTAREA");
}
function isContentEditableElement(element) {
  return (element && element.tagName=="BODY" && element.isContentEditable);
}
function msgListener(port) {
  function onMsgHandler(msg) {
    var activeElement = getActiveInput();
    if (activeElement) {
      if (msg.message=="REQUEST_TEXT") {
        var input = getTextToConvert(activeElement);
        port.postMessage({
          message: "TEXT_TO_DEASCIIFY",
          input: input
        });
      }
      else if (msg.message=="DEASCIIFIED_TEXT") {
        setConvertedText(activeElement, msg);
      }
    } // activeElement    
  }
  port.onMessage.addListener(onMsgHandler);
}
// Communication with the background page when user clicks on extension icon
chrome.extension.onConnect.addListener(msgListener);

function setConvertedText(element, response) {
  if (isSimpleTextBox(element)) {
    element.value = response.text;
    // Restore text selection
    if (response.selectionStart) {
      element.selectionStart = response.selectionStart;
      element.selectionEnd = response.selectionEnd;
    }
    animateTextBox(element);
  } else if (isContentEditableElement(element)) {
    element.innerHTML = response.text;
    animateTextBox(element);
  }
}

// Animate a text box:
var animationTimer = null;
function animateTextBox(textBox) {
  if (!textBox) {
    return;
  }
  if (animationTimer) {
    clearTimeout(animationTimer);
  }
  var originalBackground = textBox.style.backgroundColor;
  var animationSteps = 5;
  function animate() {
    var value = Math.floor(128 + 128 * (5-animationSteps)/5.0);
    var color = "rgb(" + value + ",255," + value + ")";
    textBox.style.backgroundColor = color;
    if ((animationSteps--)>0) {
      animationTimer = setTimeout(animate, 75);
    } else {
      textBox.style.backgroundColor = originalBackground;
    }
  }
  animate();
}

// Text box event handler
var myPort = null;
var activeTextBox = null;
function onChangeTextBox(ev) {
  // Convert word at cursor if space or enter is pressed
  if (ev.keyCode==13 || ev.keyCode==32) {
    activeTextBox = ev.target;
    if (activeTextBox && myPort) {
      myPort.postMessage({
        message:"DEASCIIFY_TYPED_TEXT",
        text:activeTextBox.value,
        selectionStart:activeTextBox.selectionStart,
        selectionEnd:activeTextBox.selectionEnd,
      });
    }
  }
}

// Connect to the background page:
if (!myPort) {
  myPort = chrome.extension.connect({"name":"deasciify_on_typing"});
  myPort.onMessage.addListener(function(msg) {
    switch (msg.message) {
      case "DEASCIIFIED_TEXT_ON_TYPING":
        if (activeTextBox && msg.text) {
          activeTextBox.value = msg.text;
          if (msg.selectionStart && msg.selectionEnd && 
              msg.selectionStart==msg.selectionEnd) {
            activeTextBox.selectionStart = msg.selectionStart;
            activeTextBox.selectionEnd = msg.selectionEnd;
          }
        }
      break;
    }
  });
}


function getActiveTextBox() { // TODO: REMOVE
  var activeElement = document.activeElement;
  if (activeElement && activeElement.tagName=="INPUT" || activeElement.tagName=="TEXTAREA") {
    return activeElement;
  }
  return null;
}

var handlerInstalled = {};
// Add handler to the document for Alt+T key (Turn on auto-conversion)
document.addEventListener(
  "keyup",
  function(ev) {
    var key = String.fromCharCode(ev.keyCode);
    // ALT+T:
    if (ev.altKey && key && key=="T") {
      // Get the textbox
      activeTextBox = getActiveTextBox();
      if (activeTextBox) {
        if (!handlerInstalled[activeTextBox]) {
          // Event not installed. Install and notify the background page.
          myPort.postMessage({message:"DEASCIIFY_HANDLER_ON"});
          // Enable automatic deasciification while typing:
          setEnableAutoConversion(activeTextBox, true);
        } else {
          // Event was already installed, uninstall and notify the background
          myPort.postMessage({message:"DEASCIIFY_HANDLER_OFF"});
          // Disable automatic deasciification while typing:
          setEnableAutoConversion(activeTextBox, false);
        }
        // Animate
        animateTextBox(activeTextBox);
      } // activeTextBox
      return false;
    }
  },
  false
);

function setEnableAutoConversion(textBox, enabled) {
  // Bind keyup event to the textbox:
  if (enabled) {
    textBox.addEventListener("keyup", onChangeTextBox, false);
  } else {
    textBox.removeEventListener("keyup", onChangeTextBox, false);
  }
  handlerInstalled[textBox] = enabled;
}

})();
