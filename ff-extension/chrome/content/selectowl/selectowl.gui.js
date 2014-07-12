
selectowl.gui.init = function () {
  this.onNewScenarioMenuClick();
  //selectowl.gui.populateWorkflow();
}

//selectowl.gui.populateWorkflow = function () {
//  // Create following structure: 
//  //<hbox id="workflow">
//  //  <label id="step-link-load-ontology"  value="Load Ontology" onclick="onStepLinkClick(event);" />
//  //  <splitter />
//  //  <label id="step-link-select-action"  value="Select Action" onclick="onStepLinkClick(event);" />
//  //  <splitter />
//  //  <vbox>
//  //    <label id="step-link-select-object"  value="Select Object"          onclick="onStepLinkClick(event);" />
//  //    <label id="step-link-select-objprop" value="Select Object Property" onclick="onStepLinkClick(event);" />
//  //  </vbox>
//  //</hbox>
//
//  var onStepLinkClick = function( event ) {
//    // Get group_id
//    var $l = $(event.target);
//    var id = $l.attr('id');
//    var group_id = id.replace(selectowl.gui.WORKFLOW_LINK_PREFIX, '');
//    // Select it
//    selectowl.gui.showStep(group_id);
//  }
//
//  var $wf = $('#workflow');
//  var $groups = $('#main').children('groupbox');
//
//  // Clear worflow menu
//  $wf.empty();
//
//  $groups.each( function(index, element) {
//    debugger;
//    var $grp = $(this);
//    var $lab = $('<label />');
//    // set label id
//    $lab.attr('id', selectowl.gui.WORKFLOW_LINK_PREFIX + $grp.attr('id'));
//    // set label text
//    $lab.attr('value', $grp.children('caption').attr('label'));
//    // show the active one
//    if ($grp.hasClass(selectowl.gui.CURRENT_STEP_CLASS)) {
//      $lab.addClass(selectowl.gui.CURRENT_STEP_CLASS);
//    }
//    // change active group on click
//    $lab.click(onStepLinkClick);
//    // actually add it
//    $wf.append($lab);
//  });
//}

//selectowl.gui.showStep = function (step_id) {
//  var $currgrp = $('#main groupbox' + '.' + selectowl.gui.CURRENT_STEP_CLASS);
//  var $nextgrp = $('#main groupbox' + '#' + step_id);
//
//  var $currlab = $('#workflow label' + '.' + selectowl.gui.CURRENT_STEP_CLASS);
//  var $nextlab = $('#workflow label' + '#' + selectowl.gui.WORKFLOW_LINK_PREFIX + step_id);
//
//  // Apply imediately for labels...
//  $currlab.removeClass(selectowl.gui.CURRENT_STEP_CLASS);
//  $nextlab.addClass(selectowl.gui.CURRENT_STEP_CLASS);
//
//  // Apply imediately for groups
//  $currgrp.removeClass(selectowl.gui.CURRENT_STEP_CLASS);
//  $nextgrp.addClass(selectowl.gui.CURRENT_STEP_CLASS);
//
//  // hide current - show next
//  $currgrp.hide();
//  $nextgrp.show();
//}


/************************************************************
 *                                                          *
 ************************************************************/

selectowl.gui.refreshAllTrees = function() {
  selectowl.gui.refreshPrefixesTree();
  selectowl.gui.refreshClassesTree();
  selectowl.gui.refreshPropertiesTree();
  selectowl.gui.refreshScenarionTree();
}

selectowl.gui.refreshPrefixesTree = function() {
  var tree = $('#selectowl-prefixes-tree').get(0);
  tree.view = selectowl.gui.getPrefixesTreeView();
  $(tree).attr('editable', 'true');
}

selectowl.gui.refreshClassesTree = function() {
  var tree = $('#selectowl-classes-tree').get(0);
  tree.view = selectowl.gui.getClassesTreeView();
  $(tree).attr('editable', 'true');
}

selectowl.gui.refreshPropertiesTree = function() {
  var tree = $('#selectowl-properties-tree').get(0);
  tree.view = selectowl.gui.getPropertiesTreeView();
  $(tree).attr('editable', 'true');
}

