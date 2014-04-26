
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
    selectowl.feedMee(jOWL.index('ID'));
    selectowl.refreshList();
    selectowl.gui.showStep('select-action');
  };

  jOWL.load(url, callback, {reason: true, locale: 'en'});
}


selectowl.model = {}; //XXX !!!

selectowl.feedMee = function( index ) {
  // index is a hashmap from URI to jOWL Ontology object representing the resource
  // sometimes the URI is shortened when base-namespace is present
  // 
  // we use full URI to reference everything here.. in our inner repre this.model
  var m = selectowl.model;
  var r, el, my;
  for ( r in index ) {
    el = index[r];
    my = {};
    my.URI = el.URI;
    my.type = el.type;
    my.name = el.name;
    my.isProperty = el.isProperty;
    if ( el.isProperty ) {
      my.domain = el.domain;
      my.range = el.range;
    }
    //TODO FINISH THIS
    m[my.URI] = my;
  } 
}




selectowl.refreshList = function() {

  var onClick_listItem = function ( event ) {
    var owlObj = event.target.owlObj;
    selectowl.workflow['select-object'].selected = owlObj;
    selectowl.aardvark.start();
  }
  
  var list = $('#ontology-objects-list');
  //var list = $('#ontology-resources-list');
  var idx = selectowl.model;
  var $listitem;
  var p, q;

  list.empty();

  for ( p in idx ) {
    q = idx[p];
    if ( !q.isProperty ) {
      // create listitem tag with all the functionality ;)
      $listitem = $('<listitem />');
      $listitem.attr('label', q.name + '[' + q.type + ']');
      //$listitem.val(q.name + '[' + q.type + ']');
      $listitem.get(0).owlObj = q;
      $listitem.click(onClick_listItem);
      // crate a list for it
      list.append($listitem);
      //t += p + ": " + idx[p] + '\n';
    }
  } 

  //-------------------------------------------------------

  var onClick_listItem = function ( event ) {
    var owlObj = event.target.owlObj;
    selectowl.workflow['select-objprop'].selected = owlObj;
    selectowl.aardvark.start();
  }
  
  var list = $('#ontology-objprops-list');
  var idx = selectowl.model;
  var $listitem;
  var p, q;

  list.empty();

  for ( p in idx ) {
    q = idx[p];
    if (q.isProperty) { // && q.domain && q.domain == domenaTohoVybranehoObjektu ) {
      // create listitem tag with all the functionality ;)
      $listitem = $('<listitem />');
      $listitem.attr('label', q.name + '[' + q.type + ']');
      //$listitem.val(q.name + '[' + q.type + ']');
      $listitem.get(0).owlObj = q;
      $listitem.click(onClick_listItem);
      // crate a list for it
      list.append($listitem);
      //t += p + ": " + idx[p] + '\n';
    }
  } 
}


