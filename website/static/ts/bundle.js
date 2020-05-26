(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DeasciifierApp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// <reference path="./common.ts" />
/// <reference path="./deasciifier.ts" />
/// <reference path="./correction_menu.ts" />
exports.__esModule = true;
exports.App = void 0;
var common_1 = require("./common");
var deasciifier_1 = require("./deasciifier");
var correction_menu_1 = require("./correction_menu");
var keyboard_1 = require("./keyboard");
var text_helper_1 = require("./text_helper");
var dom_1 = require("./dom");
var keyboard_layout_turkish_1 = require("./keyboard_layout_turkish");
var AppOptions = /** @class */ (function () {
    function AppOptions(highlightChanges, enableCorrectionMenu, enableAutoConvert) {
        this.highlightChanges = highlightChanges;
        this.enableCorrectionMenu = enableCorrectionMenu;
        this.enableAutoConvert = enableAutoConvert;
    }
    return AppOptions;
}());
var CodeMirrorEditor = /** @class */ (function () {
    function CodeMirrorEditor(editor, eventListener) {
        this.editor = editor;
        this.eventListener = eventListener;
        editor.getWrapperElement().onkeyup = function (e) {
            eventListener.onKeyUp(e.keyCode);
        };
        editor.getWrapperElement().onclick = function (e) {
            eventListener.onClick();
        };
    }
    CodeMirrorEditor.prototype.setText = function (text, range) {
        if (range) {
            var rangeStart = this.editor.posFromIndex(range.start);
            var rangeEnd = this.editor.posFromIndex(range.end);
            this.editor.replaceRange(text, rangeStart, rangeEnd);
        }
        else {
            this.editor.setValue(text);
        }
    };
    CodeMirrorEditor.prototype.getText = function () {
        return this.editor.getValue();
    };
    CodeMirrorEditor.prototype.getSelection = function () {
        var start = this.editor.indexFromPos(this.editor.getCursor(true));
        var end = this.editor.indexFromPos(this.editor.getCursor(false));
        return new common_1.TextRange(start, end);
    };
    CodeMirrorEditor.prototype.setSelection = function (range) {
        var rangeStart = this.editor.posFromIndex(range.start);
        var rangeEnd = this.editor.posFromIndex(range.end);
        this.editor.setSelection(rangeStart, rangeEnd);
    };
    CodeMirrorEditor.prototype.highlight = function (range, cssName) {
        var rangeStart = this.editor.posFromIndex(range.start);
        var rangeEnd = this.editor.posFromIndex(range.end);
        return this.editor.markText(rangeStart, rangeEnd, { readOnly: false, className: cssName });
    };
    CodeMirrorEditor.prototype.highlightMultiple = function (ranges, cssName) {
        var self = this;
        this.editor.operation(function () {
            for (var _i = 0, ranges_1 = ranges; _i < ranges_1.length; _i++) {
                var range = ranges_1[_i];
                self.highlight(range, cssName);
            }
        });
    };
    CodeMirrorEditor.prototype.clearHighlights = function (range) {
        var rangeStart = this.editor.posFromIndex(range.start);
        var rangeEnd = this.editor.posFromIndex(range.end);
        var marks = this.editor.findMarks(rangeStart, rangeEnd);
        for (var _i = 0, marks_1 = marks; _i < marks_1.length; _i++) {
            var mark = marks_1[_i];
            mark.clear();
        }
    };
    CodeMirrorEditor.prototype.getPosition = function (index) {
        var linech = this.editor.posFromIndex(index);
        var coords = this.editor.charCoords(linech);
        return { left: coords.left, top: coords.top };
    };
    CodeMirrorEditor.prototype.getLineHeight = function () {
        return this.editor.defaultTextHeight();
    };
    CodeMirrorEditor.prototype.putAtCursor = function (text) {
        var selection = this.getSelection();
        this.setText(text, selection);
    };
    CodeMirrorEditor.prototype.deleteCursor = function () {
        this.editor.execCommand("delCharBefore");
    };
    CodeMirrorEditor.prototype.focus = function () {
        this.editor.focus();
    };
    return CodeMirrorEditor;
}());
var TextProcessorMode;
(function (TextProcessorMode) {
    TextProcessorMode[TextProcessorMode["DEASCIIFY"] = 0] = "DEASCIIFY";
    TextProcessorMode[TextProcessorMode["ASCIIFY"] = 1] = "ASCIIFY";
})(TextProcessorMode || (TextProcessorMode = {}));
var DeasciifyProcessor = /** @class */ (function () {
    function DeasciifyProcessor(deasciifier, asciifier) {
        this.deasciifier = deasciifier;
        this.asciifier = asciifier;
        this.processor = deasciifier;
    }
    DeasciifyProcessor.prototype.setMode = function (mode) {
        if (mode == TextProcessorMode.DEASCIIFY)
            this.processor = this.deasciifier;
        else
            this.processor = this.asciifier;
    };
    DeasciifyProcessor.prototype.processRange = function (text, range, options) {
        return this.processor.processRange(text, range, options);
    };
    DeasciifyProcessor.prototype.process = function (text, options) {
        return this.processor.process(text, options);
    };
    return DeasciifyProcessor;
}());
var CorrectionCallbackImpl = /** @class */ (function () {
    function CorrectionCallbackImpl(box) {
        this.box = box;
    }
    CorrectionCallbackImpl.prototype.onchange = function (text) {
        this.box.oncorrectiontextchange(text);
    };
    return CorrectionCallbackImpl;
}());
var DeasciiBox = /** @class */ (function () {
    function DeasciiBox(parent, domFactory, textEditor, textProcessor) {
        this.textEditor = textEditor;
        this.textProcessor = textProcessor;
        this.app_options_ = new AppOptions(true, true, true);
        // Skip URLs etc.
        this.processing_options_ = new common_1.TextProcessingOptions(true);
        this.correctionMenuSelection = null;
        var correctionElement = domFactory.createDiv();
        this.correctionMenu =
            new correction_menu_1.CorrectionMenu(correctionElement, new CorrectionCallbackImpl(this), domFactory);
        parent.appendChild(correctionElement);
    }
    DeasciiBox.prototype.oncorrectiontextchange = function (text) {
        this.textEditor.setText(text, this.correctionMenuSelection);
    };
    DeasciiBox.prototype.onKeyUp = function (keyCode) {
        if (!this.app_options_.enableAutoConvert) {
            return;
        }
        if (text_helper_1.TextHelper.isSeparatorChar(String.fromCharCode(keyCode))) {
            this.deasciifyCursor();
        }
    };
    DeasciiBox.prototype.onClick = function () {
        this.hideCorrectionMenu();
        if (!this.app_options_.enableCorrectionMenu) {
            return;
        }
        var selectionRange = this.textEditor.getSelection();
        // If the user double clicks on a word, the word will be selected and start
        // and end will be different. Don't do anything in that case.
        if (selectionRange.start != selectionRange.end) {
            return;
        }
        var cursorPos = selectionRange.start;
        var text = this.textEditor.getText();
        // Only show the menu if we are in the middle of a word
        if (!text_helper_1.TextHelper.isCursorInsideWord(text, cursorPos)) {
            return;
        }
        var wordBoundary = text_helper_1.TextHelper.getWordAtCursor(text, cursorPos);
        var wordText = text.substring(wordBoundary.start, wordBoundary.end);
        // Don't show menu if there is nothing to suggest
        if (!correction_menu_1.CorrectionMenu.hasCorrections(wordText)) {
            return;
        }
        var startCoords = this.textEditor.getPosition(wordBoundary.start);
        var endCoords = this.textEditor.getPosition(wordBoundary.end);
        var middleX = (startCoords.left + endCoords.left) / 2;
        var menuCoords = {
            left: middleX,
            top: startCoords.top + this.textEditor.getLineHeight()
        };
        this.correctionMenuSelection = wordBoundary;
        this.correctionMenu.show(menuCoords, wordText);
        this.correctionMenuHighlight =
            this.textEditor.highlight(wordBoundary, "correction-menu-selection");
    };
    DeasciiBox.prototype.deasciifyCursor = function () {
        var selectionRange = this.textEditor.getSelection();
        var rangeToDeasciify = null;
        var text = this.textEditor.getText();
        if (selectionRange.start == selectionRange.end) {
            // No text selected. Get the boundaries of the last word that is
            // separated by space, enter etc.
            rangeToDeasciify =
                text_helper_1.TextHelper.getWordBeforeCursor(text, selectionRange.start);
        }
        else {
            // A portion of the text is already selected. Deasciify only the
            // selected part.
            rangeToDeasciify = selectionRange;
        }
        // Deasciify the range.
        var result = this.textProcessor.processRange(text, rangeToDeasciify, this.processing_options_);
        // Highlight the results.
        this.displayResult(result);
        // Restore cursor.
        this.textEditor.setSelection(selectionRange);
    };
    /** Displays the conversion results in the textbox and highlights the
     * converted characters if necessary.
     */
    DeasciiBox.prototype.displayResult = function (result) {
        if (result && result.text) {
            this.textEditor.setText(result.text);
            this.highlightChanges(result.changedPositions, false);
        }
    };
    DeasciiBox.prototype.highlightChanges = function (changedPositions, forceClear) {
        // Highlight results.
        if (!this.app_options_.highlightChanges) {
            return;
        }
        if ((!changedPositions || changedPositions.length == 0) && !forceClear) {
            return;
        }
        //this.textEditor.clearHighlights();
        var ranges = [];
        for (var i = 0; i < changedPositions.length; i++) {
            ranges.push(new common_1.TextRange(changedPositions[i], changedPositions[i] + 1));
        }
        this.textEditor.highlightMultiple(ranges, "deasciifier-highlight");
    };
    DeasciiBox.prototype.hideCorrectionMenu = function () {
        this.correctionMenu.hide();
        if (this.correctionMenuSelection) {
            this.textEditor.clearHighlights(this.correctionMenuSelection);
        }
        if (this.correctionMenuHighlight) {
            this.correctionMenuHighlight.clear();
        }
    };
    DeasciiBox.prototype.processSelection = function (mode) {
        var range = this.textEditor.getSelection();
        if (range.start == range.end) {
            range = { start: 0, end: this.textEditor.getText().length };
        }
        this.textProcessor.setMode(mode);
        var result = this.textProcessor.processRange(this.textEditor.getText(), range, this.processing_options_);
        this.textEditor.setText(result.text.substring(range.start, range.end), range);
        this.highlightChanges(result.changedPositions, false);
        return result;
    };
    DeasciiBox.prototype.setEnableCorrectionMenu = function (enabled) {
        if (!enabled) {
            this.hideCorrectionMenu();
        }
        this.app_options_.enableCorrectionMenu = enabled;
    };
    DeasciiBox.prototype.setEnableAutoConvert = function (enabled) {
        this.app_options_.enableAutoConvert = enabled;
    };
    return DeasciiBox;
}());
var KeyboardHandler = /** @class */ (function () {
    function KeyboardHandler(app, editor) {
        this.app = app;
        this.editor = editor;
    }
    KeyboardHandler.prototype.onKey = function (key) {
        this.app.hideCorrectionMenu();
        this.editor.focus();
        if (key == "backspace") {
            this.editor.deleteCursor();
            return;
        }
        this.editor.putAtCursor(key);
    };
    return KeyboardHandler;
}());
// The actual app.
var App = /** @class */ (function () {
    function App(codemirror, pattern_list, parentContainer, keyboardContainer, domFactory) {
        if (domFactory === void 0) { domFactory = new dom_1.DomFactoryImpl(); }
        this.deasciifier_instance = new deasciifier_1.Deasciifier();
        this.deasciifier_instance.init(pattern_list);
        this.asciifier_instance = new deasciifier_1.Asciifier();
        var parent = new dom_1.DomElementImpl(parentContainer);
        this.textEditor = new CodeMirrorEditor(codemirror, this);
        this.deasciiBox =
            new DeasciiBox(parent, domFactory, this.textEditor, new DeasciifyProcessor(this.deasciifier_instance, this.asciifier_instance));
        var keyboard_container = new dom_1.DomElementImpl(keyboardContainer);
        this.keyboard = new keyboard_1.Keyboard(keyboard_layout_turkish_1.KeyboardLayout['TR_Q'], keyboard_container, domFactory);
        parent.appendChild(keyboard_container);
        this.keyboardHandler = new KeyboardHandler(this, this.textEditor);
        this.keyboard.create(this.keyboardHandler);
    }
    App.prototype.deasciifySelection = function () {
        return this.deasciiBox.processSelection(TextProcessorMode.DEASCIIFY);
    };
    App.prototype.asciifySelection = function () {
        return this.deasciiBox.processSelection(TextProcessorMode.ASCIIFY);
    };
    App.prototype.hideCorrectionMenu = function () {
        this.deasciiBox.hideCorrectionMenu();
    };
    App.prototype.onKeyUp = function (keyCode) {
        this.deasciiBox.onKeyUp(keyCode);
    };
    App.prototype.onClick = function () {
        this.deasciiBox.onClick();
    };
    App.prototype.setEnableCorrectionMenu = function (enabled) {
        this.deasciiBox.setEnableCorrectionMenu(enabled);
    };
    App.prototype.setEnableAutoConvert = function (enabled) {
        this.deasciiBox.setEnableAutoConvert(enabled);
    };
    return App;
}());
exports.App = App;

},{"./common":2,"./correction_menu":3,"./deasciifier":4,"./dom":5,"./keyboard":6,"./keyboard_layout_turkish":7,"./text_helper":8}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Position = exports.KeyCode = exports.TextProcessingOptions = exports.TextRange = void 0;
// A text range. |start| is inclusive, |end| is exclusive.
var TextRange = /** @class */ (function () {
    function TextRange(start, end) {
        this.start = start;
        this.end = end;
    }
    TextRange.prototype.empty = function () {
        return this.start >= this.end;
    };
    return TextRange;
}());
exports.TextRange = TextRange;
var TextProcessingOptions = /** @class */ (function () {
    function TextProcessingOptions(skipURLs) {
        this.skipURLs = skipURLs;
    }
    return TextProcessingOptions;
}());
exports.TextProcessingOptions = TextProcessingOptions;
var KeyCode = /** @class */ (function () {
    function KeyCode() {
    }
    KeyCode.SPACE = 32;
    KeyCode.ENTER = 13;
    KeyCode.COMMA = 188;
    KeyCode.PERIOD = 190;
    KeyCode.FORWARD_SLASH = 191;
    KeyCode.DASH = 189;
    KeyCode.SEMICOLON = 186;
    return KeyCode;
}());
exports.KeyCode = KeyCode;
var Position = /** @class */ (function () {
    function Position(top, left) {
        this.top = top;
        this.left = left;
    }
    return Position;
}());
exports.Position = Position;

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.CorrectionMenu = void 0;
var turkish_1 = require("./turkish");
function makeCorrectionTable() {
    var table = {};
    for (var key in turkish_1.TURKISH_CHAR_ALIST) {
        table[key] = turkish_1.TURKISH_CHAR_ALIST[key];
    }
    for (var key in turkish_1.TURKISH_ASCIIFY_TABLE) {
        table[key] = turkish_1.TURKISH_ASCIIFY_TABLE[key];
    }
    return table;
}
var CORRECTION_TABLE = makeCorrectionTable();
var CorrectionView = /** @class */ (function () {
    function CorrectionView(container, correctionCallback, domFactory) {
        this.container = container;
        this.correctionCallback = correctionCallback;
        this.domFactory = domFactory;
    }
    CorrectionView.prototype.render = function (text) {
        this.text = text;
        this.children = [];
        this.container.clear();
        var textContainer = this.domFactory.createDiv();
        textContainer.setClassName("correction-menu-text");
        var _loop_1 = function (i) {
            var ch = text.charAt(i);
            var div = this_1.domFactory.createDiv();
            var classNames = ["correction-menu-item"];
            if (i == 0) {
                classNames.push("correction-menu-item-first");
            }
            else if (i == text.length - 1) {
                classNames.push(" correction-menu-item-last");
            }
            var alternative = CORRECTION_TABLE[ch];
            if (alternative) {
                var self_1 = this_1;
                classNames.push("correction-menu-item-alternative");
                div.setClickHandler(function () {
                    self_1.onclick(i);
                });
            }
            div.setText(ch);
            div.setClassName(classNames.join(" "));
            this_1.children.push(div);
            textContainer.appendChild(div);
        };
        var this_1 = this;
        for (var i = 0; i < text.length; i++) {
            _loop_1(i);
        }
        this.container.appendChild(textContainer);
    };
    CorrectionView.prototype.onclick = function (index) {
        var div = this.children[index];
        var alternative = CORRECTION_TABLE[div.getText()];
        if (!alternative) {
            return;
        }
        div.setText(alternative);
        this.text =
            this.text.substring(0, index) + alternative
                + this.text.substring(index + 1);
        this.correctionCallback.onchange(this.text);
    };
    return CorrectionView;
}());
var CorrectionMenu = /** @class */ (function () {
    function CorrectionMenu(container, correctionCallback, domFactory) {
        this.container = container;
        this.correctionCallback = correctionCallback;
        this.domFactory = domFactory;
        this.container.setClassName("correction-menu");
        this.view =
            new CorrectionView(this.container, correctionCallback, domFactory);
    }
    CorrectionMenu.hasCorrections = function (text) {
        for (var i = 0; i < text.length; i++) {
            if (CORRECTION_TABLE[text.charAt(i)]) {
                return true;
            }
        }
        return false;
    };
    CorrectionMenu.prototype.show = function (pos, text) {
        this.view.render(text);
        this.container.setPosition(pos);
        this.container.show();
    };
    CorrectionMenu.prototype.hide = function () {
        this.container.hide();
    };
    return CorrectionMenu;
}());
exports.CorrectionMenu = CorrectionMenu;

},{"./turkish":9}],4:[function(require,module,exports){
"use strict";
/// <reference path="./common.ts" />
/// <reference path="./turkish.ts" />
exports.__esModule = true;
exports.Deasciifier = exports.EMAIL_REGEX = exports.URL_REGEX = exports.Asciifier = void 0;
var common_1 = require("./common");
var turkish_1 = require("./turkish");
var SkipList = /** @class */ (function () {
    function SkipList(skipRegions) {
        this.skipRegions = skipRegions;
    }
    SkipList.prototype.shouldExclude = function (pos) {
        for (var i = 0; i < this.skipRegions.length; i++) {
            if (pos >= this.skipRegions[i].start &&
                pos <= this.skipRegions[i].end) {
                return true;
            }
        }
        return false;
    };
    return SkipList;
}());
var Asciifier = /** @class */ (function () {
    function Asciifier() {
    }
    Asciifier.prototype.processRange = function (text, range, options) {
        if (text === null) {
            return null;
        }
        // There seems to be a bug here. Chrome fails to convert long texts
        // correctly.
        var changedPositions = [];
        var output = new Array(text.length);
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            if (i >= range.start && i < range.end) {
                var toggled = turkish_1.TURKISH_ASCIIFY_TABLE[ch];
                if (toggled) {
                    output[i] = toggled;
                    changedPositions.push(i);
                    continue;
                }
            }
            output[i] = ch;
        }
        return {
            text: output.join(""),
            changedPositions: changedPositions
        };
    };
    Asciifier.prototype.process = function (text, options) {
        if (!text) {
            return null;
        }
        return this.processRange(text, { start: 0, end: text.length }, options);
    };
    return Asciifier;
}());
exports.Asciifier = Asciifier;
exports.URL_REGEX = /\b((((https?|ftp|file):\/\/)|(www\.))[^\s]+)/gi;
exports.EMAIL_REGEX = /((^|\s).*)?@(.*\s)?/gi;
var DefaultSkipFilter = /** @class */ (function () {
    function DefaultSkipFilter() {
    }
    DefaultSkipFilter.getSkipRegions = function (options, text) {
        // TODO: Better algorithm here if number of regions grow large
        var regexps = [];
        if (options && options.skipURLs) {
            regexps.push(exports.URL_REGEX);
            regexps.push(exports.EMAIL_REGEX);
        }
        var skipList = [];
        for (var i = 0; i < regexps.length; i++) {
            var regex = regexps[i];
            var match = null;
            while ((match = regex.exec(text)) != null) {
                var startPos = match.index;
                var endPos = regex.lastIndex;
                var region = new common_1.TextRange(startPos, endPos);
                skipList.push(region);
            }
        }
        return new SkipList(skipList);
    };
    return DefaultSkipFilter;
}());
var TURKISH_CONTEXT_SIZE = 10;
function make_turkish_downcase_asciify_table() {
    var ct = {};
    var ch = 'a';
    // Initialize for all characters in English alphabet.
    while (ch <= 'z') {
        ct[ch] = ch;
        ct[ch.toUpperCase()] = ch;
        ch = String.fromCharCode(ch.charCodeAt(0) + 1); // next char
    }
    // Now check the characters in Turkish alphabet.
    for (var i in turkish_1.TURKISH_CHAR_ALIST) {
        ct[turkish_1.TURKISH_CHAR_ALIST[i]] = i.toLowerCase();
    }
    return ct;
}
function make_turkish_upcase_accents_table() {
    var ct = {};
    var ch = 'a';
    // Initialize for all characters in English alphabet.
    while (ch <= 'z') {
        ct[ch] = ch;
        ct[ch.toUpperCase()] = ch;
        ch = String.fromCharCode(ch.charCodeAt(0) + 1); // next char
    }
    // Now check the characters in Turkish alphabet
    // (same as downcase table except for .toUpperCase).
    for (var i in turkish_1.TURKISH_CHAR_ALIST) {
        ct[turkish_1.TURKISH_CHAR_ALIST[i]] = i.toUpperCase();
    }
    ct['i'] = 'i';
    ct['I'] = 'I';
    // We will do this part a bit different. Since we have only one
    // correspondence for every character in TURKISH_CHAR_ALIST,
    // we will just set the values directly:
    ct['\u0130'] = 'i'; // upper turkish i
    ct['\u0131'] = 'I'; // lower turkish i
    return ct;
}
function make_turkish_toggle_accent_table() {
    var ct = {};
    for (var i in turkish_1.TURKISH_CHAR_ALIST) {
        ct[i] = turkish_1.TURKISH_CHAR_ALIST[i]; // ascii to turkish
        ct[turkish_1.TURKISH_CHAR_ALIST[i]] = i; // turkish to ascii
    }
    return ct;
}
function setCharAt(str, pos, c) {
    return str.substring(0, pos) + c + str.substring(pos + 1);
}
var Deasciifier = /** @class */ (function () {
    function Deasciifier() {
        this.initialized = false;
        this.TURKISH_DOWNCASE_ASCIIFY_TABLE =
            make_turkish_downcase_asciify_table();
        this.TURKISH_UPCASE_ACCENTS_TABLE =
            make_turkish_upcase_accents_table();
        this.TURKISH_TOGGLE_ACCENT_TABLE =
            make_turkish_toggle_accent_table();
    }
    Deasciifier.prototype.setPatternListLoadedCallback = function (callback) {
        this.patternListLoadedCallback = callback;
    };
    Deasciifier.prototype.turkish_correct_region = function (text, start, end, filter) {
        if (!this.initialized) {
            throw new Error("Pattern list not loaded");
        }
        if (text === null) {
            return null;
        }
        if (start < 0) {
            start = 0;
        }
        if (end > text.length) {
            end = text.length;
        }
        var changedPositions = [];
        for (var i = start; i < end; i++) {
            if (filter && filter.shouldExclude(i)) {
                continue;
            }
            if (this.turkish_need_correction(text, i)) {
                text = this.turkish_toggle_accent(text, i);
                changedPositions.push(i);
            }
        }
        return {
            text: text,
            changedPositions: changedPositions
        };
    };
    Deasciifier.prototype.turkish_toggle_accent = function (text, pos) {
        var alt = this.TURKISH_TOGGLE_ACCENT_TABLE[text.charAt(pos)];
        if (alt) {
            return setCharAt(text, pos, alt);
        }
        return text;
    };
    Deasciifier.prototype.turkish_need_correction = function (text, pos) {
        var ch = text.charAt(pos);
        var tr = turkish_1.TURKISH_ASCIIFY_TABLE[ch];
        if (!tr) {
            tr = ch;
        }
        var pattern_list = this.turkish_pattern_table[tr.toLowerCase()];
        var match = pattern_list && this.turkish_match_pattern(text, pos, pattern_list);
        // If match then char should turn into turkish else stay ascii.
        // Only exception with capital I when we need the reverse.
        if (tr == "I") {
            return (ch == tr) ? !match : match;
        }
        return (ch == tr) ? match : !match;
    };
    Deasciifier.prototype.turkish_match_pattern = function (text, pos, decision_list) {
        // TODO: Figure out if this should be negative. When positive, the default
        // behavior is to deasciify the character (e.g. no pattern matches and
        // rank remains equal to Number.MAX_VALUE)
        var rank = Number.MAX_VALUE;
        var str = this.turkish_get_context(text, pos, TURKISH_CONTEXT_SIZE);
        var start = 0;
        var len = str.length;
        // Selects the pattern with the smallest absolute non-zero rank.
        // E.g. A rank of -1 or 1 will have more priority than a rank of 2 or -2.
        while (start <= TURKISH_CONTEXT_SIZE) {
            var end = TURKISH_CONTEXT_SIZE + 1;
            while (end <= len) {
                var s = str.substring(start, end);
                var r = decision_list[s]; // lookup the pattern
                if (r && Math.abs(r) < Math.abs(rank)) {
                    rank = r;
                }
                end++;
            }
            start++;
        }
        return rank > 0;
    };
    Deasciifier.prototype.turkish_get_context = function (text, pos, size) {
        // s is initially (2 * size + 1) spaces.
        var s = Array(2 * size + 1 + 1).join(' ');
        s = setCharAt(s, size, 'X');
        var space = false;
        var i = size + 1;
        var index = pos + 1;
        while (i < s.length && !space && index < text.length) {
            var c = text.charAt(index);
            var x = this.TURKISH_DOWNCASE_ASCIIFY_TABLE[c];
            if (!x) {
                if (!space) {
                    i++;
                    space = true;
                }
            }
            else {
                s = setCharAt(s, i, x);
                i++;
                space = false;
            }
            index++;
        }
        s = s.substring(0, i);
        index = pos; // goto_char(p);
        i = size - 1;
        space = false;
        index--;
        while (i >= 0 && index >= 0) {
            var c = text.charAt(index);
            var x = this.TURKISH_UPCASE_ACCENTS_TABLE[c];
            if (!x) {
                if (!space) {
                    i--;
                    space = true;
                }
            }
            else {
                s = setCharAt(s, i, x);
                i--;
                space = false;
            }
            index--;
        }
        return s;
    };
    Deasciifier.prototype.build_skip_list = function (text, options) {
        if (options && options.skipURLs) {
            return DefaultSkipFilter.getSkipRegions(options, text);
        }
        return null;
    };
    Deasciifier.prototype.turkish_correct_last_word = function (text, options) {
        if (text === null) {
            return null;
        }
        var end = text.length;
        var start = 0;
        // TODO: We find the last word by looking at spaces. Periods
        // and line breaks also make new words. Check them too.
        if (text.charAt(end) == ' ') {
            start = text.lastIndexOf(' ', end - 2);
        }
        else {
            start = text.lastIndexOf(' ', end - 1);
        }
        return this.processRange(text, { start: start, end: end }, options);
    };
    Deasciifier.prototype.init = function (patternList) {
        if (!patternList) {
            throw new Error("Pattern list can't be null");
        }
        var patternMap = {};
        for (var key in patternList) {
            patternMap[key] = {};
            var char_patterns = patternList[key].split('|');
            for (var i = 0; i < char_patterns.length; i++) {
                var pattern = char_patterns[i];
                var rank = i + 1;
                if (pattern[0] == '-') {
                    rank = -rank;
                    pattern = pattern.substring(1);
                }
                patternMap[key][pattern] = rank;
            }
        }
        this.turkish_pattern_table = patternMap;
        this.initialized = true;
    };
    Deasciifier.prototype.processRange = function (text, range, options) {
        // TODO: Better performance.
        // We should return an array of toggled character positions,
        // split the text into characters, toggle required characters and join
        // again. This way we get rid of string operations and use less memory.
        if (text === null) {
            return null;
        }
        return this.turkish_correct_region(text, range.start, range.end, this.build_skip_list(text, options));
    };
    Deasciifier.prototype.process = function (text, options) {
        if (text === null) {
            return null;
        }
        return this.processRange(text, { start: 0, end: text.length }, options);
    };
    return Deasciifier;
}());
exports.Deasciifier = Deasciifier;

},{"./common":2,"./turkish":9}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.DomFactoryImpl = exports.DomElementImpl = void 0;
var DomElementImpl = /** @class */ (function () {
    function DomElementImpl(element) {
        this.element = element;
    }
    DomElementImpl.prototype.appendChild = function (child) {
        this.element.appendChild(child.element);
    };
    DomElementImpl.prototype.setClassName = function (name) {
        this.element.className = name;
    };
    DomElementImpl.prototype.setPosition = function (pos) {
        this.element.style.top = pos.top + "px";
        this.element.style.left = pos.left + "px";
    };
    DomElementImpl.prototype.hide = function () {
        this.element.style.display = "none";
    };
    DomElementImpl.prototype.show = function () {
        this.element.style.display = "block";
    };
    DomElementImpl.prototype.setText = function (text) {
        this.element.textContent = text;
    };
    DomElementImpl.prototype.getText = function () {
        return this.element.textContent;
    };
    DomElementImpl.prototype.clear = function () {
        this.element.innerHTML = "";
    };
    DomElementImpl.prototype.setClickHandler = function (handler) {
        this.element.addEventListener("click", handler);
    };
    DomElementImpl.prototype.setTabIndex = function (index) {
        this.element.tabIndex = index;
    };
    return DomElementImpl;
}());
exports.DomElementImpl = DomElementImpl;
var DomFactoryImpl = /** @class */ (function () {
    function DomFactoryImpl() {
    }
    DomFactoryImpl.prototype.createDiv = function () {
        return new DomElementImpl(document.createElement("div"));
    };
    return DomFactoryImpl;
}());
exports.DomFactoryImpl = DomFactoryImpl;

},{}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Keyboard = void 0;
var SPECIAL_KEY_TEXTS = {
    "tab": "tab",
    "backspace": "\u2190",
    "caps": "caps",
    "enter": "enter",
    "shift": "shift",
    "space": ""
};
function createButton(text, value, callback, domFactory) {
    var btn = domFactory.createDiv();
    btn.setText(text);
    btn.setClickHandler(function () {
        callback.onKey(value);
    });
    return btn;
}
function createKeyRow(keys, callback, toggledKeys, domFactory) {
    var row = domFactory.createDiv();
    row.setClassName("mea-keyboard-key-row");
    var displayCaps = toggledKeys["caps"] !== toggledKeys["shift"];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var cell = null;
        var classNames = ["mea-keyboard-key"];
        if (key[0] == "[") {
            // Special key.
            key = key.substring(1, key.length - 1);
            cell = createButton(SPECIAL_KEY_TEXTS[key], key, callback, domFactory);
            classNames.push("mea-keyboard-special-key");
        }
        else {
            // Normal key.
            if (key[0] == '(') {
                // Styled.
                key = key.substring(1, key.length - 1);
                classNames.push("mea-keyboard-key-emphasized");
            }
            if (key.length > 1 && key.indexOf(",") > 0) {
                // Letter key with capital.
                var capsOffKey = key.split(",")[0];
                var capsOnKey = key.split(",")[1];
                if (displayCaps)
                    cell = createButton(capsOnKey, capsOnKey, callback, domFactory);
                else
                    cell = createButton(capsOffKey, capsOffKey, callback, domFactory);
            }
            else {
                // No capital letter (e.g. punctuation).
                cell = createButton(key, key, callback, domFactory);
            }
        }
        if (i == keys.length - 1) {
            classNames.push("mea-keyboard-key-last");
        }
        if (toggledKeys[key]) {
            classNames.push("mea-keyboard-key-active");
        }
        cell.setTabIndex(1);
        cell.setClassName(classNames.join(" "));
        row.appendChild(cell);
    }
    return row;
}
function createDOM(container, keys, callback, toggledKeys, domFactory) {
    container.clear();
    container.setClassName("mea-keyboard-main");
    var layoutContainer = domFactory.createDiv();
    layoutContainer.setClassName("mea-keyboard-layout");
    for (var i = 0; i < keys.length; i++) {
        layoutContainer.appendChild(createKeyRow(keys[i], callback, toggledKeys, domFactory));
    }
    container.appendChild(layoutContainer);
}
var Keyboard = /** @class */ (function () {
    function Keyboard(keyLayout, container, domFactory) {
        this.keyLayout = keyLayout;
        this.container = container;
        this.domFactory = domFactory;
        this.toggledKeys = {
            "caps": false,
            "shift": false
        };
    }
    // KeyboardCallback method:
    Keyboard.prototype.onKey = function (text) {
        switch (text) {
            case "enter":
                this.callback.onKey("\n");
                return;
            case "space":
                this.callback.onKey(" ");
                return;
            case "tab":
                this.callback.onKey("\t");
                return;
            case "caps":
                this.toggleCaps();
                return;
            case "shift":
                this.toggleShift();
                return;
        }
        if (this.toggledKeys["shift"]) {
            this.toggleShift();
        }
        this.callback.onKey(text);
    };
    Keyboard.prototype.create = function (callback) {
        this.callback = callback;
        createDOM(this.container, this.keyLayout, this, this.toggledKeys, this.domFactory);
    };
    Keyboard.prototype.toggleCaps = function () {
        this.toggledKeys["caps"] = !this.toggledKeys["caps"];
        createDOM(this.container, this.keyLayout, this, this.toggledKeys, this.domFactory);
    };
    Keyboard.prototype.toggleShift = function () {
        this.toggledKeys["shift"] = !this.toggledKeys["shift"];
        createDOM(this.container, this.keyLayout, this, this.toggledKeys, this.domFactory);
    };
    Keyboard.prototype.show = function () {
        if (this.container) {
            this.container.show();
        }
    };
    Keyboard.prototype.hide = function () {
        if (this.container) {
            this.container.hide();
        }
    };
    return Keyboard;
}());
exports.Keyboard = Keyboard;

},{}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.KeyboardLayout = void 0;
var TR_c = '_\u00E7';
var TR_C = '_\u00C7';
var TR_g = '_\u011F';
var TR_G = '_\u011E';
var TR_i = '_\u0131';
var TR_I = '_\u0130';
var TR_o = '_\u00F6';
var TR_O = '_\u00D6';
var TR_s = '_\u015F';
var TR_S = '_\u015E';
var TR_u = '_\u00FC';
var TR_U = '_\u00DC';
var CIRC_a = "\u00E2"; /* a circumflex */
var CIRC_e = "\u00EA"; /* e circumflex */
var CIRC_i = "\u00EE"; /* i circumflex */
var CIRC_o = "\u00F4"; /* o circumflex */
var CIRC_u = "\u00FB"; /* u circumflex */
var CIRC_A = "\u00C2"; /* A circumflex */
var CIRC_E = "\u00CA"; /* E circumflex */
var CIRC_I = "\u00CE"; /* I circumflex */
var CIRC_O = "\u00D4"; /* O circumflex */
var CIRC_U = "\u00DB"; /* U circumflex */
// Keyboard layout definition:
// - Each row corresponds to a key row.
// - Keys between [ and ] are special keys with special meanings.
// - Keys between ( and ) have special CSS styles.
// - Keys with "," separator have both lower case and upper case letters.
//   First letter is lower case and the second one is upper case.
exports.KeyboardLayout = {
    TR_Q: [
        [
            "[tab]", "q,Q", "w,W", "e,E", "r,R", "t,T", "y,Y", "u,U", "(ı,I)", "o,O",
            "p,P", "(ğ,Ğ)", "(ü,Ü)", ";", "[backspace]"
        ],
        [
            "[caps]", "a,A", "s,S", "d,D", "f,F", "g,G", "h,H", "j,J", "k,K", "l,L",
            "(ş,Ş)", "(i,İ)", ":", "[enter]"
        ],
        [
            "[shift]", "z,Z", "x,X", "c,C", "v,V", "b,B", "n,N", "m,M",
            "(ö,Ö)", "(ç,Ç)", ",", ".", "[shift]"
        ],
        [CIRC_a, CIRC_e, CIRC_i, "[space]", CIRC_o, CIRC_u]
    ]
    /*
      TR_F: {
        id: "TR_F",
        name: "T\u00FCrk\u00E7e F",
        keys: {
          capsOff: [
            // The keyboard layout. Letters that start with underscore are shown
            // in bold. Keys
            // that are longer than 1 character but do not start with an
            // underscore are special keys
            // and they should have an entry in specialKeys map
            [
              "tab", "f", "g", TR_g, TR_i, "o", "d", "r",
              "n", "h", "p", "q", "w", "x", "backspace"
            ],
            [
              "caps", "u", "_i", "e", "a", TR_u, "t", "k",
              "m", "l", "y", TR_s, ":", "enter"
            ],
            [
              "shift_l", "j", TR_o, "v", "c", TR_c, "z", "s",
              "b", ",", ".", ";", "shift_r"
            ],
            [CIRC_a, CIRC_e, CIRC_i, CIRC_o, CIRC_u, "space"]
          ],
          capsOn: [
            [
              "tab", "F", "G", TR_G, "_I", "O", "D", "R",
              "N", "H", "P", "Q", "W", "X", "backspace"
            ],
            [
              "caps", "U", TR_I, "E", "A", TR_U, "T", "K",
              "M", "L", "Y", TR_S, ":", "enter"
            ],
            [
              "shift_l", "J", TR_O, "V", "C", TR_C, "Z",
              "S", "B", ",", ".", ";", "shift_r"
            ],
            [CIRC_A, CIRC_E, CIRC_I, CIRC_O, CIRC_U, "space"]
          ]
        }
      }*/
};

},{}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.TextHelper = void 0;
var common_1 = require("./common");
var TextHelper = /** @class */ (function () {
    function TextHelper() {
    }
    // Returns true if the character c is a word separator
    TextHelper.isSeparatorChar = function (c) {
        return (c == ' ' || c == '\n' || c == '\r' || c == '.' || c == ',' ||
            c == ';' || c == '?' || c == '!' || c == '(' || c == ')' || c == '<' ||
            c == '>' || c == '[' || c == ']' || c == '{' || c == '}' || c == '/' ||
            c == '\\' || c == '+' || c == '-' || c == '*' || c == '&' || c == '@' ||
            c == ':' || //c == '\'' ||
            c == '"' || c == '|' || c == '~' || c == '#' ||
            c == '%' || c == '^');
    };
    /** Returns true if cursor is inside a word. The following is the truth
     *  table:
     *  Cursor pos    | Return
     * ---------------+-------
     *  test str*ing  | true
     *  test *string  | false
     *  test string*  | false
     *  test* string  | false
     *  *test string  | false
     */
    TextHelper.isCursorInsideWord = function (text, cursorPos) {
        if (cursorPos <= 0 || cursorPos >= text.length) {
            return false;
        }
        // Only true if the character before, the character after are not
        // separators.
        return this.isSeparatorChar(text.charAt(cursorPos - 1)) == false &&
            this.isSeparatorChar(text.charAt(cursorPos)) == false;
    };
    /** Returns the boundaries of the word the cursor is on.
     */
    TextHelper.getWordAtCursor = function (text, index) {
        var separator_after = this.findNextWordSeparatorIndex(text, index);
        var separator_before = 0;
        if (separator_after > 0) {
            separator_before =
                this.findPreviousWordSeparatorIndex(text, separator_after - 1);
        }
        return new common_1.TextRange(separator_before + 1, separator_after);
    };
    /** Returns the boundaries of the word before or at the given index.
     * If the character at index is a separator, moves back until finding a non-
     * separator character.
     */
    TextHelper.getWordBeforeCursor = function (text, index) {
        // Move back until finding a non-separator character:
        if (index > text.length) {
            index = text.length;
        }
        index--;
        while (index >= 0 && this.isSeparatorChar(text.charAt(index))) {
            index--;
        }
        return this.getWordAtCursor(text, index);
    };
    // Returns true if the keycode c is a word separator
    TextHelper.isSeparatorKeycode = function (c) {
        return (c == common_1.KeyCode.SPACE || // space
            c == common_1.KeyCode.ENTER || // enter
            c == common_1.KeyCode.COMMA ||
            c == common_1.KeyCode.PERIOD ||
            c == common_1.KeyCode.FORWARD_SLASH ||
            c == common_1.KeyCode.DASH ||
            c == common_1.KeyCode.SEMICOLON);
        //c == 50 ||      ????
        //c == 56 ||      ???
        //c == 57 ||      ???
        //c == 48);    ????
    };
    TextHelper.isWhiteSpace = function (c) {
        return c == ' ' || c == '\n' || c == '\r' || c == '\t';
    };
    TextHelper.getPreviousWhiteSpaceIndex = function (text, index) {
        for (var i = index; i >= 0; i--) {
            if (this.isWhiteSpace(text.charAt(i))) {
                return i;
            }
        }
        return -1;
    };
    TextHelper.getNextWhiteSpaceIndex = function (text, index) {
        for (var i = index; i < text.length; i++) {
            if (this.isWhiteSpace(text.charAt(i))) {
                return i;
            }
        }
        return -1;
    };
    // Returns the index of the first word separator before the given index.
    // E.g. "a str*ing here" returns the index of the space before "s" (1).
    TextHelper.findPreviousWordSeparatorIndex = function (text, index) {
        for (var i = index; i >= 0; i--) {
            if (this.isSeparatorChar(text.charAt(i))) {
                return i;
            }
        }
        return -1;
    };
    // Returns the index of the next word separator after the given index.
    // E.g. "a str*ing here" returns the index of the space after "g" (8).
    TextHelper.findNextWordSeparatorIndex = function (text, index) {
        for (var i = index; i < text.length; i++) {
            if (this.isSeparatorChar(text.charAt(i))) {
                return i;
            }
        }
        return text.length;
    };
    return TextHelper;
}());
exports.TextHelper = TextHelper;

},{"./common":2}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.TURKISH_ASCIIFY_TABLE = exports.TURKISH_CHAR_ALIST = exports.TurkishChars = void 0;
var TurkishChars = /** @class */ (function () {
    function TurkishChars() {
    }
    TurkishChars.LOWER_C = '\u00E7';
    TurkishChars.UPPER_C = '\u00C7';
    TurkishChars.LOWER_G = '\u011F';
    TurkishChars.UPPER_G = '\u011E';
    TurkishChars.LOWER_I = '\u0131';
    TurkishChars.UPPER_I = '\u0130';
    TurkishChars.LOWER_O = '\u00F6';
    TurkishChars.UPPER_O = '\u00D6';
    TurkishChars.LOWER_S = '\u015F';
    TurkishChars.UPPER_S = '\u015E';
    TurkishChars.LOWER_U = '\u00FC';
    TurkishChars.UPPER_U = '\u00DC';
    return TurkishChars;
}());
exports.TurkishChars = TurkishChars;
exports.TURKISH_CHAR_ALIST = {
    'c': TurkishChars.LOWER_C,
    'C': TurkishChars.UPPER_C,
    'g': TurkishChars.LOWER_G,
    'G': TurkishChars.UPPER_G,
    'i': TurkishChars.LOWER_I,
    'I': TurkishChars.UPPER_I,
    'o': TurkishChars.LOWER_O,
    'O': TurkishChars.UPPER_O,
    's': TurkishChars.LOWER_S,
    'S': TurkishChars.UPPER_S,
    'u': TurkishChars.LOWER_U,
    'U': TurkishChars.UPPER_U
};
function make_turkish_asciify_table() {
    var table = {};
    for (var key in exports.TURKISH_CHAR_ALIST) {
        var value = exports.TURKISH_CHAR_ALIST[key];
        table[value] = key;
    }
    return table;
}
exports.TURKISH_ASCIIFY_TABLE = make_turkish_asciify_table();

},{}]},{},[1])(1)
});