selectowl.gui.refreshScenarionTree = function() {
  var tree = $('#selectowl-scenario-tree').get(0);
  tree.view = selectowl.gui.getScenarioTreeView();
}


/************************************************************
 *                                                          *
 ************************************************************/

selectowl.gui.basicTreeView = {
  // Set this!
  rowCount : -1,  

  // Implement this for text cells
  getCellText : function(row, col){ throw "NOT IMPLEMENTED!"; },

  // Implement this for text cells
  setCellText : function(row, col, value) { throw "NOT IMPLEMENTED!"; }, 

  // Implement this for non-text cells
  getCellValue : function(row, col) { throw "NOT IMPLEMENTED!"; }, 

  // Implement this for non-text cells
  setCellValue : function(row, col, value) { throw "NOT IMPLEMENTED!"; }, 

  setTree : function(treeBox){
    this.treeBox = treeBox;
  },
  isContainer : function(row){
    return false;
  },
  isSeparator : function(row){
    return false;
  },
  isSorted : function(){
    return false; 
  },
  isEditable : function(row, col){
    return false;
  },
  getLevel : function(row){
    return 0; 
  },
  getImageSrc : function(row, col){
    return null; 
  },
  getRowProperties : function(row, props){ },
  getCellProperties : function(row, col, props){ },
  getColumnProperties : function(colid, col, props){ }, 
};

selectowl.gui.getPrefixesTreeView = function() {
  // Merge basic tree structure with it's "specific" implementation and return
  return $.extend({}, selectowl.gui.basicTreeView, {
    prefixes : selectowl.ontology.prefixes,

    get rowCount() { return selectowl.ontology.prefixes.getLength(); },

    getCellText : function(row, col){
      if (col.id == 'prefixes-prefix-col') { return this.prefixes.get(row).prefix; }
      if (col.id == 'prefixes-uri-col'   ) { return this.prefixes.get(row).uri;    }
    },

    setCellText : function(row, col, value) {
      if (col.id == 'prefixes-prefix-col') { this.prefixes.get(row).prefix = value; }
      if (col.id == 'prefixes-uri-col'   ) { this.prefixes.get(row).uri    = value; }
      //TODO do we want to allow URI editing? ^^^ 
    }, 

    isEditable : function(row, col){
      return true;
      //TODO do we want to allow URI editing? ^^^ 
    },
  });
};

selectowl.gui.getClassesTreeView = function() {
  // Merge basic tree structure with it's "specific" implementation and return
  return $.extend({}, selectowl.gui.basicTreeView, {
    classes : selectowl.ontology.classes,

    get rowCount() { return selectowl.ontology.classes.getLength(); },

    getCellText : function(row, column){
      if (column.id == 'classes-prefix-col') { return this.classes.get(row).prefix; } 
      if (column.id == 'classes-name-col'  ) { return this.classes.get(row).name;   } 
      if (column.id == 'classes-type-col'  ) { return this.classes.get(row).type;   } 
    },

    setCellText : function(row, col, value) {
      if (column.id == 'classes-prefix-col') { this.classes.get(row).prefix = value; } 
      if (column.id == 'classes-name-col'  ) { this.classes.get(row).name   = value; } 
      if (column.id == 'classes-type-col'  ) { this.classes.get(row).type   = value; } 
    }, 

  });
};

selectowl.gui.getPropertiesTreeView = function() {
  // Merge basic tree structure with it's "specific" implementation and return
  return $.extend({}, selectowl.gui.basicTreeView, {
    properties : selectowl.ontology.properties,

    get rowCount() { return selectowl.ontology.properties.getLength(); },

    getCellText : function(row, column){
      if (column.id == 'properties-prefix-col') { return this.properties.get(row).prefix; } 
      if (column.id == 'properties-name-col'  ) { return this.properties.get(row).name;   } 
      if (column.id == 'properties-domain-col') { return this.properties.get(row).domain; } 
      if (column.id == 'properties-range-col' ) { return this.properties.get(row).range;  } 
      if (column.id == 'properties-type-col'  ) { return this.properties.get(row).type;   } 
    },

    setCellText : function(row, col, value) {
      if (column.id == 'properties-prefix-col') { this.properties.get(row).prefix = value; } 
      if (column.id == 'properties-name-col'  ) { this.properties.get(row).name   = value; } 
      if (column.id == 'properties-domain-col') { this.properties.get(row).domain = value; } 
      if (column.id == 'properties-range-col' ) { this.properties.get(row).range  = value; } 
      if (column.id == 'properties-type-col'  ) { this.properties.get(row).type   = value; } 
    }, 

  });
};

