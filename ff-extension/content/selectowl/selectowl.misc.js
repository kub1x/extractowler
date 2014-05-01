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
 * **************************** TESTOVACÍ FUNKCE **************************** *
 * ************************************************************************** */

/**
 * Ověří, zdali je testovaný znak kombinátor.
 *
 * @param character     testovany znak
 * @return              <code>true</code>, je-li kombinátor, <code>false</code>
 *                      není-li
 */
function isCombinator(character) {
    switch (character) {
        case " ":
        case ">":
        case "+":
        case "~":
            return true;
        default:
            return false
    }
}

/**
 * Ověří, zdali je testovaný objekt prázdný.
 *
 * @obj     testovaný objekt
 * @return  <code>true</code>, je-li prázdný, <code>false</code> není-li
 */
function isEmpty(obj){
    for (var i in obj) {
        if(obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

/**
 * Ověří, zdali testované ID je v rámci dokumentu unikátní.
 *
 * @param id        prověřované ID
 * @param doc       objekt dokumentu
 * @return          <code>true</code>, je-li unikátní, <code>false</code> není-li
 *
 */
function isUniqueID(id, doc) {
    var selected = Sizzle("[id=" + id + "]", doc);

    return !(selected.length > 1);
}

/* ************************************************************************** *
 * ***************************** POMOCNÉ FUNKCE ***************************** *
 * ************************************************************************** */

/**
 * Vytvoří nový XUL element.
 *
 * @param tagName       název elementu
 * @param attributes    atributy ve formátu "attr1=val1,attr2=val2,attr3=val3"
 * @return              XUL element
 */
function createElement(tagName, attributes) {
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var item = document.createElementNS(XUL_NS, tagName);

    if (attributes) {
        var attrs = attributes.split(",");

        for (var i = 0; i <attrs.length; i++) {
            var attr = attrs[i].split("=");
            item.setAttribute(attr[0], attr[1]);
        }
    }

    return item;
}

/**
 * Odstraní bílé znaky z obou konců řetězce.
 * http://www.somacon.com/p355.php
 *
 * @param stringToTrim      řetězec
 * @return                  řetězec po odstranění bílých znaků z obou konců
 */
function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g,"");
}

/**
 * Vrátí objekt s informacemi o pozici elementu v rámci dokumentu.
 *
 * @param elem      element
 * @return          objekt { x: 0, y: 0 }
 */
function getPos(elem)
{
    var pos = {
        x: 0,
        y: 0
    };

    while (elem) {
        pos.x += elem.offsetLeft;
        pos.y += elem.offsetTop;
        elem = elem.offsetParent;
    }

    return pos;
}

/* ************************************************************************** *
 * ******************************** KOLEKCE ********************************* *
 * ************************************************************************** */

/**
 * Vytvoří objekt reprezentující kolekci dat.
 * http://bytes.com/topic/javascript/answers/149271-collections-javascript
 */
function Collection() {
    var collection = {};
    var order = [];

    this.add = function(property, value) {
        if (!this.exists(property)) {
            collection[property] = value;
            order.push(property);
        }
    }

    this.remove = function(property) {
        collection[property] = null;
        var ii = order.length;
        while (ii-- > 0) {
            if (order[ii] == property) {
                order[ii] = null;
                break;
            }
        }
    }

    this.toString = function() {
        var output = [];
        for (var ii = 0; ii < order.length; ++ii) {
            if (order[ii] != null) {
                output.push(collection[order[ii]]);
            }
        }
        return output;
    }

    this.getKeys = function() {
        var keys = [];
        for (var ii = 0; ii < order.length; ++ii) {
            if (order[ii] != null) {
                keys.push(order[ii]);
            }
        }
        return keys;
    }

    this.update = function(property, value) {
        if (value != null) {
            collection[property] = value;
        }
        var ii = order.length;
        while (ii-- > 0) {
            if (order[ii] == property) {
                order[ii] = null;
                order.push(property);
                break;
            }
        }
    }

    this.exists = function(property) {
        return collection[property] != null;
    }
}