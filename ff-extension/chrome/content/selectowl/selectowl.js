/************************************************************
 *                                                          *
 ************************************************************/

var selectowl = {
  EDITOR: "selectowl-editor",
  AREA: "selectowl-area",
  NAME: "selectowl-name",
  URL: "selectowl-url",
  READ: "selectowl-read",
  USE: "selectowl-use",
  ATTACH: "selectowl-attach",
  TAGNAME: "selectowl-tagname",
  ID: "selectowl-id",
  IDTYPE: "selectowl-idtype",
  CLASS: "selectowl-classes",
  CONTENT: "selectowl-contains",
  POS: "selectowl-position",
  ATTR: "selectowl-attributes",
  CUSTOM: "selectowl-custom",
  TREE: "selectowl-tree",

  aardvark : {
    _parent: null,
  }, 

  gui : {
    CURRENT_STEP_CLASS : "current-step",
    WORKFLOW_LINK_PREFIX : 'wf-link-',
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

// definice zpětných referencí v jednotlivých podřízených objektech

selectowl.aardvark._parent = selectowl;
selectowl.gui._parent = selectowl;

//------------------------------------------------------------

selectowl.ns = {
  get filePicker() {
    return Components.classes["@mozilla.org/filepicker;1"]
      .createInstance(Components.interfaces.nsIFilePicker);
  },
  get fileOutputStream() {
    return Components.classes["@mozilla.org/network/file-output-stream;1"]
      .createInstance(Components.interfaces.nsIFileOutputStream); 
  },
  get converterOutputStream() {
    return Components.classes["@mozilla.org/intl/converter-output-stream;1"]
      .createInstance(Components.interfaces.nsIConverterOutputStream); 
  }, 
  get scriptableUnicodeConverter() {
    return Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
      .createInstance(Components.interfaces.nsIScriptableUnicodeConverter); 
  }, 
  get process() {
    return Components.classes["@mozilla.org/process/util;1"]
      .createInstance(Components.interfaces.nsIProcess); 
  },
};

//------------------------------------------------------------

selectowl.init = function () {
  selectowl.gui.init();
};

selectowl.newScenario = function () {
  selectowl.gui.init();
};

selectowl.load = function (url) {
  if (!url) { url =  $('#ontology-url').val(); }

  if (!url) { throw "empty url, nothing to load"; }

  //TODO call assynchronously, show 'loading...', etc. 
  // use setTimer()
  
  // Call load on jOWL and refresh after
  var callback = function () {
    selectowl.ontology.feedMee();
    selectowl.gui.refreshAllTrees();
  };

  jOWL.load(url, callback, {reason: true, locale: 'en'});
};

selectowl.openPage = function (url) {
  contentWindow = aardvarkUtils.currentBrowser().contentWindow; 
  contentWindow.location = url;
};


//------------------------------------------------------------


//XXX DEPRECATED
//selectowl.getJson = function() {
//  var res = {};
//
//  // Obtain URL from current open tab...
//  contentWindow = aardvarkUtils.currentBrowser().contentWindow; 
//  res.url = contentWindow.location.toString();
//
//  //TODO see what we need from the ontology deffinitions: 
//
//  //res.classes = selectowl.ontology.classes._byIdx;
//  //res.properties = selectowl.ontology.properties._byIdx;
//  res.steps = selectowl.scenario._steps;
//
//  return JSON.stringify(res);
//};

selectowl.serialize = function() {

};

selectowl.getXml = function() {
};

//------------------------------------------------------------

selectowl.parseAndSave = function() {
  this.save(this.serialize()); 
};

selectowl.save = function(data) {
  var file = selectowl.filePicker( {
      topic: "Save scenario...",
      //defaultExtension: "json", 
      defaultExtension: "xml", 
      defaultString: "scenario.json", 
      filter: ["SelectOWL scenario", "*.json"], 
  }, function (file) {
    if (file) {
      selectowl.writeData(file, data);
    } else {
      // Do nothing...
    }
  });
};

selectowl.filePicker = function( options, callback ) {
  var filePicker = selectowl.ns.filePicker;

  filePicker.init(window, options.topic, Components.interfaces.nsIFilePicker.modeSave);

  filePicker.defaultExtension = options.defaultExtension;
  filePicker.defaultString = options.defaultString;

  var filter = options.filter;
  filePicker.appendFilter(filter[0], filter[1]);
  filePicker.appendFilters(0x01);

  // Blocking
  var ret = filePicker.show();
  var OK = 0, CANCEL = 1, REPLACE = 2;
  if (ret != CANCEL) {
    callback(filePicker.file);
  } else {
    callback(null);
  }
  
  //TODO might want to use asynchronous 
  // filePicker.open( callback );
  // instead.. just not documented yet. See: 
  // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker#open%28%29
  // https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIFilePickerShownCallback

};

selectowl.writeData = function(file, data) {
  var foStream = selectowl.ns.fileOutputStream;
  foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);

  var converterOutputStream = selectowl.ns.converterOutputStream;
  converterOutputStream.init(foStream, "UTF-8", 0, 0);
  converterOutputStream.writeString(data);
  converterOutputStream.close();
};


//------------------------------------------------------------

//TODO JUST_TESTING DELME
//selectowl.justRunCrowler = function () {
//  Components.utils.import("resource://gre/modules/FileUtils.jsm");
//
//  var java_path = selectowl.getCharPref("java_path");
//  var java_file = new FileUtils.File(java_path);
//
//  var sfile = this.getNsiFile("crowler/scenario.json");
//
//  var crowler_path = selectowl.getCharPref("crowler_path");
//  var xfile = new FileUtils.File(crowler_path);
//
//  //var args = [];
//  //var args = [ "cz.sio2.crowler.configurations.json.JsonConfiguration file results " + sfile.path ];
//  var args = [ '-jar', xfile.path, "cz.sio2.crowler.configurations.json.JsonConfiguration", "file", "results", sfile.path ];
//
//  console.log('just running exe: ' + java_file.path + ' with arguments:' + '\n  ' + args.join('\n  ') );
//
//  var process = selectowl.ns.process;
//  process.init(java_file);
//  var ret = process.run(false, args, args.length);
//
//  console.log('just finished running with ret: ' + ret);
//};

selectowl.runCrowler = function () {
  Components.utils.import("resource://gre/modules/NetUtil.jsm");
  Components.utils.import("resource://gre/modules/FileUtils.jsm");

  var java_path = selectowl.getCharPref("java_path");
  var java_file = new FileUtils.File(java_path);

  var crowler_path = selectowl.getCharPref("crowler_path");
  var crowler_file = new FileUtils.File(crowler_path);

  console.log('crowler path: ' + crowler_path); //TODO DEBUG DELME

  var scenario_file = crowler_file.parent.clone();
  scenario_file.append('scenario.json');

  console.log('scenario path: ' + scenario_file.path); //TODO DEBUG DELME

  var data = this.serialize();

  var ostream = FileUtils.openSafeFileOutputStream(scenario_file)
  var converter = selectowl.ns.scriptableUnicodeConverter;
  converter.charset = "UTF-8";

  var istream = converter.convertToInputStream(data);
  
  // Write data into scenario
  NetUtil.asyncCopy(istream, ostream, function(status) {
    if (!Components.isSuccessCode(status)) {
      // Handle error!
      console.log('asyncCopy scrued up with status:\n' + status);
      return;
    }

    var args = [ '-jar', crowler_file.path, "cz.sio2.crowler.configurations.json.JsonConfiguration", "file", "results", scenario_file.parent.path ];
    var process = selectowl.ns.process;
    process.init(java_file);

    console.log('running exe: ' + java_file.path + ' with arguments:' + '\n  ' + args.join('\n  ') ); //TODO DEBUG DELME

    process.run(false, args, args.length);

    console.log('finished running'); //TODO DEBUG DELME
  });
  
};

//TODO DEPRECATED DELME
//selectowl.getNsiFile = function( arPath ) {
//  if ( typeof arPath == 'string' ) {
//    arPath = arPath.split('/');
//  }
//  
//  var file = Components.classes["@mozilla.org/file/directory_service;1"]
//             .getService(Components.interfaces.nsIProperties)
//             .get("ProfD", Components.interfaces.nsILocalFile); // get profile folder
//  file.append("extensions");             // extensions sub-directory
//  file.append("selectowl@kub1x.org");    // GUID of your extension
//
//  for (var i = 0; i < arPath.length; i++){
//    file.append(arPath[i]);
//  }
//  return file;
//};

selectowl.getCharPref = function( pref ) {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"]
              .getService(Components.interfaces.nsIPrefService);
  prefs = prefs.getBranch("extensions.selectowl.");
  return prefs.getCharPref(pref);
};
