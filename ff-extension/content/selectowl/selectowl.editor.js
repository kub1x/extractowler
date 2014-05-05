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

/**
 * Obslouží událost <code>onPopUpShown</code> editoru selektorů.
 *
 * @param e     událost
 */
infocram.editor.onPopUpShown = function(e) {
    var _parent = this._parent;

    var textbox = document.getElementById(_parent.AREA);

    textbox.focus();

    textbox.selectionStart = textbox.value.length;
    textbox.selectionEnd = textbox.value.length;
}

/**
 * Vrátí XUL element panel sloužící jako editor selektorů.
 *
 * @return  panel
 */
infocram.editor.get = function() {
    var _root = this._parent;

    return document.getElementById(_root.EDITOR);
}

/**
 * Obnoví všechny prvky editoru selektorů.
 *
 * @param except    pole definující prvky, které nemají být obnovovány
 *                  ve formátu { prvek: true }, např. { widgetPos: true }
 */
infocram.editor.update = function(except) {
    for (var child in this) {
        if (child.match(/^widget.*$/)) {
            if ((!except || !except[child]) && this[child]['update']) {
                setTimeout("infocram.editor." +  child + ".update();", 300);
            }
        }
    }
}