var msg = document.getElementById("msg");
window.onload = function() {
  msg.visibility = "hidden";
  var bg = chrome.extension.getBackgroundPage();
  bg.ConvertTurkishChars();
  setTimeout(
    function(){
      var result = bg.getDeasciifyResult();
      if (result) {
        msg.innerText = result.text;
        msg.visibility = "visible";
        if (!result.textFound) {   
          // if no text found, show custom text entry box:
          document.getElementById("customtext").style.display = "block";
          // hide the custom text toggler
          document.getElementById("customtext_toggler").style.display = "none";
        }
      } 
    },100
  );
}

function encode(encoder) {
  var box = document.getElementById("inputtext");
  var text = box.value;
  var encoded = null;
  switch (encoder) {
    case "tr":
      encoded = Deasciifier.deasciify(text);
    break;
    
    case "ascii":
      encoded = Asciifier.asciify(text);
    break;
    
    case "html":
      encoded = TurkishEncoder.encodeHTML(text);
    break;
    
    case "js":
      encoded = TurkishEncoder.encodeJS(text);
    break;
  }
  if (encoded) {
    box.value = encoded.text;
    box.select();
  }
  if (document.getElementById("checkCopy").checked) {
    document.execCommand("copy");
  }
}
var firstClick = true;
function resetText() {
  if (firstClick) {
    var txt = document.getElementById("inputtext");  
    txt.style.fontStyle = "";
    txt.value = "";
    firstClick = false;
  }
}
function onToggleCheckbox() {
  var checked = document.getElementById("checkCopy").checked;
  localStorage["auto_copy_to_clipboard"] = checked;
}
document.getElementById("checkCopy").checked = localStorage["auto_copy_to_clipboard"];
// Event handlers:
document.getElementById("inputtext").onclick = resetText;
document.getElementById("checkCopy").onchange = onToggleCheckbox;
document.getElementById("btn_deascii").onclick = function() {
  encode('tr');
}
document.getElementById("btn_ascii").onclick = function() {
  encode('ascii');
}
document.getElementById("btn_html").onclick = function() {
  encode('html');
}
document.getElementById("btn_js").onclick = function() {
  encode('js');
}
document.getElementById("btn_entertext").onclick = function() {
  document.getElementById('customtext').style.display = 'block';
}
