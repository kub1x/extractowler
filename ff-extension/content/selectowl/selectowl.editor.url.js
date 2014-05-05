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
 *                                    URL                                     *
 * ************************************************************************** */

/**
 * Obslouží událost <code>onClick</code> tlačítka "Use Current Page".
 */
selectowl.editor.url.onClick = function() {
    var _gui = this._parent._parent.gui;

    var tree = _gui.get();
    var textbox = this.get();

    var currentDocument = aardvarkUtils.currentDocument();

    textbox.value = currentDocument.location.href;

    _gui.editColumn(tree.currentIndex, "url", textbox.value);
}

/**
 * Obslouží událost <code>onKeyUp</code> editoru URL.
 *
 * @param e     událost
 */
selectowl.editor.url.onKeyUp = function(e) {
    var _gui = this._parent._parent.gui;

    var tree = _gui.get();
    var textbox = e.target;

    _gui.editColumn(tree.currentIndex, "url", textbox.value);
}

/**
 * Vrátí XUL element <code>textbox</code> sloužící k editaci ULR.
 *
 * @return  XUL element <code>textbox</code>
 */
selectowl.editor.url.get = function() {
    var _root = this._parent._parent;

    return document.getElementById(_root.URL);
}