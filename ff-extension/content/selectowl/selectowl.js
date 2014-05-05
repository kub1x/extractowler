
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
//selectowl.gui._parent = selectowl;
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
