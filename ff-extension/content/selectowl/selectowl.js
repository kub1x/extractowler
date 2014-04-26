
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
    //selectowl.feedMee(jOWL.index('ID'));
    selectowl.refreshList();
    selectowl.gui.showStep('select-action');
  };

  jOWL.load(url, callback, {reason: true, locale: 'en'});
}


selectowl.refreshList = function() {

  var onClick_listItem = function ( event ) {
    var owlObj = event.target.owlObj;
    selectowl.workflow['select-object'].selected = owlObj;
    selectowl.aardvark.start();
  }
  
  var list = $('#ontology-objects-list');
  //var list = $('#ontology-resources-list');
  var idx = jOWL.index('ID');
  var $listitem;
  var p, q;

  list.empty();

  for ( p in idx ) {
    q = idx[p];
    if ("rdfs:Class" == q.type || "owl:Class" == q.type) {
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
  var idx = jOWL.index('ID');
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


