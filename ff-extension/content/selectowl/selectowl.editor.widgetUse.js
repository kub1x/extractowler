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
 *                                    USE                                     *
 * ************************************************************************** */

/**
 * Obslouží událost <code>onCommand</code> menulistu sloužící k editaci use
 * attach.
 *
 * @param menulist  element <code>menulist</code>
 */
infocram.editor.widgetUse.onCommand = function(menulist) {
    var _gui = this._parent._parent.gui;

    var tree = _gui.get();

    _gui.editColumn(tree.currentIndex, "use", menulist.value);
}

/**
 * Vrátí XUL element <code>menulist</code> sloužící k editaci položky use.
 *
 * @return  XUL element <code>menulist</code>
 */
infocram.editor.widgetUse.get = function() {
    var _root = this._parent._parent;

    return document.getElementById(_root.USE);
}

/**
 * Aktualizuje widget.
 */
infocram.editor.widgetUse.update = function() {
    var _tree = this._parent._parent.tree;

    var menulist = this.get();

    while (menulist.childNodes[0].childNodes.length > 0) {
        menulist.childNodes[0].removeChild(menulist.childNodes[0].childNodes[0]);
    }

    var menuitem = createElement("menuitem");

    menuitem.setAttribute("value", "");
    menuitem.setAttribute("label", "");

    menulist.childNodes[0].appendChild(menuitem);

    for (var child in _tree.def) {
        menuitem = createElement("menuitem", "value=" + child + ",label=" + child);

        menulist.childNodes[0].appendChild(menuitem);
    }
}