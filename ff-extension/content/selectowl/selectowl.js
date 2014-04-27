
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
selectowl.prefixes = {};

selectowl.feedMee = function () {
  // index is a hashmap from URI to jOWL Ontology object representing the resource
  // sometimes the URI is shortened when base-namespace is present
  // 
  // we use full URI to reference everything here.. in our inner repre this.model
  var index = jOWL.index('ID');
  var m = selectowl.model;
  var r, el, my;

  var ns = jOWL.NS;
  for ( p in ns ) {
    p = ns[p];
    if (p.URI && p.prefix) {
      selectowl.prefixes[p.URI] = p.prefix;
    }
  }

  for ( r in index ) {
    el = index[r];
    my = {};
    my.baseURI = el.baseURI
    my.URI = el.URI;
    my.type = el.type;
    my.name = el.name;
    my.isProperty = el.isProperty;
    my.prefix = selectowl.prefixes[el.URI] ? selectowl.prefixes[el.URI] : ""; //TODO better unknow prefix handling - move this to function
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
        var $item = $('<listitem />');
        var $cell;

        $cell = $('<listcell />');
        $cell.attr('label', item.prefix);
        $item.append($cell);

        $cell = $('<listcell />');
        $cell.attr('label', item.name);
        $item.append($cell);

        $cell = $('<listcell />');
        $cell.attr('label', item.type);
        $item.append($cell);

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
        var $item = $('<listitem />');
        var $cell;

        $cell = $('<listcell />');
        $cell.attr('label', item.prefix);
        $item.append($cell);

        $cell = $('<listcell />');
        $cell.attr('label', item.name);
        $item.append($cell);

        $cell = $('<listcell />');
        $cell.attr('label', item.domain);
        $item.append($cell);

        $cell = $('<listcell />');
        $cell.attr('label', item.range);
        $item.append($cell);

        $cell = $('<listcell />');
        $cell.attr('label', item.type);
        $item.append($cell);

        return $item;
      }, 
    }
  ];

  // go, go, go!
  var l;
  for ( l in lists ) {
    selectowl.refreshList(lists[l]);
  }

}


selectowl.refreshList = function( list ) {
  var $list = $(list.id);
  var idx = selectowl.model;
  var $listitem;
  var p, q, prefix;

  $list.remove('listitem');

  for ( p in idx ) {
    q = idx[p];
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

      $list.append($listitem);
    }
  } 
}


