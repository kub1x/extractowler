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
 *                                   ATTACH                                   *
 * ************************************************************************** */

/**
 * Obslouží událost <code>onCommand</code> menulistu sloužící k editaci položky
 * attach.
 *
 * @param menulist  element <code>menulist</code>
 */
selectowl.editor.attach.onCommand = function(menulist) {
    var _gui = this._parent._parent.gui;

    var tree = _gui.get();

    _gui.editColumn(tree.currentIndex, "attach", menulist.value);
}

/**
 * Vrátí XUL element <code>menulist</code> sloužící k editaci položky attach.
 *
 * @return  XUL element <code>menulist</code>
 */
selectowl.editor.attach.get = function() {
    var _root = this._parent._parent;

    return document.getElementById(_root.ATTACH);
}