selectowl.gui.getScenarioTreeView = function() {
  // Merge basic tree structure with it's "specific" implementation and return
  return $.extend({}, selectowl.gui.basicTreeView, selectowl.scenario.tree);
}


/************************************************************
 *                                                          *
 ************************************************************/

selectowl.gui.onClassSelect = function ( event ) {
  //var target = event.target;

  //var idx = target.currentIndex;
  //var resource = selectowl.ontology.classes.get(idx).uri;

  //selectowl.scenario.tree.clearSelection();

  //selectowl.aardvark.start( resource );
}; 

selectowl.gui.onPropertySelect = function ( event ) {
  //var target = event.target;
  //console.log('called onselect on name: ' + target.tagName + ' with current index: ' + target.currentIndex);
  //var idx = target.currentIndex;
  //var resource = selectowl.ontology.properties.get(idx).uri;
  //selectowl.aardvark.start( resource );
}; 


selectowl.gui.onClassClick = function ( event ) {
  var target = $('#selectowl-classes-tree').get(0);
  var idx = target.currentIndex;
  var resource = selectowl.ontology.classes.get(idx).uri;
  selectowl.aardvark.start( resource );
};

selectowl.gui.onPropertyClick = function ( event ) {
  var target = $('#selectowl-properties-tree').get(0);
  var idx = target.currentIndex;
  var resource = selectowl.ontology.properties.get(idx).uri;
  selectowl.aardvark.start( resource );
};

/************************************************************
 *                                                          *
 ************************************************************/

/* we will show selected item in webpage document and set current context on select */
selectowl.gui.onScenarioSelect = function ( event ) {
  var _tree = selectowl.scenario.tree;
  var currentIndex = _tree.currentIndex;

  //console.log('selected(BEGIN) scenario step with currentIndex: ' + currentIndex);

  if (currentIndex == -1) {
    //console.log('onScenarioSelect(-1) was called - deselecting!!');
    this.hideHighlight();
    return;
  }

  //var target = event.target;
  //var idx = target.currentIndex;
  //var ts = selectowl.scenario.tree.get(idx);
  //var ss = ts.step;

  //TODO shall we show the properties window instead of classes? 
  //this.showStep('select-property');
  
  //TODO sort properties by domain according to selected item

  // juveej
  this.showHighlight();
};

/** Obslouží událost <code>onResize</code> webového prohlížeče.  */
selectowl.gui.onResize = function() {
  selectowl.gui.refreshHighlight();
}

selectowl.gui.onScenarioClick = function(event) {
  var _tree = selectowl.scenario.tree

  // Selection handling (left button)
  if (event.button == 0) {
    var currentIndex = _tree.currentIndex;
    var lastIndex = _tree.lastIndex;

    //console.log('clicked scenario with currentIndex: ' + _tree.currentIndex + ' with button: ' + event.button);

    if (currentIndex == lastIndex) {
      // Deselecting
      _tree.lastIndex = -1;
      _tree.clearSelection();
      this.hideHighlight();
    } else {
      _tree.lastIndex = currentIndex;
    }
    return;
  }

  // Open popup on right click
  if (event.button == 2 && (_tree.currentIndex >= 0 || this.editing != this.DEF)) {
    this.openPopupForCurrent('edit');
  }
};

selectowl.gui.getScenarioColumn = function(col_id) {
  var tree = selectowl.scenario.tree;

  var col = tree.columns.getNamedColumn(col_id);
  var idx = tree.currentIndex;

  return tree.getCellText(idx, col);
};

/**
 * for backward compatibility - gui.get returns the tree element
 */
