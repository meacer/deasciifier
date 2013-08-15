// Author: Mustafa Emre Acer
//
// Chrome deasciifier content script: Communicates with the background page so
// that we don't need to include deasciifier.js in every page.

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

function getActiveInput() {
  var activeElement = document.activeElement;
  if (activeElement) {
    // Gmail style html inputs:
    if (activeElement.tagName == "IFRAME") {
      activeElement = activeElement.contentDocument.activeElement;
      if (activeElement &&
          activeElement.tagName == "BODY" &&
          activeElement.isContentEditable) {
        return activeElement;
      }
      return null;
    }
    if (activeElement.tagName == "INPUT" ||
        activeElement.tagName == "TEXTAREA") {
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
  return (element &&
      element.tagName == "INPUT" ||
      element.tagName == "TEXTAREA");
}

function isContentEditableElement(element) {
  return (element && element.tagName == "BODY" && element.isContentEditable);
}

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

function deasciifyActiveElement() {
  var activeElement = getActiveInput();
  if (activeElement) {
    var input = getTextToConvert(activeElement);
    // Ask the background to deasciify the text.
    chrome.runtime.sendMessage({
      message: "TEXT_TO_DEASCIIFY",
      input: input
    }, function(response) {
      setConvertedText(activeElement, response);
    });
  } else {
    // Nothing to deasciify. Let background know page so that it can show the
    // popup.
    chrome.runtime.sendMessage({
      message: "NOTHING_TO_DEASCIIFY"
    });
  }
}


// =============================================================================
// Automatic conversion related code.

function onChangeTextBox(ev) {
  // Convert word at cursor if space or enter is pressed
  if (ev.keyCode == 13 || ev.keyCode == 32) {
    var activeTextBox = ev.target;
    console.log("Key pressed: " + ev.keyCode);
    if (activeTextBox) {
      chrome.runtime.sendMessage({
        message: "DEASCIIFY_TYPED_TEXT",
        text:activeTextBox.value,
        selectionStart: activeTextBox.selectionStart,
        selectionEnd: activeTextBox.selectionEnd,
      }, function(response) {
          activeTextBox.value = response.text;
          // Restore the cursor.
          if (response.selectionStart && response.selectionEnd &&
              response.selectionStart == response.selectionEnd) {
            activeTextBox.selectionStart = response.selectionStart;
            activeTextBox.selectionEnd = response.selectionEnd;
          }
      });
    }
  }
}

function setEnableAutoConversion(textBox, enabled) {
  // Bind keyup event to the textbox. This will clear any previous
  // keyup handlers.
  if (enabled) {
    textBox.onkeyup = onChangeTextBox;
    chrome.runtime.sendMessage({message: "DEASCIIFY_HANDLER_ON"});
  } else {
    textBox.onkeyup = null;
    chrome.runtime.sendMessage({message: "DEASCIIFY_HANDLER_OFF"});
  }
}


function getActiveTextBox() { // TODO: REMOVE
  var activeElement = document.activeElement;
  if (activeElement && activeElement.tagName == "INPUT" ||
      activeElement.tagName == "TEXTAREA") {
    return activeElement;
  }
  return null;
}

function toggleAutoDeasciify() {
  console.log("toggleAutoDeasciify()");
  var activeTextBox = getActiveTextBox();
  if (!activeTextBox.onkeyup) {
    setEnableAutoConversion(activeTextBox, true);
  } else {
    setEnableAutoConversion(activeTextBox, false);
  }
  animateTextBox(activeTextBox);
}
//@ sourceURL=execute.js