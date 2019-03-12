document.getElementById("confirm_conversions").onchange = function() {
  var checked = document.getElementById("confirm_conversions").checked;
  chrome.storage.sync.set({"confirm_conversions": checked}, function() {
    console.log('Value is set to ' + checked);
    chrome.runtime.sendMessage({
      message: "UPDATE_OPTIONS",
      options: {"confirm_conversions": checked}
    });
  });
}


chrome.storage.sync.get(["confirm_conversions"], function(result) {
  document.getElementById("confirm_conversions").checked = result.confirm_conversions;
});