selectowl.gui.get = function() {
  return selectowl.scenario.tree.getTreeElement();
}

//NOTE DEPRECATED - won't use this to edit.. will be specific to the underlying
//step how it will be edited
//
//selectowl.gui.editColumn = function(idx, col_id, value) {
//  var col = selectowl.scenario.tree.getColById(col_id);
//  selectowl.scenario.tree.setCellText(idx, col, value);
//  //TODO is this ---------^^^^^^^^^^^ cool to do?
//  //yeah.. just implemented it so that it saves the value to the right place
//}

selectowl.gui.onScenarioKeyPress = function(event) {
  var code;
  var handeled;

  console.log('keypress ctrl: '+ event.ctrlKey + ' keyCode:' + event.keyCode + ' charCode: ' + event.charCode );

  if (event.ctrlKey && event.keyCode == 13) { // Ctrl+enter
    this.openPopupForCurrent('edit');
    handeled = true;
  }

  //if (event.keyCode == 32) { // space
  //  if (selectowl.scenario.currentIndex != -1) {
  //    selectowl.scenario.tree.clearSelection();
  //    handeled = true;
  //  } else {
  //    //Select is default behavior leave it to bubble
  //    return;
  //  }
  //}
  
  //MAYBE OBSOLETE store last index???
  //if (event.keyCode == 38 || // Up   arrow
  //    event.keyCode == 40) { // Down arrow
  //  var _tree = selectowl.scenario.tree
  //  var currentIndex = _tree.currentIndex;
  //  var lastIndex = _tree.lastIndex;
  //  //console.log('keyDown currentIndex:' + currentIndex + ' lastIndex: ' + lastIndex + ' keyCode: ' + event.keyCode);
  //  _tree.lastIndex = currentIndex;
  //  return;
  //}

  if (event.keyCode == 27) { // escape
    selectowl.scenario.tree.clearSelection();
    handeled = true;
  }

  if (event.keyCode == 46) { // delete
    selectowl.scenario.tree.deleteCurrent();
    handeled = true;
  }

  if (event.charCode == 105) { // 'i'
    this.openPopupForCurrent('edit');
    handeled = true;
  }

  if (event.charCode == 106) { // 'j'
    selectowl.scenario.tree.selectNext();
    handeled = true;
  }

  //if (event.charCode == 97) { // 'a'
  //  //TODO create new siblink
  //  handeled = true;
  //}

  //if (event.shiftKey && event.charCode == 97) { // Shift+'a'
  //  //TODO create new "previous" siblink
  //  handeled = true;
  //}

  if (event.charCode == 107) { // 'k'
    selectowl.scenario.tree.selectPrevious();
    handeled = true;
  }

  if (event.charCode == 108) { // 'l'
    this.openPopupForCurrent('new');
    handeled = true;
  }


  if (handeled) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }


};

/* ************************************************************************** *
 *                                  HIGHLIGHT                                 *
 * ************************************************************************** */

selectowl.gui.showHighlight = function() {
  var currentBrowser = aardvarkUtils.currentBrowser();
  currentBrowser.addEventListener("resize", this.onResize, false);
  this.refreshHighlight();
};

selectowl.gui.hideHighlight = function() {
  var currentBrowser = aardvarkUtils.currentBrowser();
  currentBrowser.removeEventListener("resize", this.onResize);
  this.hideContextBox();
  this.hideSelectedElem();
};

/** Zobrazí box zvýrazňující kontext.
 *
 * @param elem  element, kolemž něho bude box vytvořen
 */
