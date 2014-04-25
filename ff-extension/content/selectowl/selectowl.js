

var selectowl = {
  aardvark : {
  }, 

  gui : {
    CURRENT_STEP_CLASS : "current-step"
  }, 

  workflow : {
    'select-object' : {
      selected : null,
    }
  }
}


selectowl.init = function () {
  this.jOWL = window.jOWL;
  this.load();
}


selectowl.load = function () {
  var url = 'http://xmlns.com/foaf/spec/index.rdf';
  //var url = $('#ontology-url').val();

  if (!url) throw "empty url, nothing to load";

  var callback = function () {
    selectowl.refreshList();
    selectowl.gui.showStep('select-action');
  };

  this.jOWL.load(url, callback, {reason: true, locale: 'en'});
}


selectowl.refreshList = function() {


  var onClick_listItem = function ( event ) {
    var owlObj = event.target.owlObj;
    selectowl.workflow['select-object'].selected = owlObj;
    selectowl.aardvark.start();
  }
  
  var list = $('#ontology-objects-list');
  //var list = $('#ontology-resources-list');
  var idx = this.jOWL.index('ID');
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

}


