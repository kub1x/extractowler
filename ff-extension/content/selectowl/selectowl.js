
/************************************************************
 *                                                          *
 ************************************************************/
//var selectowl = {
//    // === KONSTANTY === //
//    EDITOR: "selectowl-editor",
//    AREA: "selectowl-area",
//    NAME: "selectowl-name",
//    URL: "selectowl-url",
//    READ: "selectowl-read",
//    USE: "selectowl-use",
//    ATTACH: "selectowl-attach",
//    TAGNAME: "selectowl-tagname",
//    ID: "selectowl-id",
//    IDTYPE: "selectowl-idtype",
//    CLASS: "selectowl-classes",
//    CONTENT: "selectowl-contains",
//    POS: "selectowl-position",
//    ATTR: "selectowl-attributes",
//    CUSTOM: "selectowl-custom",
//    TREE: "selectowl-tree",
//    // === OBJEKTY === //
//    aardvark: {
//        _parent: null,
//        selectors: null
//    },
//    editor: {
//        _parent: null,
//        name: {
//            _parent: null
//        },
//        area: {
//            _parent: null,
//            selectionStart: 0,
//            selectionEnd: 0
//        },
//        url: {
//            _parent: null
//        },
//        read: {
//            _parent: null
//        },
//        widgetUse: {
//            _parent: null
//        },
//        attach: {
//            _parent: null
//        },
//        widgetTagName: {
//            _parent: null
//        },
//        widgetId: {
//            _parent: null
//        },
//        widgetClass: {
//            _parent: null
//        },
//        widgetPos: {
//            _parent: null
//        },
//        widgetContent: {
//            _parent: null
//        },
//        widgetAttr: {
//            _parent: null
//        },
//        widgetCustom: {
//            _parent: null
//        }
//    },
//    extractor: {
//        _parent: null
//    },
//    file: {
//        _parent: null
//    },
//    gui: {
//        SELECT: "select",
//        DEF: "def",
//        URL: "url",
//        _parent: null,
//        borderElems: new Array(),
//        area: "select",
//        editing: "select",
//        path: new Array()
//    },
//    tree: {
//        _parent: null,
//        title: "",
//        delay: 1000,
//        def: { },
//        url: "",
//        select: { }
//    }
//}



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

  editor: {
    _parent: null,
    name: {
        _parent: null
    },
    area: {
        _parent: null,
        selectionStart: 0,
        selectionEnd: 0
    },
    url: {
        _parent: null
    },
    read: {
        _parent: null
    },
    widgetUse: {
        _parent: null
    },
    attach: {
        _parent: null
    },
    widgetTagName: {
        _parent: null
    },
    widgetId: {
        _parent: null
    },
    widgetClass: {
        _parent: null
    },
    widgetPos: {
        _parent: null
    },
    widgetContent: {
        _parent: null
    },
    widgetAttr: {
        _parent: null
    },
    widgetCustom: {
        _parent: null
    }
  },

};

// definice zpětných referencí v jednotlivých podřízených objektech

//selectowl.aardvark._parent = selectowl;
selectowl.gui._parent = selectowl;
selectowl.editor._parent = selectowl;
selectowl.editor.name._parent = selectowl.editor;
selectowl.editor.area._parent = selectowl.editor;
selectowl.editor.url._parent = selectowl.editor;
selectowl.editor.read._parent = selectowl.editor;
selectowl.editor.widgetUse._parent = selectowl.editor;
selectowl.editor.attach._parent = selectowl.editor;
selectowl.editor.widgetTagName._parent = selectowl.editor;
selectowl.editor.widgetId._parent = selectowl.editor;
selectowl.editor.widgetClass._parent = selectowl.editor;
selectowl.editor.widgetPos._parent = selectowl.editor;
selectowl.editor.widgetContent._parent = selectowl.editor;
selectowl.editor.widgetAttr._parent = selectowl.editor;
selectowl.editor.widgetCustom._parent = selectowl.editor;
//selectowl.extractor._parent = selectowl;
//selectowl.file._parent = selectowl;
//selectowl.tree._parent = selectowl;

//------------------------------------------------------------

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


//------------------------------------------------------------


selectowl.getJson = function() {
  var res = {};

  // set url
  //
  contentWindow = aardvarkUtils.currentBrowser().contentWindow; 
  res.url = contentWindow.location.toString(); //aardvarkUtils.currentWindow().location;

  //res.classes = selectowl.ontology.classes._byIdx;
  //res.properties = selectowl.ontology.properties._byIdx;
  res.steps = selectowl.scenario._steps;
  return JSON.stringify(res);
};


//------------------------------------------------------------


selectowl.parseAndSave = function() {
  this.save(this.getJson()); 
  //TODO call crowler.jar
};


selectowl.save = function(data) {
  var file = selectowl.filePicker( {
      topic: "Save scenario...",
      defaultExtension: "json", 
      defaultString: "scenario.json", 
      filter: ["SelectOWL scenario", "*.json"], 
  }, function (file) {
    if (file) {
      selectowl.writeData(file, data);
    }
  });
};


selectowl.filePicker = function( options, callback ) {
  var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);

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
  }
  
  //TODO might want to use asynchronous 
  // filePicker.open( callback );
  // instead.. just not documented yet. 
  // see: 
  // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker#open%28%29
  // https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIFilePickerShownCallback

};


selectowl.writeData = function(file, data) {
  var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
  foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);

  var converterOutputStream = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
  converterOutputStream.init(foStream, "UTF-8", 0, 0);
  converterOutputStream.writeString(data);
  converterOutputStream.close();
};


//------------------------------------------------------------


selectowl.runCrowler = function () {
  Components.utils.import("resource://gre/modules/NetUtil.jsm");
  Components.utils.import("resource://gre/modules/FileUtils.jsm");

  var file = this.getNsiFile("crowler/scenario.json");
  var data = this.getJson();

  // You can also optionally pass a flags parameter here. It defaults to
  // FileUtils.MODE_WRONLY | FileUtils.MODE_CREATE | FileUtils.MODE_TRUNCATE;
  var ostream = FileUtils.openSafeFileOutputStream(file)
  var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
                  createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
  converter.charset = "UTF-8";

  var istream = converter.convertToInputStream(data);
  
  // The last argument (the callback) is optional.
  NetUtil.asyncCopy(istream, ostream, function(status) {
    if (!Components.isSuccessCode(status)) {
      // Handle error!
      console.log('asyncCopy scrued up with status:\n' + status);
      return;
    }
  
    // Data has been written to the file.
    // Run crOWLer
    var xfile = selectowl.getNsiFile("crowler/crowler.jar");
    var args = [ "cz.sio2.crowler.configurations.json.JsonConfiguration", "file", "results", "scenario.json" ];
    var process = Components.classes["@mozilla.org/process/util;1"]
                  .createInstance(Components.interfaces.nsIProcess);
    process.init(xfile);
    process.run(false, args, args.length);
  });
  
};

selectowl.getNsiFile = function( arPath ) {
  if ( typeof arPath == 'string' ) {
    arPath = arPath.split('/');
  }
  
  var file = Components.classes["@mozilla.org/file/directory_service;1"]
             .getService(Components.interfaces.nsIProperties)
             .get("ProfD", Components.interfaces.nsILocalFile); // get profile folder
  file.append("extensions");             // extensions sub-directory
  file.append("selectowl@kub1x.org");    // GUID of your extension

  for (var i = 0; i < arPath.length; i++){
    file.append(arPath[i]);
  }
  return file;
};