selectowl.gui.showContextBox = function(elem) {
  this.hideContextBox();

  this.borderElems = [];

  var d, i;

  for (i = 0; i < 4; i++)
  {
    d = document.createElementNS("http://www.w3.org/1999/xhtml", "div");

    d.className = "selectowlbox"
    d.style.display = "none";
    d.style.position = "absolute";
    d.style.height = "0px";
    d.style.width = "0px";
    d.style.zIndex = "65536";

    d.style.background = "#000";
    d.style.opacity = ".5";

    d.autopagerSelectorLabel = true; // mark as ours

    this.borderElems[i] = d;
  }

  var doc = elem.ownerDocument;
  if (!doc || !doc.body)
      return;

  for (i = 0; i < 4; i++) {
    try {
        doc.adoptNode(this.borderElems[i]);
    }
    catch (e) {
    // Gecko 1.8 doesn't implement adoptNode, ignore
    }
    doc.body.appendChild(this.borderElems[i]);
  }

  var currentDocument = aardvarkUtils.currentDocument();

  var elements = currentDocument.getElementsByTagName("*");

  var width = 0;

  for (i = 0; i < elements.length; i++) {
    if (width < elements[i].offsetWidth) {
      width = elements[i].offsetWidth;
    }
  }

  var pos = getPos(elem);

  this.borderElems[0].style.left
  = this.borderElems[1].style.left
  = this.borderElems[2].style.left
  = "0px";
  this.borderElems[3].style.left = (pos.x + elem.offsetWidth) + "px";

  this.borderElems[0].style.width
  = this.borderElems[1].style.width
  = (currentDocument.body.offsetWidth > width ? currentDocument.body.offsetWidth : width) + "px";
  this.borderElems[2].style.width = (pos.x) + "px";
  this.borderElems[3].style.width = ((currentDocument.body.offsetWidth > width ? currentDocument.body.offsetWidth : width) - (pos.x + elem.offsetWidth)) + "px";


  var documentHeight = Math.max(
    Math.max(currentDocument.body.scrollHeight, currentDocument.documentElement.scrollHeight),
    Math.max(currentDocument.body.offsetHeight, currentDocument.documentElement.offsetHeight),
    Math.max(currentDocument.body.clientHeight, currentDocument.documentElement.clientHeight)
  );

  this.borderElems[0].style.height = (pos.y) + "px";
  this.borderElems[1].style.height = (documentHeight - (pos.y + elem.offsetHeight)) + "px";
  this.borderElems[2].style.height
  = this.borderElems[3].style.height
  = (elem.offsetHeight) + "px";

  this.borderElems[0].style.top = "0px";
  this.borderElems[2].style.top
  = this.borderElems[3].style.top
  = (pos.y) + "px";
  this.borderElems[1].style.top = (pos.y + elem.offsetHeight) + "px";

  this.borderElems[0].style.display
  = this.borderElems[1].style.display
  = this.borderElems[2].style.display
  = this.borderElems[3].style.display
  = "";
}

/** Odstraní box zvýrazňující kontext.
 */
selectowl.gui.hideContextBox = function() {
  if (!this.borderElems) return;
    for (var i = 0; i < this.borderElems.length; i++) {
      if (this.borderElems[i].parentNode) {
        this.borderElems[i].parentNode.removeChild(this.borderElems[i]);
      }
    }
}

/** Zvýrazní všechny elementy vyhovující selektoru.
 *
 * @param selected  selektor
 */
selectowl.gui.showSelectedElem = function(selected) {
  this.hideSelectedElem();

  var currentDocument = aardvarkUtils.currentDocument();

  if (currentDocument.getElementById("selectowl-style") == null) {
    var style = currentDocument.createElement('style');

    style.setAttribute("id", "selectowl-style");
    style.innerHTML = ".selectowl-selection { background: GreenYellow; }";

    var head = currentDocument.getElementsByTagName('head')[0];

    if (head) {
      head.appendChild(style);
    } else {
      currentDocument.body.appendChild(style);
    }
  }

  try {
    //for (var i in selected) {
    //    jQuery(selected[i]).addClass("selectowl-selection");
    //}
    $(selected).addClass('selectowl-selection');
  } catch (exception) {}
}

/**
 * Odstraní zvýraznění elementů.
 */
selectowl.gui.hideSelectedElem = function() {
  var currentDocument = aardvarkUtils.currentDocument();

  //var selected = Sizzle(".selectowl-selection", currentDocument);
  //
  //for (var i in selected) {
  //    jQuery(selected[i]).removeClass("selectowl-selection");
  //}
  
  $(currentDocument).find(".selectowl-selection").removeClass("selectowl-selection");
}

/**
 * Obnoví zvýraznění elementů a kontextu v závislosti na výběru v elementu
 * <code>tree</code>.
 */
