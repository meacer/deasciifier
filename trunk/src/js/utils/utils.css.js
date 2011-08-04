/**
 *  CSS helper for deasciifier
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *
 */
 
(function(){

  // TODO: Get rid of jQuery dependency
  // Modify jQuery to get all CSS attributes. Code from :
  // http://stackoverflow.com/questions/1004475/jquery-css-plugin-that-returns-computed-style-of-element-to-pseudo-clone-that-ele
  jQuery.fn.css2 = jQuery.fn.css;
  jQuery.fn.css = function() {
      if (arguments.length) return jQuery.fn.css2.apply(this, arguments);
      var attr = ['font-family','font-size','font-weight','font-style','color',
          'text-transform','text-decoration','letter-spacing','word-spacing',
          'line-height','text-align','vertical-align','direction','background-color',
          'background-image','background-repeat','background-position',
          'background-attachment','opacity','width','height','top','right','bottom',
          'left','margin-top','margin-right','margin-bottom','margin-left',
          'padding-top','padding-right','padding-bottom','padding-left',
          'border-top-width','border-right-width','border-bottom-width',
          'border-left-width','border-top-color','border-right-color',
          'border-bottom-color','border-left-color','border-top-style',
          'border-right-style','border-bottom-style','border-left-style','position',
          'display','visibility','z-index','overflow-x','overflow-y','white-space',
          'clip','float','clear','cursor','list-style-image','list-style-position',
          'list-style-type','marker-offset'];
      var len = attr.length, obj = {};
      for (var i = 0; i < len; i++) 
          obj[attr[i]] = jQuery.fn.css2.call(this, attr[i]);
      return obj;
  }
  
  var styleNode = null;
  var sheet = null;
  var textNode = null;
  var initialized = false;
  
  MEA.CSS = {
  
    /** 
     * @param {Object} domNode The node whose style value will be retrieved
     * @param {string=} styleName The name of the style
     * @param {boolean=} isString If true, the style value is a string
     */
    getComputedStyle:function(domNode, styleName, isString) {
      var value = isString ? "":0;
      var view = document.defaultView && document.defaultView.getComputedStyle(domNode, "");
      if (!view) {
        return value;
      }
      
      if (!styleName) { 
        // Return dictionary of styles, like jQuery 
        var styles = {};
        for (var i=0; i<view.length; i++) {
          styleName = view[i];
          value = view.getPropertyValue(styleName);
          styles[styleName] = value;
        }
        return styles;
      }
      
      value = view.getPropertyValue(styleName);
      value = isString ? value:parseInt(value,10);
      return value;
    },
    
    getHeight:function(domNode) {
      if ("offsetHeight" in domNode) {
        return domNode.offsetHeight;
      }
      return this.getComputedStyle(domNode, "height");
      //return $(domNode).height();
    },
    
    getWidth:function(domNode) {
      if ("offsetWidth" in domNode) {
        return domNode.offsetWidth;
      }
      return this.getComputedStyle(domNode, "width");
      //return $(domNode).width();
    },
    setWidth:function(domNode, width) {
      $(domNode).width(width);
    },
    setHeight:function(domNode, height) {
      $(domNode).height(height);
    },
    getPageOffsetTop:function(domNode) {
      return this.getRelativeOffsetTop(domNode) + 
        (domNode.offsetParent ? this.getPageOffsetTop(domNode.offsetParent):0);
    },
    
    getPageOffsetLeft:function(domNode) {
      return this.getRelativeOffsetLeft(domNode) + 
        (domNode.offsetParent ? this.getPageOffsetLeft(domNode.offsetParent):0);
    },
    
    getRelativeOffsetTop:function(domNode) {
      return domNode.offsetTop;
    },
    
    getRelativeOffsetLeft:function(domNode) {
      return domNode.offsetLeft;
    },
    
    getPageOffsetStart:function(domNode) {
      return this.getPageOffsetLeft(domNode);
    },
    
    getColor:function(domNode) {
      return this.getComputedStyle(domNode, "color", true);
    },
    
    getDimensions:function(domNode) {
      var _this = this;
      return {
        top   :       _this.getPageOffsetTop(domNode),
        left  :       _this.getPageOffsetLeft(domNode),
        relativeTop:  _this.getRelativeOffsetTop(domNode),
        relativeLeft: _this.getRelativeOffsetLeft(domNode), 
        width :       _this.getWidth(domNode),
        height:       _this.getHeight(domNode)
      };
    },
    getOuterDimensions:function(domNode) {
      var _this = this;
      return {
        top   :       _this.getPageOffsetTop(domNode),
        left  :       _this.getPageOffsetLeft(domNode),
        relativeTop:  _this.getRelativeOffsetTop(domNode),
        relativeLeft: _this.getRelativeOffsetLeft(domNode), 
        width :       _this.getOuterWidth(domNode),
        height:       _this.getOuterHeight(domNode)
      };
    },
    // Create CSS style
    createStyles:function(styleList) {
      // Create the styles
      for (var i=0; i<styleList.length; i++) {
        this.createStyle(styleList[i][0], styleList[i][1].join("")); 
      }
    },
    
    setClass:function(domNode, className) {
      domNode.className = className;
      domNode.setAttribute("class", className);
    },
    
    // TODO: Is this cross browser?
    addClass:function(domNode, className) {
      domNode.className += " " + className;
    },
    
    setStyles:function(domNode, styles) {
      for (var styleName in styles) {
        domNode.style[styleName] = styles[styleName];
      }
    },
    
    getStyles:function(domNode) {
      return this.getComputedStyle(domNode);
    },

    _copyStyle:function(destNode, srcNode, styleName) {
      // TODO: Check IE
      /*var srcStyles = this.getComputedStyle(srcNode, "", true);
      for (var i=0; i<srcStyles.length; i++) {
        var style = srcStyles[i];
        if (style.indexOf(styleName)==0) {
          var srcValue = this.getComputedStyle(srcNode, style, true);//srcNode.style[styleName];
          destNode.style[style] = srcValue;
          //destNode.style.setProperty(styleName, srcValue, 
          //  priority=srcNode.style.getPropertyPriority(styleName));
        }
      }*/
      var styles =  this.getStyles(srcNode);  //jQuery(srcNode).css();
      for (var style in styles) {
        if (style.indexOf(styleName)==0) {
          //jQuery(destNode).css(style, styles[style]);
        }
      }
    },
    
    /** Copies computed CSS styles from srcNode to destNode.  Supports wildcards
     * on style names to copy, e.g. ["border*", "text*", "line-height"] will copy
     * all styles starting with 'border' and 'text' and also copy the exact style
     * named line-height. The wildcard is only valid at the end of the string .
     *
     * @param destNode Destination node
     * @param srcNode Source node
     * @param stylesToCopy List of styles to copy.
     */
    copyStyles:function(destNode, srcNode, stylesToCopy) {
      // TODO: Check IE
      /*var srcStyles = this.getComputedStyle(srcNode, "", true);
      for (var i=0; i<srcStyles.length; i++) {
        var style = srcStyles[i];
        if (style.indexOf(styleName)==0) {
          var srcValue = this.getComputedStyle(srcNode, style, true);//srcNode.style[styleName];
          destNode.style[style] = srcValue;
          //destNode.style.setProperty(styleName, srcValue, 
          //  priority=srcNode.style.getPropertyPriority(styleName));
        }
      }*/
      // TODO: Eliminate jQuery here?
      //var srcStyles = this.getStyles(srcNode);
      var srcStyles = jQuery(srcNode).css();
      for (var i=0; i<stylesToCopy.length; i++) {
        var styleToCopy = stylesToCopy[i];
        if (!styleToCopy) {
          continue;
        }
        var wildcard = (styleToCopy[styleToCopy.length-1]=="*");
        if (wildcard) {
          styleToCopy = styleToCopy.substring(0, styleToCopy.length-1);
        }
        for (var styleName in srcStyles) {
          if (styleName==styleToCopy || (wildcard && styleName.indexOf(styleToCopy)==0)) {
            jQuery(destNode).css(styleName, srcStyles[styleName]);
            /*var style = {};
            style[styleName] = srcStyles[styleName];
            this.setStyles(destNode, style);
            */
            if (!wildcard) {
              // No need to copy further styles:
              break;
            }
          }
        }
      }
    },
    
    setOuterWidth:function(domNode, width) {
      var borderLeft = this.getComputedStyle(domNode, "border-left-width");
      var borderRight = this.getComputedStyle(domNode, "border-right-width");
      this.setStyles(domNode, {"width":(width-(borderLeft+borderRight)) + "px"});
    },
    setOuterHeight:function(domNode, height) {
      var borderTop = this.getComputedStyle(domNode, "border-left-width");
      var borderBottom = this.getComputedStyle(domNode, "border-right-width");
      this.setStyles(domNode, {"height":(height-(borderTop+borderBottom)) + "px"});
    },
    
    getOuterWidth:function(domNode) {
      // return this.getWidth(domNode) + this.getBorderWidth(domNode);
      return jQuery(domNode).outerWidth();
    },
    getOuterHeight:function(domNode) {
      // return this.getHeight(domNode) + this.getBorderHeight(domNode);
      return jQuery(domNode).outerHeight();
    },
    
    /** Returns the total width of the horizontal borders
     */
    getBorderWidth:function(domNode) {
      var borderLeft = this.getComputedStyle(domNode, "border-left-width");
      var borderRight = this.getComputedStyle(domNode, "border-right-width");
      return borderLeft + borderRight;
    },
    /** Returns the total width of the vertical borders
     */
    getBorderHeight:function(domNode) {
      var borderTop = this.getComputedStyle(domNode, "border-top-width");
      var borderBottom = this.getComputedStyle(domNode, "border-bottom-width");
      return borderTop + borderBottom;
    },
    
    createStyle:function(styleName, styleDef) {
      var styleText = styleName + " { " + styleDef + " }";
      log("Creating style " + styleText);
      try { // FIXME: Opera is throwing DOMException?
      
        if (sheet && sheet.insertRule) {
          // Chrome, Firefox, Safari, Opera
          sheet.insertRule(styleText, sheet.cssRules.length);
        } else if (styleNode.styleSheet) {
          // IE
          textNode.data += styleText + "\n";
          styleNode.styleSheet.cssText = textNode.nodeValue;
        } else {
          styleNode.innerHTML += (styleText + "\n");
        }
      } catch (e) {
        log(e.toString());
      }
    },
    
    init:function() {
      if (initialized) {
        return;
      }
      styleNode = document.createElement("style");
      var headNode = document.getElementsByTagName("head")[0];
      if (headNode) {
        headNode.appendChild(styleNode);
      } else {
        document.body.appendChild(styleNode);
      }
      sheet = styleNode.sheet;
      textNode = null;
      if (!sheet) {
        // For IE, add style text to this textnode
        textNode = document.createTextNode("");
      }
      initialized = true;
    }
  };
  
  MEA.CSS.init();

})();
