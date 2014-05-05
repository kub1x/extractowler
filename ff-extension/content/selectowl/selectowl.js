
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

};


selectowl.init = function () {
  selectowl.gui.init();
  selectowl.load(); //TODO debug only - delete
};


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
};


selectowl.parseAndSave = function() {
  this.save(this.getJson()); 
  //TODO call crowler.jar
};


selectowl.save = function(data) {
  var fileChooser = Components.classes["@mozilla.org/filepicker;1"]
  .createInstance(Components.interfaces.nsIFilePicker);

  fileChooser.init(window, "Save scenario..", Components.interfaces.nsIFilePicker.modeSave);

  fileChooser.defaultExtension = "json";
  fileChooser.defaultString = "scenario.json";

  fileChooser.appendFilters(0x02);
  fileChooser.appendFilters(0x01);

  var fileBox = fileChooser.show();

  if (!fileBox) {
    var file = fileChooser.file;

    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
    createInstance(Components.interfaces.nsIFileOutputStream);

    foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);

    var converterOutputStream = Components.classes["@mozilla.org/intl/converter-output-stream;1"].

    createInstance(Components.interfaces.nsIConverterOutputStream);

    converterOutputStream.init(foStream, "UTF-8", 0, 0);
    converterOutputStream.writeString(data);
    converterOutputStream.close();
  }
};


selectowl.getJson = function() {
  var res = {};
  res.url = aardvarkUtils.currentWindow.location;
  res.classes = selectowl.ontology.classes._byIdx;
  res.properties = selectowl.ontology.properties._byIdx;
  res.steps = selectowl.scenario._steps;
  return JSON.stringify(res);
};
