/** DeasciifyApp code, for using deasciifier and deasciify box in web pages.
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *  Example usage:
 *
 *    DeasciifyApp.init({
 *      "textbox": document.getElementById("txt"), // txt is the ID of the text area
 *      "auto_convert": true,                      // Auto conversion while typing. Optional, default is true
 *      "skip_urls": true,                         // Skip URL deasciification. Optional, default is true
 *      "show_corrections":true                    // Show correction menu on click. Optional, default is true
 *    });
 *
 */

var DeasciifyApp = {
  options:{},
  textBox:null,

  deasciifySelection:function(textBox) {
    DeasciifyBox.deasciifySelection(textBox);
  },
  asciifySelection:function(textBox) {
    DeasciifyBox.asciifySelection(textBox);
  },
  displayKeyboard:function(keyboardContainer) {
    if (MEA.Keyboard) {
      if (!MEA.Keyboard.isInstalled()) {
        // Install and position:
        var keyLayoutID = DeasciifyApp.options["keyboard_layout"] || "TR_Q";
        MEA.Keyboard.install(DeasciifyApp.textBox, keyLayoutID, {"left":0, "top":0}, keyboardContainer);
        // Position the keyboard:
        var position = $(keyboardContainer).position();
        var btnKeyboard = $("#" + DeasciifyApp.options["keyboard_toggle_btn"]);
        var dimensions = MEA.Keyboard.getDimensions();
        MEA.Keyboard.position({"left":position.left-dimensions.width, "top":position.top + btnKeyboard.height() + 10});
      } else {
        if (MEA.Keyboard.isVisible()) {
          MEA.Keyboard.hide();
        } else {
          MEA.Keyboard.show();
        }
      }
    }
  },
  onChangeOption:function(optionName, domID) {
    if (document.getElementById(domID)) {
      var isEnabled = document.getElementById(domID).checked;
      this.options[optionName] = isEnabled;
      DeasciifyBox.setOption(this.textBox, optionName, isEnabled);
    }
  },

  init:function(options) {
    var self = this;
    // Load options
    var defaultOptions = [
      {"name":"textbox",            "value":"txt"},
      {"name":"auto_convert",       "value":true,   "domID":"deasciifyapp_auto_convert" },
      {"name":"skip_urls",          "value":true,   "domID":"deasciifyapp_skip_urls" },
      {"name":"show_corrections",   "value":true,   "domID":"deasciifyapp_show_corrections"},
      {"name":"keyboard_layout",    "value":"TR_Q"},
      {"name":"keyboard_toggle_btn","value":"deasciifyapp_toggle_keyboard_btn"}
    ];
    for (var i=0; i<defaultOptions.length; i++) {
      var defaultOption = defaultOptions[i];
      var optionName = defaultOption["name"];
      var checkboxName = defaultOption["checkbox"];
      var defaultValue = defaultOption["value"];
      // Set option value
      this.options[optionName] = (options && options.hasOwnProperty(optionName)) ? options[optionName] : defaultValue;
      // Set option ui
      var defaultDomID = defaultOption["domID"];
      if (defaultDomID) {
        var domID = (options && options.hasOwnProperty(defaultDomID)) ? options[defaultDomID]: defaultDomID;
        this.options[defaultDomID] = domID;
        // Bind ui event:

        var domObj = document.getElementById(domID);
        if (domObj) {
          domObj.onchange = (function(optionName, domID) {
            return function() {
              self.onChangeOption(optionName, domID);
            }
          })(optionName,domID);
        }
      }
    }
    // toggle keyboard button:
    var toggleKbdBtn = document.getElementById(this.options["keyboard_toggle_btn"]);
    if (toggleKbdBtn) {
      var that = this;
      toggleKbdBtn.onclick = function() {
        that.displayKeyboard(document.getElementById('keyboard'));
      }
    }

    // Set handlers for textbox:
    this.textBox = options["textbox"];
    if (this.textBox) {
      var options = {
        // TODO(meacer): Make sure this actually works in IE.
        "highlight": true,
        "autogrow": true,
        "auto_convert": this.options["auto_convert"],
        "show_corrections": this.options["show_corrections"]
      };
      DeasciifyBox.install(this.textBox, options);
    }
  }
};
