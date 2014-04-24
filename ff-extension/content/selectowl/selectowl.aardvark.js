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
 * ******************************** AARDVARK ******************************** *
 * ************************************************************************** */

/**
 * Spustí Aardvark.
 */
selectowl.aardvark.start = function() {
    var currentBrowser  = aardvarkUtils.currentBrowser();

    aardvarkSelector.start(currentBrowser);
}

/**
 * Zpracuje element vybraný pomocí aardvarku, tj. vygeneruje pro něj selektor
 * a přidá jej do stromu.
 *
 * @param elem      vybraný element
 */
selectowl.aardvark.onSelect = function(elem) {
  //XXX
  alert("element:\t" + elem + "\n" +
        "nodeName:\t" + elem.nodeName);
  return;
  //XXX
        
    var _gui = this._parent.gui;

    // získání indexu uzlu, do jehož kontextu bude selektor zařazen

    var indexOfContext = this.getIndexOfContext(elem);

    // vygenerování selektoru a názvu, pod kterým budo do stromu přidán

    var context = _gui.getContext(indexOfContext, true);

    var name;
    var selector;

    var currDoc = aardvarkUtils.currentDocument();

    var parents = context == "" ? Sizzle("body", currDoc) : Sizzle(context, currDoc);

    var topReached = false;
    var idFound = false;

    do
    {
        var node = elem.tagName.toLowerCase();

        // přidaní selektoru ID

        if (elem.id != "") {
            if (!name) {
                name = elem.id;
            }

            // ověření, zdali je ID v rámci dokumentu unikátní

            if (isUniqueID(elem.id, elem.ownerDocument)) {
                node += "#" + elem.id;

                idFound = true;
            } else {
                node += "[id=" + elem.id + "]";
            }
        }

        // přidaní selektoru třídy

        if (elem.className != "") {
            var classes  = elem.className.split(" ");

            for (var i in classes) {
                if (classes[i] != "selectowl-selection") {
                    if (!name) {
                        name = classes[i];
                    }
                
                    node += "." + classes[i];
                }
            }
        }

        selector = selector == undefined ? node : node + " " + selector;

        elem = elem.parentNode && elem.parentNode.nodeType == elem.ELEMENT_NODE ? elem.parentNode : null;

        // ověření, zdali rodič elementu zpracovávaného v cyklu není již
        // elementem nadřazeného kontextu

        for (var j = 0; j < parents.length; j++) {
            if (parents[j] == elem) {
                topReached = true;
                break;
            }
        }
    } while (!topReached && !idFound && elem != null);

    // přidání selektoru do stromu

    _gui.addNode(indexOfContext, selector, name);
}

/**
 * Ověří, jestli se daný element nachází v zadaném kontextu.
 *
 * @param elem      element
 * @param context   kontext
 * @return          <code>true</code> nachází-li se v kontextu,
 *                  <code>false</code> nenachází-li
 */
selectowl.aardvark.isInContext = function(elem, context) {
    var currentDocument = aardvarkUtils.currentDocument();

    var selected = Sizzle(trim(context + " *"), currentDocument);

    var isInContext = false;

    for (var i = 0; i < selected.length; i++) {
        if (selected[i] == elem) {
            isInContext = true;
            break;
        }
    }

    return isInContext;
}

/**
 * Vrátí index uzlu stromu, do jehož kontextu zapadá daný element.
 *
 * @param elem      element
 * @return          index uzlu stromu
 */
selectowl.aardvark.getIndexOfContext = function(elem) {
    var _gui = this._parent.gui;

    var tree = _gui.get();

    var index = tree.currentIndex;

    if (index > 0) {
        var context = _gui.getContext(index, true);

        while (!this.isInContext(elem, context)) {
            index = tree.view.getParentIndex(index);
            context = _gui.getContext(index, true);
        }

        return index;
    } else {
        return 0;
    }
}
