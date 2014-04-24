

var selectowl = {
  aardvark : {
  }, 

  gui : {
    CURRENT_STEP_CLASS : "current-step"
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
    selectowl.gui.showStep('select-resource');
  };

  this.jOWL.load(url, callback, {reason: true, locale: 'en'});
}


selectowl.refreshList = function() {
  
  var showOnClick = function ( event ) {
    //TODO populate popup and show it on click on it or something 
    alert(event.target.owlObj);
  };

  var list = $('#ontology-resources-list');
  var idx = this.jOWL.index('ID');
  var $listitem;
  var p, q;

  list.empty();

  for ( p in idx ) {
    q = idx[p];
    // create listitem tag with all the functionality ;)
    $listitem = $('<listitem />');
    $listitem.attr('label', q.name + '[' + q.type + ']');
    //$listitem.val(q.name + '[' + q.type + ']');
    $listitem.get(0).owlObj = q;
    $listitem.click(showOnClick);
    // crate a list for it
    list.append($listitem);
    //t += p + ": " + idx[p] + '\n';
  } 

}

