
/************************************************************
 *                                                          *
 ************************************************************/


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
  }, 

  ontology : {
    prefixes : {},
    classes : {},
    properties : {},
  }, 

  scenario : {
    tree : {}, 
  }, 

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
    selectowl.ontology.feedMee();
    selectowl.gui.refreshAllTrees();
    //selectowl.gui.showStep('select-action');
  };

  jOWL.load(url, callback, {reason: true, locale: 'en'});
}

