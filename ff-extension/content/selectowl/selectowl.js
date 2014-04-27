
var selectowl = {
  aardvark : {
  }, 

  gui : {
    CURRENT_STEP_CLASS : "current-step", //TODO load from prefs
    WORKFLOW_LINK_PREFIX : 'wf-link-',   //TODO load from prefs
  }, 

  workflow : {
    'select-object' : {
      selected : null,
    }, 
    'select-objprop' : {
      selected : null,
    }
  }
}


selectowl.init = function () {
  selectowl.gui.init();
  selectowl.load(); //TODO debug only - delete
}


selectowl.load = function (url) {
  //console.log('loading url: ' + url + ', !url: ' + !url);
  if (!url) { url =  $('#ontology-url').val(); }

  //TODO remove default to foaf (testing only)
  if (!url) url = 'http://xmlns.com/foaf/spec/index.rdf';

  //TODO put back the "empty url" exception
  //if (!url) { throw "empty url, nothing to load"; }

  // Call load on jOWL and refresh after
  var callback = function () {
    //TODO load to selectowl and delete jOWL
    selectowl.feedMee();
    selectowl.refreshAllLists();
    selectowl.gui.showStep('select-action');
  };

  jOWL.load(url, callback, {reason: true, locale: 'en'});
}


selectowl.model = {}; //XXX !!!
selectowl.prefixes = [];
selectowl.prefix2uri = function ( prefix ) {
  var p;
  var idx = selectowl.prefixes;
  for ( p in idx ) {
    p = idx[p];
    if (prefix == p.prefix) {
      return p.URI;
    }
  }
  return null;
}

selectowl.uri2prefix = function ( URI ) {
  var p;
  var idx = selectowl.prefixes;
  for ( p in idx ) {
    p = idx[p];
    if (URI == p.URI) {
      return p.prefix;
    }
  }
  return URI; //XXX if not found, return the URI back
}

selectowl.feedMee = function () {
  // index is a hashmap from URI to jOWL Ontology object representing the resource
  // sometimes the URI is shortened when base-namespace is present
  // 
  // we use full URI to reference everything here.. in our inner repre this.model
  var index = jOWL.index('ID');
  var m = selectowl.model;
  var r, el, my;

  // Fill prefixes
  var ns = jOWL.NS;
  for ( p in ns ) {
    p = ns[p];
    // Check if it's valid prefix and if we don't have it already
    if (p.URI && p.prefix && selectowl.uri2prefix(p.URI) == p.URI) {
      np = {};
      np.prefix = p.prefix;
      np.URI    = p.URI;
      selectowl.prefixes.push(np);
    }
  }

  // Fill Resources
  for ( r in index ) {
    el = index[r];
    my = {};
    my.baseURI = el.baseURI
    my.URI = el.URI;
    my.type = el.type;
    my.name = el.name;
    my.isProperty = el.isProperty;
    //TODO better unknow prefix handling - move this to function
    my.prefix = selectowl.uri2prefix(el.baseURI);
    if ( el.isProperty ) {
      my.domain = el.domain;
      my.range = el.range;
    }
    m[my.URI] = my;
  } 
}



selectowl.refreshAllLists = function() {
  var lists = [
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

  // go, go, go!
  var l;
  for ( l in lists ) {
    selectowl.refreshList(lists[l], selectowl.model);
  }

  // go for prefixes too
  var prefixes_list = { 
      id : '#ontology-prefixes-list',
      item_onClick : null, 
      accepts : function( item ) { return true; }, 
      createListItemFor: function( item ) {
        var $item = $('<treeitem />')
        var $row  = $('<treerow />');

        $item.append($row);

        var $cell;

        $cell = $('<treecell />');
        $cell.attr('label', item.prefix);
        $row.append($cell);

        $cell = $('<treecell />');
        $cell.attr('label', item.URI);
        $row.append($cell);

        return $item;
      } 
    };
  selectowl.refreshList(prefixes_list , selectowl.prefixes); 

  //// set the prefixes tree to editable !!!
  //var tree = $('#ontology-prefixes-list').get(0);
  //var treeView = {
  //    rowCount : selectowl.prefixes.length,
  //    getCellText : function(row,column){
  //      if (column.index == 0) return selectowl.prefixes[raw].prefix;
  //      if (column.index == 1) return selectowl.prefixes[raw].URI;
  //      return null;
  //    },
  //    setTree: function(treebox){ this.treebox = treebox; },
  //    isContainer: function(row){ return false; },
  //    isSeparator: function(row){ return false; },
  //    isSorted: function(){ return false; },
  //    getLevel: function(row){ return 0; },
  //    getImageSrc: function(row,col){ return null; },
  //    getRowProperties: function(row,props){},
  //    getCellProperties: function(row,col,props){},
  //    getColumnProperties: function(colid,col,props){}, 
  //    setCellText : function(row, col, value) {
  //      if (!col.index == 0) return;
  //      var URI = this.getCellValue(row, col.getNext()); // Get uri
  //      alert("[" + row + ", " + col + "]" + 
  //            "Changing prefix for: " + URI + "\n" +
  //            "from: " + selectowl.prefixes[URI].prefix + " to: " + value);
  //      selectowl.prefixes[URI].prefix = value;
  //    }
  //};
  //tree.view = treeView;
  //$(tree).attr('editable', 'true');
}


selectowl.refreshList = function( list, items ) {
  var $list = $(list.id).children('treechildren');
  var $listitem;
  var p, q, prefix;

  $list.remove('treeitem');

  for ( p in items ) {
    q = items[p];
    if ( list.accepts(q) ) {
      // Create the list item
      $listitem = list.createListItemFor( q );
      
      // Item holds it's object in owlObj!!!
      $listitem.get(0).owlObj = q;

      // Specify, what to do when accessing the resource
      // - this method should make us aware, what we're doing
      // - we will create selector for selected Resource by using aardwark
      // - we will then edit the selector so that it matches our needs
      // - this should also show the "scenario" view of selectowl
      $listitem.click(list.item_onClick);
      //TODO replace this with tree onSelected method !!!

      $list.append($listitem);
    }
  } 
}


