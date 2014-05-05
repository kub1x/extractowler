/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Info Cram 6000.
 *
 * The Initial Developer of the Original Code is
 * Jiří Mašek.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * ***** END LICENSE BLOCK ***** */

/* ************************************************************************** *
 * ********************************* EDITOR ********************************* *
 * ************************************************************************** */

/* ************************************************************************** *
 *                                    AREA                                    *
 * ************************************************************************** */

/**
 * Obslouží událost <code>onKeyUp</code> editoru selektorů.
 *
 * @param e     událost
 */
infocram.editor.area.onFocus = function(e) {
    var _parent = this._parent;

    var textbox = e.target;

    this.selectionStart = textbox.selectionStart;
    this.selectionEnd = textbox.selectionEnd;

    _parent.update();
}

/**
 * Obslouží událost <code>onKeyUp</code> editoru selektorů.
 *
 * @param e     událost
 */
infocram.editor.area.onClick = function(e) {
    var _parent = this._parent;
    var _gui = this._parent._parent.gui;

    var tree = _gui.get();
    var textbox = e.target;

    _gui.editColumn(tree.currentIndex, "area", textbox.value);

    _parent.update();
}

/**
 * Obslouží událost <code>onKeyUp</code> editoru selektorů.
 *
 * @param e     událost
 */
infocram.editor.area.onKeyUp = function(e) {
    var _parent = this._parent;
    var _gui = this._parent._parent.gui;
    var _tagName = this._parent.widgetTagName;

    var tree = _gui.get();

    var textbox = e.target;

    // nahoru dolu
    if (e.keyCode == 38 || e.keyCode == 40) {
        var listbox = _tagName.get();

        if (e.keyCode == 38) {
            if (listbox.selectedIndex == 0) {
                listbox.selectedIndex = listbox.childNodes.length - 1;
            } else {
                listbox.selectedIndex--;
            }
        } else {
            if (listbox.selectedIndex == listbox.childNodes.length - 1) {
                listbox.selectedIndex = 0;
            } else {
                listbox.selectedIndex++;
            }
        }

        var currNode = this.getSequence();

        var node = listbox.selectedItem.label + currNode.node.substr(currNode.tagName.length);

        var curPos = listbox.selectedItem.label.length;

        this.editSequence(node, curPos, false);

        _parent.update({widgetTagName: true});
    // doleva doprava
    } else if (e.keyCode == 37 || e.keyCode == 39) {
        var prev;
        var curr;

        var start;
        var stop;

        for (start = this.selectionStart - 1 ; start > -1 ; start--) {
            if (isCombinator(textbox.value.charAt(start))) {
                start++;
                break;
            }
        }

        for (stop = this.selectionStart ; stop <= textbox.value.length ; stop++) {
            if (isCombinator(textbox.value.charAt(stop))) {
                break;
            }
        }

        prev = textbox.value.substring(start, stop);

        curr = this.getSequence().node;

        if (prev != curr) {
            _parent.update();
        }

    } else {
        _gui.editColumn(tree.currentIndex, "area", textbox.value);

        _parent.update();
    }

    // save cursor position

    this.selectionStart = textbox.selectionStart;
    this.selectionEnd = textbox.selectionEnd;

    // stopping event propagation
    // http://www.openjs.com/articles/prevent_default_action/
    e.stopPropagation();
    e.preventDefault();

    // refreshing highlight

    _gui.refreshHighlight();
}

/**
 * Vrátí XUL element <code>textbox</code> sloužící k editaci názvu.
 *
 * @return  XUL element <code>textbox</code>
 */
infocram.editor.area.get = function() {
    var _root = this._parent._parent;

    return document.getElementById(_root.AREA);
}

/**
 * Vrátí aktuálně editovanou sekvenci jednoduchých selektorů.
 *
 * @return  objekt {
                start: pozice určující start sekvence,
                end: pozice určující konec sekvence,
                prefix: část předcházející editované sekvenci,
                suffix: část následující za editovanou sekvencí,
                node: sekvence jednoduchých selektorů,
                tagName: selektory typu
            }
 */
infocram.editor.area.getSequence = function() {
    var _root = this._parent._parent;

    var textbox = this.get();

    // zavorky

    var braces = new Array(textbox.value.length);

    var flag = 0;

    for (var i = 0; i < braces.length; i++) {
        if (textbox.value.charAt(i) == ")") {
            flag--;
        }

        braces[i] = flag > 0 ? true : false;

        if (textbox.value.charAt(i) == "(") {
            flag++;
        }
    }

    // začátek editované sekvence

    var start;

    for(start = textbox.selectionStart - 1 ; start > -1 ; start--) {
        if (!braces[start] && isCombinator(textbox.value.charAt(start))) {
            break;
        }
    }

    start++;

    // konec editované sekvence

    var end;

    for(end = start ; end <= textbox.value.length ; end++) {
        if (!braces[end] && isCombinator(textbox.value.charAt(end))) {
            break;
        }
    }

    // konec selektoru typu

    var node = textbox.value.substring(start, end);

    var tagNameRegExp = /^[A-Za-z\*][A-Za-z0-9]*/g;

    var matches = node.match(tagNameRegExp);

    var tagName = matches ? matches[0] : "";

    return {
        start: start,
        end: end,
        prefix: textbox.value.substring(0, start),
        suffix: textbox.value.substr(end),
        node: node,
        tagName: tagName
    }
}

/**
 * Nahradí editovanou sekvenci jednoduchých selektorů zadanou hodnotou.
 *
 * @param sequence  nová sekvence
 * @param curPos    pozice, na níž bude umístěn kurzor počítáno od začátku sekvence
 * @param update    <code>true</code>, máli se editor aktualizovat
 * @return
 */
infocram.editor.area.editSequence = function(sequence, curPos, update) {
    var _gui = this._parent._parent.gui;

    var tree = _gui.get();
    var currNode = this.getSequence();
    var textbox = this.get();

    textbox.value = currNode.prefix + sequence + currNode.suffix;

    textbox.selectionStart = currNode.prefix.length + curPos;
    textbox.selectionEnd = currNode.prefix.length + curPos;

    if (update == undefined || update) {
        textbox.focus();
    }

    _gui.editColumn(tree.currentIndex, "area", textbox.value);
}

/**
 * Vyjme aktuálně editovanou sekvenci jednoduchých selektorů.
 */
infocram.editor.area.removeSequence = function() {
    var _gui = this._parent._parent.gui;

    var tree = _gui.get();
    var currNode = this.getSequence();
    var textbox = this.get();

    currNode.prefix = trim(currNode.prefix);
    currNode.suffix = trim(currNode.suffix);

    textbox.value = trim(currNode.prefix + " " + currNode.suffix);

    textbox.selectionStart = currNode.prefix.length;
    textbox.selectionEnd = currNode.prefix.length;

    textbox.focus();

    _gui.editColumn(tree.currentIndex, "area", textbox.value);

    // refreshing highlight

    _gui.refreshHighlight();
}