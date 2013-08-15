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
function onToggleCheckbox() {
  var checked = document.getElementById("checkCopy").checked;
  localStorage["auto_copy_to_clipboard"] = checked;
}
document.getElementById("checkCopy").checked = localStorage["auto_copy_to_clipboard"];
// Event handlers:
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
