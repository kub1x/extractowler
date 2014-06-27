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
 *                                 CONTAINS                                   *
 * ************************************************************************** */

/**
 * Obslouží událost <code>onClick</code> widgetu.
 *
 * @param label
 */
selectowl.editor.widgetContent.onClick = function(label) {
    var _gui = this._parent._parent.gui;
    var _area = this._parent.area;

    var content = label.value;
    var currNode = _area.getSequence();

    var index;

    var stPart;
    var ndPart;

    var node;
    var curPos;

    if (this.contains(currNode.node, content)) {
        index = this.indexOfContent(currNode.node, content);

        var matches = currNode.node.match(new RegExp(":contains\\([\'\"]?" + content + "[\'\"]?\\)", "g"));

        stPart = currNode.node.substring(0, index);
        ndPart = currNode.node.substr(index + matches[0].length);

        node = stPart + ndPart;

        curPos = stPart.length;
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

        node = stPart + ":contains(" + content + ")" + ndPart;

        curPos = stPart.length + 11 + content.length;
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
selectowl.editor.widgetContent.get = function() {
    var _root = this._parent._parent;

    return document.getElementById(_root.CONTENT);
}

/**
 * Aktualizuje widget.
 */
selectowl.editor.widgetContent.update = function() {
    var _gui = this._parent._parent.gui;
    var _area = this._parent.area;

    // removing previous content

    var groupbox = this.get();

    var vbox = groupbox.childNodes[1];

    while (vbox.childNodes.length > 0) {
        vbox.removeChild(vbox.childNodes[vbox.childNodes.length - 1]);
    }

    // hledani obsahu

    var currentDocument = aardvarkUtils.currentDocument();

    var context = _gui.getContext();
    var currNode = _area.getSequence();

    var selector = context;

    var node = currNode.node.replace(/:not\(.*\)/g, "").replace(/\[[^\[\]]*!=[^\[\]]*\]/, "");

    selector += " ";
    selector += currNode.prefix;
    selector += node != "" ? node : "*";

    selector = trim(selector);

    // finding suggested attributes

    var selected = Sizzle(selector != "*" ? selector : "body *", currentDocument);

    var content = new Collection();

    for (var i = 0 ; i < selected.length ; i++) {

        if (selected[i].tagName.toLowerCase() != "script" && selected[i].tagName.toLowerCase() != "style"
            && selected[i].childNodes.length == 1 && selected[i].textContent.length < 35) {

            content.add(selected[i].textContent, true);
        }
    }

    var matches = currNode.node.match(/:contains\([^)]*\)/g);

    if (matches) {
        for (i = 0; i < matches.length; i++) {
            content.add(matches[i].match(/:contains\(([^)]*)\)/)[1], true);
        }
    }

    content.remove("");

    // removing previous content

    while (vbox.childNodes.length > 0) {
        vbox.removeChild(vbox.childNodes[vbox.childNodes.length - 1]);
    }

    // putting classes into groupbox

    var contentArray = content.getKeys();

    var hbox;

    for (i = 0; i < contentArray.length; i++) {
        if (hbox == null || hbox.childNodes.length == 5) {
            hbox = createElement("hbox");
            vbox.appendChild(hbox);
        }

        var label = createElement("label", "crop=end,flex=1");

        label.setAttribute("value", trim(contentArray[i]));

        if (this.contains(currNode.node, contentArray[i])) {
            label.className = "lblAllow";
        }

        label.setAttribute("onclick", "selectowl.editor.widgetContent.onClick(this);");

        hbox.appendChild(label);
    }
}

/**
 * Vrátí index určující počáteční pozici pseudo třídy <code>:contains()</code>
 * v selektoru. Pokud selektor pseudo-třídu neobsahuje, vrátí hodnotu -1.
 *
 * @param node      selektor
 * @param content   argument pseudo-třídy
 * @return          index
 */
selectowl.editor.widgetContent.indexOfContent = function(node, content) {
    return node.search(new RegExp(":contains\\([\'\"]?" + content + "[\'\"]?\\)", "g"));
}

/**
 * Ověří, zdali selektor obsahuje pseudo-třídu <code>:contains()</code>.
 *
 * @param node      selektor
 * @param content   argument pseudo-třídy
 * @return          <code>true</code> obsahuje-li, <code>false</code> neobsahuje-li
 */
selectowl.editor.widgetContent.contains = function(node, content) {
    return this.indexOfContent(node, content) != -1;
}