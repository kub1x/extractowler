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
 *                                AUTOCOMPELE                                 *
 * ************************************************************************** */

/**
 * Obslouží událost <code>onClick</code> listboxu s nabídkou selektorů typu.
 *
 * @param listbox   listbox
 */
selectowl.editor.widgetTagName.onClick = function(listbox) {
    var _parent = this._parent;
    var _gui = this._parent._parent.gui;
    var _area = this._parent.area;

    var currNode = _area.getSequence();

    var node = listbox.selectedItem.label + currNode.node.substr(currNode.tagName.length);

    var curPos = listbox.selectedItem.label.length;

    _area.editSequence(node, curPos, false);

    _parent.update({widgetTagName: true});

    // refreshing highlight

    _gui.refreshHighlight();
}

/**
 * Obslouží událost <code>onKeyUp</code> listboxu s nabídkou selektorů typu.
 *
 * @param listbox   listbox
 */
selectowl.editor.widgetTagName.onKeyUp = function(listbox) {
    this.onClick(listbox);
}

/**
 * Vrátí XUL element <code>listbox</code> s  selektorů typu.
 *
 * @return  XUL element <code>listbox</code>
 */
selectowl.editor.widgetTagName.get = function() {
    var _root = this._parent._parent;

    return document.getElementById(_root.TAGNAME);
}

/**
 * Aktualizuje widget.
 */
selectowl.editor.widgetTagName.update = function() {
    var _gui = this._parent._parent.gui;
    var _area = this._parent.area;

    var currentDocument = aardvarkUtils.currentDocument();

    var context = _gui.getContext();
    var currNode = _area.getSequence();

    // finding suggested tag names

    var area;

    if (context == "" && currNode.prefix == "") {
        area = "body *";
    } else {
      //TODO XXX creates badly-defined selector! fix
        area = context + " " + currNode.prefix + "*";
    }

    var suggested = Sizzle(area, currentDocument);

    var tagNames = new Collection();

    tagNames.add(currNode.tagName.toLowerCase(), true);

    tagNames.add("", true);
    tagNames.add("*", true);

    for (var i = 0 ; i < suggested.length ; i++) {
        tagNames.add(suggested[i].tagName.toLowerCase(), true);
    }

    // removing previous content

    var listbox = this.get();

    while (listbox.childNodes.length) {
        listbox.removeChild(listbox.childNodes[0]);
    }

    // putting tag names into listbox

    var keys = tagNames.getKeys();

    for (i = 0 ; i < keys.length ; i++) {
        var listitem = createElement("listitem", "label=" + keys[i]);

        listbox.appendChild(listitem);
    }

    listbox.selectedIndex = 0;
}
