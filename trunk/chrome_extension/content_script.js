chrome.extension.onConnect.addListener(function(port) {
  var animationTimer = null;
  port.onMessage.addListener(function(msg) {  
    var activeElement = document.activeElement;
    if (activeElement && 
      (activeElement.tagName=="INPUT" || activeElement.tagName=="TEXTAREA")) {
      if (msg.message=="REQUEST_TEXT") {        
        port.postMessage({
          message: "TEXT_TO_DEASCIIFY",
          text: activeElement.value
        });
      }
      else if (msg.message=="DEASCIIFIED_TEXT") {
        if (activeElement) {
          activeElement.value = msg.text;
          
          if (animationTimer) {
            clearTimeout(animationTimer);
          }
          var originalBackground = activeElement.style.backgroundColor;
          var animationSteps = 5;
          function animate() {
            var value = Math.floor(128 + 128 * (5-animationSteps)/5.0);
            var color = "rgb(" + value + ",255," + value + ")";
            activeElement.style.backgroundColor = color;
            if ((animationSteps--)>0) {
              animationTimer = setTimeout(animate, 75);
            } else {
              activeElement.style.backgroundColor = originalBackground;
            }
          }
          animate();
        }
      }
    } // activeElement
  });
});
