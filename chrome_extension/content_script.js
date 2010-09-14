// The content script communicates with the background page so that we 
// don't need to include deasciifier.js in every page.
function getActiveTextBox() {
  var activeElement = document.activeElement;
  if (activeElement && 
    (activeElement.tagName=="INPUT" || activeElement.tagName=="TEXTAREA")) {
    return activeElement;
  }
  return null;
}
// Communication with the background page when user clicks on extension icon
chrome.extension.onConnect.addListener(function(port) {  
  port.onMessage.addListener(function(msg) {  
    var activeElement = getActiveTextBox();
    if (activeElement) {
      if (msg.message=="REQUEST_TEXT") {        
        port.postMessage({
          message: "TEXT_TO_DEASCIIFY",
          text: activeElement.value
        });
      }
      else if (msg.message=="DEASCIIFIED_TEXT") {
        if (activeElement) {
          activeElement.value = msg.text;          
          animateTextBox(activeElement);
        }
      }
    } // activeElement    
  });
});

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
  if (ev.keyCode==13 || ev.keyCode==32) {
    activeTextBox = ev.target;  
    if (activeTextBox && myPort) {
      myPort.postMessage({message:"DEASCIIFY_TYPED_TEXT", text:activeTextBox.value});
    }
  }
}

var handlerInstalled = {};
// Add handler to the document for Alt+T key (Turn on auto-conversion)
document.addEventListener(
  "keyup",
  function(ev) {
    var s = String.fromCharCode(ev.keyCode);
    // ALT+T:
    if (ev.altKey && s && s=="T") {
      // Get the textbox
      activeTextBox = getActiveTextBox();
      if (activeTextBox) {
      
        // Connect to the background page:
        if (!myPort) {
          myPort = chrome.extension.connect({"name":"deasciify_on_typing"});        
          myPort.onMessage.addListener(function(msg) {
            switch (msg.message) {
              case "DEASCIIFIED_TEXT_ON_TYPING":
                if (activeTextBox && msg.text) {
                  activeTextBox.value = msg.text;
                }
              break;
            }
          });
        }
          
        if (!handlerInstalled[activeTextBox]) {
          // Event not installed. Install and notify the background page.
          myPort.postMessage({message:"DEASCIIFY_HANDLER_ON"});
          // Bind keyup event to the textbox:
          activeTextBox.addEventListener("keyup", onChangeTextBox, false);
          handlerInstalled[activeTextBox] = true;          
        } else {
          // Event was already installed, uninstall and notify the background
          myPort.postMessage({message:"DEASCIIFY_HANDLER_OFF"});
          // Un-bind keyup event of the textbox:
          activeTextBox.removeEventListener("keyup", onChangeTextBox, false);
          handlerInstalled[activeTextBox] = false;
        }
        // Animate
        animateTextBox(activeTextBox);
      } // activeTextBox
      return false;
    }
  },
  false
);
