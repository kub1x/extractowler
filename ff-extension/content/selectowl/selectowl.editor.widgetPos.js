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
 *                                 POSITION                                   *
 * ************************************************************************** */

/**
 * Obslouží událost <code>onCommand</code> ...
 *
 * @param checkbox   checkbox
 */
selectowl.editor.widgetPos.onCommand = function(checkbox) {
    var _area = this._parent.area;
    var _gui = this._parent._parent.gui;

    var currNode = _area.getSequence();

    var index;
    var stPart;
    var ndPart;
    var node;
    var curPos;

    var pos = checkbox.label;

    if (checkbox.checked) {
        if (currNode.node.search(/:[_a-zA-Z]+/) != -1
            || currNode.node.search(/\[[^\[\]]*\]/) != -1
            || currNode.node.search(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g) != -1
            || currNode.node.search(/#[A-Za-z][-A-Za-z0-9_]+/g) != -1) {

            index = currNode.node.length;
        } else {
            index = currNode.tagName.length;
        }

        stPart = currNode.node.substring(0, index);
        ndPart = currNode.node.substr(index);

        switch (pos) {
            case ":gt":
            case ":lt":
            case ":eq":
                var textbox = document.getElementById("selectowl-" + pos.substr(1) + "val");

                pos = pos + "(" + textbox.value + ")";
                break;
        }

        node = stPart + pos + ndPart;

        curPos = stPart.length + pos.length;
    } else {
        var length;
        var objRegExp;

        switch (pos) {
            case ":gt":
            case ":lt":
            case ":eq":
                objRegExp = new RegExp(pos + "\\([^\\)]*\\)");

                index = currNode.node.search(objRegExp);

                var matches = currNode.node.match(objRegExp);

                length = matches[matches.length - 1].length;
                break;
            default:
                objRegExp = new RegExp(pos + "[^-A-Za-z0-9_]|" + pos + "$");

                index = currNode.node.search(objRegExp);

                length = pos.length;
                break;
        }

        stPart = currNode.node.substring(0, index);
        ndPart = currNode.node.substr(index + length);

        node = stPart + ndPart;

        curPos = stPart.length;
    }

    _area.editSequence(node, curPos);

    // refreshing highlight

    _gui.refreshHighlight();
}

/**
 * Obslouží událost <code>onClick</code> widgetu.
 *
 * @param event     událost
 * @param possel    position selector
 */
selectowl.editor.widgetPos.onKeyUp = function(event, possel) {
    var _gui = this._parent._parent.gui;
    var _area = this._parent.area;

    var textbox = event.target;
    var checkbox = document.getElementById("selectowl-" + possel);

    var currNode = _area.getSequence();

    var index;

    var curPos;
    var stPart;
    var ndPart;

    if (checkbox.checked) {
        var objRegExp = new RegExp(":" + possel + "\\([^\\)]*\\)");

        index = currNode.node.search(objRegExp);

        var matches = currNode.node.match(objRegExp);

        stPart = currNode.node.substring(0, index + 2 + possel.length);
        ndPart = currNode.node.substr(index + matches[0].length - 1);

        var node = stPart + textbox.value + ndPart;

        curPos = node.length;
    } else {
        if (currNode.node.search(/:[_a-zA-Z]+/) != -1
            || currNode.node.search(/\[[^\[\]]*\]/) != -1
            || currNode.node.search(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g) != -1
            || currNode.node.search(/#[A-Za-z][-A-Za-z0-9_]+/g) != -1) {

            index = currNode.node.length;
        } else {
            index = currNode.tagName.length;
        }

        stPart = currNode.node.substring(0, index);
        ndPart = currNode.node.substr(index);

        possel = ":" + possel + "(" + textbox.value + ")";

        node = stPart + possel + ndPart;

        curPos = stPart.length + possel.length;

        checkbox.checked = true;
    }

    event.stopPropagation();
    event.preventDefault();

    _area.editSequence(node, curPos, false);

    // refreshing highlight

    _gui.refreshHighlight();
}

/**
 * Vrátí XUL element <code>groupbox</code> widgetu.
 *
 * @return  XUL element <code>groupbox</code>
 */
selectowl.editor.widgetPos.get = function() {
    var _root = this._parent._parent;

    return document.getElementById(_root.POS);
}

/**
 * Aktualizuje widget.
 */
selectowl.editor.widgetPos.update = function() {
    var _area = this._parent.area;

    var currNode = _area.getSequence();

    var checkbox;
    var index
    var textbox;
    var matches;

    // first

    checkbox = document.getElementById("selectowl-first");

    index = currNode.node.search(/:first[^-A-Za-z0-9_]|:first$/g);

    checkbox.checked = index != -1;

    // last

    checkbox = document.getElementById("selectowl-last");

    index = currNode.node.search(/:last[^-A-Za-z0-9_]|:last$/g);

    checkbox.checked = index != -1;

    // even

    checkbox = document.getElementById("selectowl-even");

    index = currNode.node.search(/:even[^-A-Za-z0-9_]|:even$/g);

    checkbox.checked = index != -1;

    // odd

    checkbox = document.getElementById("selectowl-odd");

    index = currNode.node.search(/:odd[^-A-Za-z0-9_]|:odd/g);

    checkbox.checked = index != -1;

    // gt

    checkbox = document.getElementById("selectowl-gt");

    index = currNode.node.search(/:gt\((.*)\)/g);

    checkbox.checked = index != -1;

    if (index != -1) {
        textbox = document.getElementById("selectowl-gtval");

        matches = currNode.node.match(/:gt\(([^\)]*)\)/);

        textbox.value = matches[matches.length - 1];
    }

    // lt

    checkbox = document.getElementById("selectowl-lt");

    index = currNode.node.search(/:lt\((.*)\)/g);

    checkbox.checked = index != -1;

    if (index != -1) {
        textbox = document.getElementById("selectowl-ltval");

        matches = currNode.node.match(/:lt\(([^\)]*)\)/);

        textbox.value = matches[matches.length - 1];
    }

    // eq

    checkbox = document.getElementById("selectowl-eq");

    index = currNode.node.search(/:eq\((.*)\)/g);

    checkbox.checked = index != -1;

    if (index != -1) {
        textbox = document.getElementById("selectowl-eqval");

        matches = currNode.node.match(/:eq\(([^\)]*)\)/);

        textbox.value = matches[matches.length - 1];
    }
}