selectowl.gui.refreshHighlight = function() {
  //TODO XXX context is defined differently now.. it changes only on <scr:each>
  //or whatever name we give calling a template on subset of DOM
  
  //var context = this.getContext(undefined, true);
  //if (context != null) {
  //  this.showSelectedElem(context);
  //  this.showContextBox(context[0]);
  //} else {
  //  this.hideSelectedElem();
  //  this.hideContextBox();
  //}
}


selectowl.gui.getContext = function() {
  var _tree = selectowl.scenario.tree;
  var index = _tree.currentIndex;

  //
  // Collect selectors
  //
  // We go all the way through parents (bottom-up). Only TreeStep holds the
  // reference to it's parent, then we access the underlying Step object. 
  var selectors = []
  var ts = _tree.get(index);

  selectors.unshift(ts.step.selector);

  while (ts.parent != null) {
    ts = ts.parent;
    selectors.unshift(ts.step.selector);
  }

  //
  // Get that node, parent by parent, all the way to target
  var currentDocument = aardvarkUtils.currentDocument();
  var $selected = $(currentDocument);
  for (s in selectors) {
    $selected = $selected.find(selectors[s]);
  }

  return $selected.get();
}

/* ************************************************************************** *
 *                               NEW WITH XML                                 *
 * ************************************************************************** */

selectowl.gui.onOntologyEditPrefixesMenuClick = function(event) {
  var container = document.getElementById('selectowl-container');
  var panel = document.getElementById('selectowl-edit-prefixes-panel');
  //NOTE the documentation can be found on MDN site
  // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/Method/openPopup
  panel.openPopup(container, 'overlap', 0, 0, false, false, event);
}

selectowl.gui.onOntologyImportMenuClick = function(event) {
  var container = document.getElementById('selectowl-container');
  var panel = document.getElementById('selectowl-load-ontology-panel');
  panel.openPopup(container, 'overlap', 0, 0, false, false, event);
}

//selectowl.gui.onDirectCommand = function(event) {
//  console.log('direct command called x:' + event.clientX);
//  //var container = event.target;
//  var panel = document.getElementById('scenario-direct-command-panel');
//  panel.openPopup(null, 'after_pointer', event.clientX, event.clientY, false, false, event);
//};

selectowl.gui.onNewScenarioMenuClick = function () {
  //TODO XXX open a dialog asking for new template name,
  //then create the template and create a call-template for it
  var contentWindow = aardvarkUtils.currentBrowser().contentWindow; 
  var url = contentWindow.location.toString();

  var sCallTemplate = selectowl.scenario.tree.createNewStep('CallTemplateStep');
  sCallTemplate.step.name = 'init';
  sCallTemplate.step.type = 'html/GET';

  var sValueOf = selectowl.scenario.tree.createNewStep('ValueOfStep', sCallTemplate);
  sValueOf.step.text = url;

  var sTemplate = selectowl.scenario.tree.createNewStep('TemplateStep');
  sTemplate.step.name = 'init';
  sTemplate.step.mime = 'text/html';

  this.refreshScenarionTree();
};

//------------------------------------------------------------------

