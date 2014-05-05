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
 *                                  CLASSES                                   *
 * ************************************************************************** */

/**
 * Obslouží událost <code>onClick</code> widgetu.
 *
 * @param label
 */
infocram.editor.widgetClass.onClick = function(label) {
    var _gui = this._parent._parent.gui;
    var _area = this._parent.area;

    var currNode = _area.getSequence();

    var cl = label.value;

    var index;

    var stPart;
    var ndPart;

    var node;
    var curPos;

    var notRegExp;
    var attrRegExp;

    var matches;

    if (this.hasClass(currNode.node, cl)) {
        index = this.indexOfClass(currNode.node, cl);

        node = currNode.node.substring(0, index) + currNode.node.substr(index + cl.length + 1);

        // zakazani tridy

        notRegExp = /:not\(.*\)/g;

        matches = node.match(notRegExp);

        if (matches == null) {
            node += ":not(." + cl + ")";

            curPos = node.length;
        } else {
            index = node.search(notRegExp);

            stPart = node.substring(0, index + matches[0].length - 1);
            ndPart = node.substr(index + matches[0].length - 1);

            node = stPart + ",." + cl + ndPart;

            curPos = stPart.length + 2 + cl.length;
        }
    } else if (this.banClass(currNode.node, cl)) {

        notRegExp = new RegExp(":not\\(\\." + cl + "\\)",  "g");

        index = currNode.node.search(notRegExp);

        // vymazani tridy

        if (index != -1) {

            matches = currNode.node.match(notRegExp);

            stPart = currNode.node.substring(0, index);
            ndPart = currNode.node.substr(index + matches[0].length);

            node = stPart + ndPart;

            curPos = stPart.length;
        } else {
            index = currNode.node.search(new RegExp("\\." + cl + "[^_a-zA-Z0-9-]|" + "\\." + cl + "$", "g"));

            stPart = currNode.node.substring(0, index);
            ndPart = currNode.node.substr(index + 1 + cl.length);

            node = stPart + ndPart;

            node = node.replace(/ *, *, */g, ",");
            node = node.replace(/ *, *\)/g, ")");
            node = node.replace(/\( *, */g, "(");

            curPos = node.length;
        }
    } else {

        node = currNode.node;

        // nahrazeni selektoru :not() teckami

        notRegExp = /:not\(.*\)/g;

        matches = currNode.node.match(notRegExp);

        if (matches) {
            var spaces = "";

            for (var i = 0; i < matches[0].length - 6; i++) {
                spaces += " ";
            }

            spaces = ":not(" + spaces + ")";

            node = node.replace(notRegExp, spaces);
        }

        attrRegExp = /\[[^\[\]]*\]/;

        index = node.search(attrRegExp);

        if (index == -1) {
            index = node.search(notRegExp);
        }

        if (index == -1) {
            if (node.search(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g) != -1 || node.search(/#[A-Za-z][-A-Za-z0-9_]+/g) != -1) {
                index = node.length;
            } else {
                index = currNode.tagName.length;
            }
        }

        //var classRegExp = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;
        //var idRegExp = /#[A-Za-z][-A-Za-z0-9_]+/g;

        stPart = currNode.node.substring(0, index);
        ndPart = currNode.node.substr(index);

        node = stPart + "." + cl + ndPart;

        curPos = stPart.length + 1 + cl.length;
    }

    _area.editSequence(node, curPos);

    // refreshing highlight

    _gui.refreshHighlight();
}

/**
 * Vrátí XUL element <code>groupbox</code> widgetu.
 *
 * @return  XUL element <code>groupbox</code>
 */
infocram.editor.widgetClass.get = function() {
    var _root = this._parent._parent;

    return document.getElementById(_root.CLASS);
}

/**
 * Aktualizuje widget.
 */
infocram.editor.widgetClass.update = function() {
    var _gui = this._parent._parent.gui;
    var _class = this._parent.widgetClass;
    var _area = this._parent.area;
    var _root = this._parent._parent;

    // removing previous content

    var clGroupbox = _class.get();
    var vbox = clGroupbox.childNodes[1];

    while (vbox.childNodes.length > 0) {
        vbox.removeChild(vbox.childNodes[vbox.childNodes.length - 1]);
    }

    // hledani trid

    var currentDocument = aardvarkUtils.currentDocument();

    var context = _gui.getContext();
    var currNode = _area.getSequence();

    var selector = context;

    selector += " ";
    selector += currNode.prefix;
    selector += currNode.node != "" ? currNode.node : "*";

    selector = trim(selector);

    // finding suggested classes

    var selected = Sizzle(selector != "*" ? selector : "body *", currentDocument);

    var classes = new Collection();

    for (var i = 0 ; i < selected.length ; i++) {
        if (selected[i].className != "") {
            var cl = selected[i].className.split(" ");

            for (var j = 0 ; j < cl.length ; j++) {
                classes.add(cl[j], true);
            }
        }
    }

    var matches = currNode.node.match(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g);

    if (matches) {
        for (i = 0; i < matches.length; i++) {
            classes.add(matches[i].substr(1), true);
        }
    }

    classes.remove("");
    classes.remove("infocram-selection");

    // removing previous content

    while (vbox.childNodes.length > 0) {
        vbox.removeChild(vbox.childNodes[vbox.childNodes.length - 1]);
    }

    // putting classes into groupbox

    var clArray = classes.getKeys();

    var hbox;

    for (i = 0; i < clArray.length; i++) {
        if (hbox == undefined || hbox.childNodes.length == 5) {
            hbox = createElement("hbox");
            vbox.appendChild(hbox);
        }

        var label = createElement("label", "crop=end,flex=1");

        label.setAttribute("value", clArray[i]);

        if (this.banClass(currNode.node, clArray[i])) {
            label.className = "lblDeny";
        } else if (this.hasClass(currNode.node, clArray[i])) {
            label.className = "lblAllow";
        }

        label.setAttribute("onclick", "infocram.editor.widgetClass.onClick(this);");

        hbox.appendChild(label);
    }
}

/**
 * Vrátí index určující počáteční pozici selektoru dané třídy v selektoru. Pokud
 * selektor selektor třídy neobsahuje, vrátí hodnotu -1.
 *
 * @param node      selektor
 * @param cl        název třídy
 * @return          index
 */
infocram.editor.widgetClass.indexOfClass = function(node, cl) {
    var notRegExp = /:not\(.*\)/g;

    var matches = node.match(notRegExp);

    if (matches) {
        var spaces = "";

        for (var i = 0; i < matches[0].length - 6; i++) {
            spaces += " ";
        }

        spaces = ":not(" + spaces + ")";

        node = node.replace(notRegExp, spaces);
    }

    return node.search(new RegExp("\\." + cl + "[^_a-zA-Z0-9-]|" + "\\." + cl + "$", "g"));
}

/**
 * Ověří, zdali selektor obsahuje selektor dané třídy.
 *
 * @param node      selektor
 * @param cl        název třídy
 * @return          <code>true</code> obsahuje-li, <code>false</code> neobsahuje-li
 */
infocram.editor.widgetClass.hasClass = function(node, cl) {
    return this.indexOfClass(node, cl) != -1;
}

/**
 * Vrátí index určující počáteční pozici pseudo třídy <code>:not()</code>
 * v selektoru, jejímž argumentem je selektor dané třídy. Pokud selektor
 * pseudo-třídu neobsahuje, vrátí hodnotu -1.
 *
 * @param node      selektor
 * @param cl        název třídy
 * @return          index
 */
infocram.editor.widgetClass.indexOfBan = function(node, cl) {
    return node.search(new RegExp("\\:not\\(.*\\." + cl + "[^_a-zA-Z0-9-].*\\)|\\:not\\(.*\\." + cl + "\\)", "g"));
}

/**
 * Ověří, zdali selektor obsahuje obsahuje pseudo-třídu <code>:not()</code>,
 * jejímž argumentem je selektor dané třídy.
 *
 * @param node      selektor
 * @param cl        název třídy
 * @return          <code>true</code> obsahuje-li, <code>false</code> neobsahuje-li
 */
infocram.editor.widgetClass.banClass = function(node, cl) {
    return this.indexOfBan(node, cl) != -1;
}