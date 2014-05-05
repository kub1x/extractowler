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
 *                                    ID                                      *
 * ************************************************************************** */

/**
 * Obslouží událost <code>onCommand</code> widgetu.
 */
infocram.editor.widgetId.onCommand = function() {
    var _gui = this._parent._parent.gui;

    this.update();

    // refreshing highlight

    _gui.refreshHighlight();
}

/**
 * Obslouží událost <code>onClick</code> widgetu.
 *
 * @param label
 */
infocram.editor.widgetId.onClick = function(label) {
    var _root = this._parent._parent;
    var _gui = this._parent._parent.gui;
    var _area = this._parent.area;

    var currNode = _area.getSequence();

    var id = label.value;

    var index;

    var stPart;
    var ndPart;

    var matches;

    var node;
    var curPos;

    var notRegExp;
    var attrRegExp;

    var length;

    var groupbox = document.getElementById(_root.IDTYPE);

    if (this.hasId(currNode.node, id)) {
        index = this.indexOfId(currNode.node, id);

        if (this.isIdHard(currNode.node, id)) {
            length = id.length + 1;
        } else {
            matches = currNode.node.match(new RegExp("\\[id=[\"\']?" + id + "[\"\']?\\]"));

            length = matches[matches.length - 1].length;
        }

        node = currNode.node.substring(0, index) + currNode.node.substr(index + length);

        // zakazani tridy

        if (groupbox.selectedItem.value == "hard") {
            matches = node.match(/:not\(.*\)/g);

            if (matches) {
                index = node.search(/:not\(.*\)/g);

                stPart = node.substring(0, index + matches[0].length - 1);
                ndPart = node.substr(index + matches[0].length - 1);

                node = stPart + ",#" + id + ndPart;

                curPos = stPart.length + 2 + id.length;
            } else {
                node += ":not(#" + id + ")";

                curPos = node.length;
            }
        } else {
            index = node.search(/\[[^\[\]]*\]/);

            if (index == -1) {
                index = node.search(/:not\(.*\)/g);
            }

            if (index == -1) {
                if (node.search(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g) != -1 || node.search(/#[A-Za-z][-A-Za-z0-9_]+/g) != -1) {
                    index = node.length;
                } else {
                    index = currNode.tagName.length;
                }
            }

            stPart = node.substring(0, index);
            ndPart = node.substr(index);

            node = stPart + "[id!=" + id + "]" + ndPart;

            curPos = stPart.length + 6 + id.length;
        }
    } else if (this.banId(currNode.node, id)) {
        if (this.isIdHard(currNode.node, id)) {
            notRegExp = new RegExp(":not\\(\\#" + id + "\\)",  "g");

            index = currNode.node.search(notRegExp);

            // vymazani tridy

            if (index != -1) {
                matches = currNode.node.match(notRegExp);

                stPart = currNode.node.substring(0, index);
                ndPart = currNode.node.substr(index + matches[0].length);

                node = stPart + ndPart;

                curPos = stPart.length;
            } else {
                index = currNode.node.search(new RegExp("#" + id + "[^-A-Za-z0-9_]|" + "#" + id + "$", "g"));

                stPart = currNode.node.substring(0, index);
                ndPart = currNode.node.substr(index + 1 + id.length);

                node = stPart + ndPart;

                node = node.replace(/ *, *, */g, ",");
                node = node.replace(/ *, *\)/g, ")");
                node = node.replace(/\( *, */g, "(");

                curPos = node.length;
            }
        } else {
            var objRegExp = new RegExp("\\[id!=[\"\']?" + id + "[\"\']?\\]");

            index = currNode.node.search(objRegExp);

            matches = currNode.node.match(objRegExp);

            stPart = currNode.node.substring(0, index);
            ndPart = currNode.node.substr(index + matches[0].length);

            node = stPart + ndPart;

            curPos = stPart.length;
        }
    } else {
        node = currNode.node;

        // nahrazeni obsahu selektoru :not() mezerami

        matches = currNode.node.match(/:not\(.*\)/g);

        if (matches) {
            var spaces = "";

            for (var i = 0; i < matches[0].length - 6; i++) {
                spaces += " ";
            }

            spaces = ":not(" + spaces + ")";

            node = node.replace(notRegExp, spaces);
        }

        // vlozeni selektoru

        if (groupbox.selectedItem.value == "hard") {
            index = node.search(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g);

            if (index == -1) {
                index = node.search(/\[[^\[\]]*\]/);
            }

            if (index == -1) {
                index = node.search(/:not\(.*\)/g);
            }

            if (index == -1) {
                if (node.search(/#[A-Za-z][-A-Za-z0-9_]+/g) != -1) {
                    index = node.length;
                } else {
                    index = currNode.tagName.length;
                }
            }

            stPart = currNode.node.substring(0, index);
            ndPart = currNode.node.substr(index);

            node = stPart + "#" + id + ndPart;

            curPos = stPart.length + 1 + id.length;
        } else {
            index = node.search(/\[[^\[\]]*\]/);

            if (index == -1) {
                index = node.search(/:not\(.*\)/g);
            }

            if (index == -1) {
                if (node.search(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g) != -1 || node.search(/#[A-Za-z][-A-Za-z0-9_]+/g) != -1) {
                    index = node.length;
                } else {
                    index = currNode.tagName.length;
                }
            }

            stPart = currNode.node.substring(0, index);
            ndPart = currNode.node.substr(index);

            node = stPart + "[id=" + id + "]" + ndPart;

            curPos = stPart.length + 5 + id.length;
        }
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
infocram.editor.widgetId.get = function() {
    var _root = this._parent._parent;

    return document.getElementById(_root.ID);
}

/**
 * Aktualizuje widget.
 */
infocram.editor.widgetId.update = function() {
    var _gui = this._parent._parent.gui;
    var _id = this._parent.widgetId;
    var _area = this._parent.area;

    // removing previous content

    var idGroupbox = _id.get();
    var vbox = idGroupbox.childNodes[2];

    while (vbox.childNodes.length > 0) {
        vbox.removeChild(vbox.childNodes[vbox.childNodes.length - 1]);
    }

    // vyhledani editoru

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

    var ids = new Collection();

    for (var i = 0 ; i < selected.length ; i++) {
        if (selected[i].id != "") {
            ids.add(selected[i].id, true);
        }
    }

    var matches = currNode.node.match(/\[id[!]?=[\"\']?[A-Za-z][-A-Za-z0-9_^\]]+[\"\']?\]/g);

    if (matches) {
        for (i = 0; i < matches.length; i++) {
            ids.add(matches[i].match(/\[id[!]?=[\"\']?([A-Za-z][-A-Za-z0-9_^\]]+)[\"\']?\]/)[1], true);
        }
    }

    matches = currNode.node.match(/#[A-Za-z][-A-Za-z0-9_]+/g);

    if (matches) {
        for (i = 0; i < matches.length; i++) {
            ids.add(matches[i].substr(1), true);
        }
    }

    // putting classes into groupbox

    var idArray = ids.getKeys();

    var hbox;

    for (i = 0; i < idArray.length; i++) {
        if (hbox == null || hbox.childNodes.length == 5) {
            hbox = createElement("hbox");
            vbox.appendChild(hbox);
        }

        var label = createElement("label", "crop=end,flex=1");

        label.setAttribute("value", idArray[i]);

        if (this.banId(currNode.node, idArray[i])) {
            label.className = "lblDeny";
        } else if (this.hasId(currNode.node, idArray[i])) {
            label.className = "lblAllow";
        }


        label.setAttribute("onclick", "infocram.editor.widgetId.onClick(this);");

        hbox.appendChild(label);
    }
}

/**
 * Vrátí index určující počáteční pozici selektoru daného identifikátoru
 * v selektoru. Pokud selektor selektor identifikátoru neobsahuje, vrátí
 * hodnotu -1.
 *
 * @param node      selektor
 * @param id        identifikátor
 * @return          index
 */
infocram.editor.widgetId.indexOfId = function(node, id) {
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

    var index = node.search(new RegExp("#" + id + "[^-A-Za-z0-9_]|" + "#" + id + "$", "g"));

    if (index == -1) {
        index = node.search(new RegExp("\\[id=[\"\']?" + id + "[\"\']?\\]", "g"));
    }

    return index;
}

/**
 * Ověří, zdali selektor obsahuje selektor daného identifikátoru.
 *
 * @param node      selektor
 * @param id        identifikátor
 * @return          <code>true</code> obsahuje-li, <code>false</code> neobsahuje-li
 */
infocram.editor.widgetId.hasId = function(node, id) {
    return this.indexOfId(node, id) != -1;
}

/**
 * Vrátí index určující počáteční pozici pseudo třídy <code>:not()</code>
 * v selektoru, jejímž argumentem je selektor daného identifikátoru. Pokud
 * selektor pseudo-třídu neobsahuje, vrátí hodnotu -1.
 *
 * @param node      selektor
 * @param id        identifikátor
 * @return          index
 */
infocram.editor.widgetId.indexOfBan = function(node, id) {
    var index = node.search(new RegExp("\\:not\\(.*#" + id + "[^-A-Za-z0-9_].*\\)|\\:not\\(.*#" + id + "\\)", "g"));

    if (index == -1) {
        index = node.search(new RegExp("\\[id!=[\"\']?" + id + "[\"\']?\\]", "g"));
    }

    return index;
}

/**
 * Ověří, zdali selektor obsahuje obsahuje pseudo-třídu <code>:not()</code>,
 * jejímž argumentem je selektor daného identifikátoru.
 *
 * @param node      selektor
 * @param id        identifikátor
 * @return          <code>true</code> obsahuje-li, <code>false</code> neobsahuje-li
 */
infocram.editor.widgetId.banId = function(node, id) {
    return this.indexOfBan(node, id) != -1;
}

/**
 * Ověří, zdali selektor obsahuje obsahuje hard ID selektor.
 *
 * @param node      selektor
 * @param id        identifikátor
 * @return          <code>true</code> obsahuje-li, <code>false</code> neobsahuje-li
 */
infocram.editor.widgetId.isIdHard = function(node, id) {
    return node.search(new RegExp("#" + id + "[^-A-Za-z0-9_]|" + "#" + id + "$", "g")) != -1;
}