//selectowl.gui.onScenarioEditTemplatePopupShowing = function(event) {
//  var selected_step = selectowl.scenario.tree.getSelected();
//  $('#scenario-edit-template-name').val(selected_step.step.name);
//  $('#scenario-edit-template-mime').val(selected_step.step.mime);
//};
//
//selectowl.gui.onScenarioEditTemplateSubmit = function(event) {
//  //TODO error handling
//  var selected_step = selectowl.scenario.tree.getSelected();
//  selected_step.step.name = $('#scenario-edit-template-name').val();
//  selected_step.step.mime = $('#scenario-edit-template-mime').val();
//  event.currentTarget.hidePopup();
//};    
//
//selectowl.gui.onTemplateNewChildClick = function() {
//  var orig = document.getElementById('scenario-edit-template-panel');
//  var child = document.getElementById('scenario-new-child-template-panel');
//  child.openPopup(null, orig.position);
//  orig.hidePopup();
//};
//
////------------------------------------------------------------------
//
//selectowl.gui.onScenarioEditCallTemplatePopupShowing = function(event) {
//  var selected_step = selectowl.scenario.tree.getSelected();
//  $('#scenario-edit-call-template-name').val(selected_step.step.name);
//  $('#scenario-edit-call-template-type').val(selected_step.step.type);
//};
//
//selectowl.gui.onScenarioEditCallTemplateSubmit = function(event) {
//  //TODO error handling
//  var selected_step = selectowl.scenario.tree.getSelected();
//  selected_step.step.name = $('#scenario-edit-call-template-name').val();
//  selected_step.step.type = $('#scenario-edit-call-template-type').val();
//  event.currentTarget.hidePopup();
//};    
//
////------------------------------------------------------------------
//
//selectowl.gui.onScenarioEditValueOfPopupShowing = function(event) {
//  var selected_step = selectowl.scenario.tree.getSelected();
//  $('#scenario-edit-value-of-text').val(selected_step.step.text);
//  $('#scenario-edit-value-of-select').val(selected_step.step.select);
//  $('#scenario-edit-value-of-regexp').val(selected_step.step.regexp);
//  $('#scenario-edit-value-of-replace').val(selected_step.step.replace);
//  $('#scenario-edit-value-of-property').val(selected_step.step.property);
//};
//
//selectowl.gui.onScenarioEditValueOfSubmit = function(event) {
//  console.log('submit called');
//  //TODO error handling
//  var selected_step = selectowl.scenario.tree.getSelected();
//  selected_step.step.text = $('#scenario-edit-value-of-text').val();
//  selected_step.step.select = $('#scenario-edit-value-of-select').val();
//  selected_step.step.regexp = $('#scenario-edit-value-of-regexp').val();
//  selected_step.step.replace = $('#scenario-edit-value-of-replace').val();
//  selected_step.step.property = $('#scenario-edit-value-of-property').val();
//  event.currentTarget.hidePopup();
//};    
//
////------------------------------------------------------------------
//
//selectowl.gui.onScenarioEditOntoElemPopupShowing = function(event) {
//  var selected_step = selectowl.scenario.tree.getSelected();
//  $('#scenario-edit-onto-elem-rel').val(selected_step.step.rel);
//  $('#scenario-edit-onto-elem-type').val(selected_step.step.type);
//  $('#scenario-edit-onto-elem-about').val(selected_step.step.about);
//};
//
//selectowl.gui.onScenarioEditOntoElemSubmit = function(event) {
//  //TODO error handling
//  var selected_step = selectowl.scenario.tree.getSelected();
//  selected_step.step.rel   = $('#scenario-edit-onto-elem-rel').val();
//  selected_step.step.type  = $('#scenario-edit-onto-elem-type').val();
//  selected_step.step.about = $('#scenario-edit-onto-elem-about').val();
//  event.currentTarget.hidePopup();
//};
//
////------------------------------------------------------------------

selectowl.gui.openPopupForCurrent = function( type ) {
  var popup = document.getElementById('scenario-'+type+'-panel');
  var y_offset = selectowl.scenario.tree.getSelectedRowYOffset(type == 'new' ? 'end' : 'middle');
  var anchor = document.getElementById('scenario-editor-treechildren');
  popup.openPopup(anchor, 'end_before', 0, y_offset, false, false);
};

selectowl.gui.onNewChild = function(event, elemType) {

  document.getElementById('scenario-new-panel').hidePopup();

  var ts;
  var curr = selectowl.scenario.tree.getSelected();
  //TODO replace this switch case.. sort this out in createStep method of scenario (not tree)
  //TODO better placement (append child 'l', prepend/unshift child 'L', add after 'a')
  switch (elemType) {
    case 'onto-elem':
      ts = selectowl.scenario.tree.createNewStep('OntoElemStep', curr);
      break;
    case 'value-of':
      ts = selectowl.scenario.tree.createNewStep('ValueOfStep', curr);
      break;
    case 'call-template':
      ts = selectowl.scenario.tree.createNewStep('CallTemplateStep', curr);
      break;
    case 'template':
      ts = selectowl.scenario.tree.createNewStep('TemplateStep', -1);
      break;
    default:
      throw 'unknown type: ' + elemType;
  }

  selectowl.scenario.tree.selectStep(ts);

  selectStep.gui.openPopupForCurrent('edit');
};

