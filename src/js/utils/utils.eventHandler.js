/**
*  Event handler for deasciifier
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *
 */

(function(){

  MEA.EventHandler = {
  
    /**
     * Enum for key codes
     * @enum
    */
    KeyCodes:{
      ENTER: 13,
      CTRL:  17,
      SPACE: 32,
      UP_ARROW:   38,
      DOWN_ARROW: 40
    },
  
    /**
     * @enum
     */
    MouseButtons:{
      Left : 1,
      Right: 2
    },
  
    bindEvent:function(obj, eventName, func, bubble) {
      var eventNameLowerCase = "on" + eventName.toLowerCase();
      if (obj.addEventListener) {
        // Chrome, Firefox, Safari, Opera
        obj.addEventListener(eventName, func, bubble);
      } else {
        // IE
        obj.attachEvent(eventNameLowerCase, func, bubble); // TODO: Check API
      }
    },
    
    unbindEvent:function(obj, eventName, func) {
      var eventNameLowerCase = "on" + eventName.toLowerCase();
       if (obj.addEventListener) {
        // Chrome, Firefox, Safari, Opera
        obj.removeEventListener(eventName, func);
      } else {
        // IE
        obj.detachEvent(eventNameLowerCase, func);
      }
    },

    getEvent:function(evt) {
      return evt || window.event;
    },
    
    cancelEvent:function(evt) {
      evt = this.getEvent(evt);
      evt.returnValue = false;
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      return false;
    },
  
    getKeyCode:function(evt) {
      evt = this.getEvent(evt);
      var keyCode = (evt.which) ? evt.which: evt.keyCode;
      return keyCode;
    },
    
    getTarget:function(evt) {
      evt = this.getEvent(evt);
      var target = null;
      if (evt.target) {
        target = evt.target;
      } else if (evt.srcElement) {
        target = evt.srcElement;
      }
      if (target.nodeType==3) { // Safari bug
        target = target.parentNode;
      }
      return target;
    }
  };
  
})();
