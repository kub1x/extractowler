
selectowl.gui.init = function () {
  selectowl.gui.populateWorkflow();
}

selectowl.gui.populateWorkflow = function () {
  // Create following structure: 
  //<hbox id="workflow">
  //  <label id="step-link-load-ontology"  value="Load Ontology" onclick="onStepLinkClick(event);" />
  //  <splitter />
  //  <label id="step-link-select-action"  value="Select Action" onclick="onStepLinkClick(event);" />
  //  <splitter />
  //  <vbox>
  //    <label id="step-link-select-object"  value="Select Object"          onclick="onStepLinkClick(event);" />
  //    <label id="step-link-select-objprop" value="Select Object Property" onclick="onStepLinkClick(event);" />
  //  </vbox>
  //</hbox>

  var onStepLinkClick = function( event ) {
    // Get group_id
    var $l = $(event.target);
    var id = $l.attr('id');
    var group_id = id.replace(selectowl.gui.WORKFLOW_LINK_PREFIX, '');
    // Select it
    selectowl.gui.showStep(group_id);
  }

  var $wf = $('hbox#workflow');
  var $groups = $('#main').children('groupbox');

  // Clear worflow menu
  $wf.empty();

  $groups.each( function(index, element) {
    debugger;
    var $grp = $(this);
    var $lab = $('<label />');
    // set label id
    $lab.attr('id', selectowl.gui.WORKFLOW_LINK_PREFIX + $grp.attr('id'));
    // set label text
    $lab.attr('value', $grp.children('caption').attr('label'));
    // show the active one
    if ( $grp.hasClass(selectowl.gui.CURRENT_STEP_CLASS) ) {
      $lab.addClass(selectowl.gui.CURRENT_STEP_CLASS);
    }
    // change active group on click
    $lab.click(onStepLinkClick);
    // actually add it
    $wf.append($lab);
  });


}

selectowl.gui.showStep = function (step_id ) {
  var $currgrp = $('groupbox' + '.' + selectowl.gui.CURRENT_STEP_CLASS);
  var $nextgrp = $('groupbox' + '#' + step_id);

  var $currlab = $('label' + '.' + selectowl.gui.CURRENT_STEP_CLASS);
  var $nextlab = $('label' + '#' + step_id);

  // Apply imediately for labels...
  $currlab.removeClass(selectowl.gui.CURRENT_STEP_CLASS);
  $nextlab.addClass(selectowl.gui.CURRENT_STEP_CLASS);

  // Apply imediately for groups
  $currgrp.removeClass(selectowl.gui.CURRENT_STEP_CLASS);
  $nextgrp.addClass(selectowl.gui.CURRENT_STEP_CLASS);

  //// Start animation - hide current
  //$currgrp.hide({ effect: "slide", "direction": "left" }, 500, function() {
  //  // Followed by - show next
  //  $nextgrp.show({ effect: "fade" }, 500);
  //});
  // Start animation - hide current
  $currgrp.hide();
  // Followed by - show next
  $nextgrp.show();

  //// hide current
  //$curr.effect("slide", { "direction": "left", "mode": "hide" }, 500, function() {
  //  // then show next
  //  $next.effect("slide", { "direction": "right", "mode": "show" }, 500);
  //});

  //selectowl.gui.refreshAllLists(); //TODO CHECKME TESTING XXX
}


/************************************************************
 *                                                          *
 ************************************************************/

selectowl.gui.refreshAllLists = function() {
  selectowl.gui.refreshPrefixesList();
  selectowl.gui.refreshClassesList();
  selectowl.gui.refreshPropertiesList();
  selectowl.gui.refreshScenarionTree();
}

selectowl.gui.refreshPrefixesList = function() {
  var tree = $('#ontology-prefixes-list').get(0);
  tree.view = selectowl.gui.getPrefixesTreeView();
  $(tree).attr('editable', 'true');
}

selectowl.gui.refreshClassesList = function() {
  var tree = $('#ontology-classes-list').get(0);
  tree.view = selectowl.gui.getClassesTreeView();
  $(tree).attr('editable', 'true');
}

selectowl.gui.refreshPropertiesList = function() {
  var tree = $('#ontology-properties-list').get(0);
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

  setTree : function(treebox){
    this.treebox = treebox;
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

      rowCount : selectowl.ontology.prefixes.getLength(),

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

      rowCount : selectowl.ontology.classes.getLength(),

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

      rowCount : selectowl.ontology.properties.getLength(),

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