selectowl.gui.onScenarioNewPopupShowing = function(event) {
  var step = selectowl.scenario.tree.getSelected().step;
  var allowedChildNodes = step.allowedChildNodes;

  var popup = document.getElementById('scenario-new-panel');
  popup.innerHTML = '';

  var vbox = document.createElement('vbox');
  popup.appendChild(vbox);
  vbox.setAttribute('flex', 1);

  for(i in allowedChildNodes) {
    var ch = allowedChildNodes[i];
    var hbox = document.createElement('hbox');
    vbox.appendChild(hbox);
    var button = document.createElement('button');
    hbox.appendChild(button);
    button.setAttribute('label', ch);
    button.setAttribute('flex', 1);
    button.addEventListener('command', function(event) {
      //selectowl.gui.onNewChild(event, ch); //TODO XXX takhle ten closure nefunguje, promenna 'ch' se prepise a udrizi se jen posledni
      selectowl.gui.onNewChild(event, $(this).attr('label')); //TODO WARNING using label for storing variables is baad ;)
    });
  }
};

//-------------------------------------------------------

// here we'll catch special cases of nodes
// TODO implement this hook on specific steps directly or something
selectowl.gui.fieldAttrsHook = function(step, field, textbox) {
  //if (step.nodeName == 'value-of' && field == 'property') {
  //  var data = selectowl.ontology.properties.getShortened();
  //  $(textbox).autocomplete({
  //    source: data,
  //  }); 
  //  console.log('hooked autocomplete with data: '+ JSON.stringify(data).slice(0, 100));
  //  return;
  //};

};

selectowl.gui.onScenarioEditPopupShowing = function(event) {
  var step = selectowl.scenario.tree.getSelected().step;
  var fields = step.getOwnFields();

  var popup = document.getElementById('scenario-edit-panel');
  popup.innerHTML = '';

  var vbox = document.createElement('vbox');
  vbox.setAttribute('flex', 1);

  var first_id = null;
  for(f in fields) {
    var field = fields[f];
    var field_id = 'scenario-edit-' + field + '-field';
    first_id = first_id || field_id;

    var hbox = document.createElement('hbox');
    hbox.setAttribute('flex', 1);
    var pre = document.createElementNS('http://www.w3.org/1999/xhtml', 'pre');
    pre.innerHTML = field;
    hbox.appendChild(pre);
    var textbox = document.createElement('textbox');
    textbox.setAttribute('id', field_id);
    textbox.setAttribute('flex', 1);
    textbox.setAttribute('value', step[field]);

    //selectowl.gui.fieldAttrsHook(step, field, textbox);

    hbox.appendChild(textbox);
    vbox.appendChild(hbox);
  }

  popup.appendChild(vbox);
};

selectowl.gui.onScenarioEditSubmit = function(event) {
  var step = selectowl.scenario.tree.getSelected().step;
  var fields = step.getOwnFields();
  for(f in fields) {
    var field = fields[f];
    var field_id = 'scenario-edit-' + field + '-field';
    // Assign
    step[field] = $('#'+field_id).val();
  }
  event.target.hidePopup();
};

selectowl.gui.onScenarioEditPanelKeyDown = function(event) {
  if (event.ctrlKey && event.keyCode == 13) { // ctrl+enter
    event.currentTarget.dispatchEvent(new CustomEvent("submit", {bubbles:false, cancelable:true}));
    event.preventDefault();
    event.stopPropagation();
  }
};

//-------------------------------------------------------

selectowl.gui.focusFirst = function(target, tagName) {
  target.getElementsByTagName(tagName)[0].focus();
};

selectowl.gui.onScenarioEditPopupShown = function(event) {
  this.focusFirst(event.target, 'textbox');
};

selectowl.gui.onScenarioNewPopupShown = function(event) {
  this.focusFirst(event.target, 'button');
};

//-------------------------------------------------------

