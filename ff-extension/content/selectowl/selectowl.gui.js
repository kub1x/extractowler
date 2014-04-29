
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


selectowl.gui.lists = [
    // List of all Classes in ontology
    { 
      id : '#ontology-classes-list',

      item_onClick : function( event ) {
        var owlObj = event.target.owlObj;
        //selectowl.workflow['select-object'].selected = owlObj;  //TODO change it to right (correct) step selection in scenario view
        //selectowl.gui.showStep(selectowl.gui.SCENARIO_STEP_ID); //TODO show the scenario step with the right object selected
        selectowl.aardvark.start();                               //TODO blink the document on aardwar start
      }, 

      accepts : function( item ) {
        return !item.isProperty;
      }, 

      createListItemFor: function( item ) {
        var $item = $('<treeitem />')
        var $row  = $('<treerow />');

        $item.append($row);

        var $cell;

        $cell = $('<treecell />');
        $cell.attr('label', item.prefix);
        $row.append($cell);

        $cell = $('<treecell />');
        $cell.attr('label', item.name);
        $row.append($cell);

        $cell = $('<treecell />');
        $cell.attr('label', item.type);
        $row.append($cell);

        return $item;
      }, 
      
      //TODO target_onSelected : function(element)  XXX function that aardwark.onSelect will call back to handle the item !!! where should this be???
    }, 

    // List of all Properties in ontology
    {
      id : '#ontology-properties-list',

      item_onClick : function( event ) {
        var owlObj = event.target.owlObj;
        //selectowl.workflow['select-objprop'].selected = owlObj;
        selectowl.aardvark.start();
      }, 

      accepts : function( item ) {
        return item.isProperty;
      }, 

      createListItemFor: function( item ) {
        var $item = $('<treeitem />');
        var $row  = $('<treerow />');

        $item.append($row);

        var $cell;

        $cell = $('<treecell />');
        $cell.attr('label', item.prefix);
        $row.append($cell);

        $cell = $('<treecell />');
        $cell.attr('label', item.name);
        $row.append($cell);

        $cell = $('<treecell />');
        $cell.attr('label', item.domain);
        $row.append($cell);

        $cell = $('<treecell />');
        $cell.attr('label', item.range);
        $row.append($cell);

        $cell = $('<treecell />');
        $cell.attr('label', item.type);
        $row.append($cell);

        return $item;
      }, 
    }
  ];


selectowl.gui.refreshAllLists = function() {

  // go, go, go!
  var l;
  var lists = selectowl.gui.lists;
  for ( l in  lists ) {
    selectowl.gui.refreshList(lists[l], selectowl.model);
  }

  // go for prefixes too
  selectowl.gui.refreshPrefixesList();
}

selectowl.gui.getPrefixesTreeView = function() {
  return {
    prefixes : selectowl.prefixes,

    rowCount : selectowl.prefixes.length,

    getCellText : function(row, column){
      if (column.index == 0) return this.prefixes[row].prefix;
      if (column.index == 1) return this.prefixes[row].URI;
      return null;
    },
    getCellValue : function(row, col) {
      console.log('getCellValue called!');
      return null;
    }, 
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
      //TODO see setCellText
      return true;
      //if(col.index === 0)
      //  return true; 
      //else
      //  return false; 
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
    setCellText : function(row, col, value) {
      if (col.index == 0) {
        var URI = this.getCellText(row, col.getNext());
        this.prefixes[row].prefix = value;
      }
      //TODO do we want to allow this?
      if (col.index == 1) {
        this.prefixes[row].URI = value;
      }
    }, 
    setCellValue : function(row, col, value) {
      console.log('setCellValue called!');
    }, 
    toString: function() {
      return "yep. that's me. your view with " + this.rowCount + " rows. " ;
    },
  }
};


selectowl.gui.refreshPrefixesList = function() {
  var tree = $('#ontology-prefixes-list').get(0);

  tree.view = selectowl.gui.getPrefixesTreeView();

  console.log('the tree view was set to: ' + tree.view.toString()); //DEBUG

  $(tree).attr('editable', 'true');
}


selectowl.gui.refreshList = function( list_conf, items ) {
  var $list = $(list_conf.id).children('treechildren');
  var $listitem;
  var p, q, prefix;

  $list.remove('treeitem');

  for ( p in items ) {
    q = items[p];
    if ( list_conf.accepts(q) ) {
      // Create the listitem
      $listitem = list_conf.createListItemFor( q );
      
      // Item holds it's object in owlObj!!!
      $listitem.get(0).owlObj = q;

      // Specify, what to do when accessing the resource
      // - this method should make us aware, what we're doing
      // - we will create selector for selected Resource by using aardwark
      // - we will then edit the selector so that it matches our needs
      // - this should also show the "scenario" view of selectowl
      $listitem.click(list_conf.item_onClick);
      //TODO replace this with tree onSelected method !!!

      $list.append($listitem);
    }
  } 
}
