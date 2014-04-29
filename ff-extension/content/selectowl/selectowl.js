
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
    selectowl.feedMee();
    selectowl.gui.refreshAllLists();
    //selectowl.gui.showStep('select-action');
  };

  jOWL.load(url, callback, {reason: true, locale: 'en'});
}


selectowl.model = {}; //XXX !!!
selectowl.prefixes = [];
selectowl.prefix2uri = function ( prefix ) {
  var p;
  var idx = selectowl.prefixes;
  for ( p in idx ) {
    p = idx[p];
    if (prefix == p.prefix) {
      return p.URI;
    }
  }
  return null;
}

selectowl.uri2prefix = function ( URI, guess ) {
  var p;
  var idx = selectowl.prefixes;
  for ( p in idx ) {
    p = idx[p];
    if (URI == p.URI) {
      return p.prefix;
    }
  }
  if (guess) {
    rg_last_word = /\w+(?=[^\w]*$)/g;
    prefix = URI.match(rg_last_word);
    if(prefix) {
      res = {};
      res.prefix = prefix;
      res.URI = URI;
      selectowl.prefixes.push(res); //TODO add method for pushing. 
      return prefix;
    }
  }
  return URI; //XXX if not found, return the URI back
}

selectowl.feedMee = function () {
  // index is a hashmap from URI to jOWL Ontology object representing the resource
  // sometimes the URI is shortened when base-namespace is present
  // 
  // we use full URI to reference everything here.. in our inner repre this.model
  var index = jOWL.index('ID');
  var m = selectowl.model;
  var r, el, my;

  // Fill prefixes
  var ns = jOWL.NS;
  for ( p in ns ) {
    p = ns[p];
    // Check if it's valid prefix and if we don't have it already
    if (p.URI && p.prefix && selectowl.uri2prefix(p.URI) == p.URI) {
      np = {};
      np.prefix = p.prefix;
      np.URI    = p.URI;
      selectowl.prefixes.push(np);
    }
  }

  // Fill Resources
  for ( r in index ) {
    el = index[r];
    my = {};
    my.baseURI = el.baseURI
    my.URI = el.URI;
    my.type = el.type;
    my.name = el.name;
    my.isProperty = el.isProperty;
    //TODO better unknow prefix handling - move this to function
    my.prefix = selectowl.uri2prefix(el.baseURI);
    if ( el.isProperty ) {
      my.domain = el.domain;
      my.range = el.range;
    }
    m[my.URI] = my;
  } 
}


