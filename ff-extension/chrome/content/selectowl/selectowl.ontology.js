
/************************************************************
 *                                                          *
 ************************************************************/


selectowl.ontology.feedMee = function () {
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
    if (p.URI && p.prefix &&
          !this.prefixes.contains(p.URI) &&
          !this.prefixes.contains(p.prefix)) {
      this.prefixes.add(p.prefix, p.URI);
    }
  }

  console.log('loaded prefixes #' + this.prefixes._byIdx.length);

  // Fill Resources
  for ( r in index ) {
    el = index[r];
    my = {};
    my.baseURI = el.baseURI
    my.uri = el.URI; //XXX EVEN FOR URI, I USE ALL LOWERCASE IF I CAN...
    my.type = el.type;
    my.name = el.name;
    my.prefix = this.prefixes.uri2prefix(el.baseURI) || this.prefixes.guessPrefix(el.baseURI);

    if ( el.isProperty ) {
      my.isProperty = true;
      my.domain = el.domain;
      my.range = el.range;
      this.properties.add(my);
    } else {
      this.classes.add(my);
    }
  } 

  console.log('loaded classes #' + this.classes._byIdx.length);
  console.log('loaded properties #' + this.properties._byIdx.length);
}

selectowl.ontology.getByUri = function( uri ) {
  return this.classes.getByUri(uri) ||
         this.properties.getByUri(uri);
};

selectowl.ontology.prefixify = function (uri) {
  //TODO error handling
  var idx = uri.lastIndexOf('#');
  idx == (idx != -1) ? idx : uri.lastIndexOf('/');
  //NOTE +1 to include the '#' or '/' sign
  var base = uri.substring(0,idx+1);
  var name = uri.substring(idx);
  var prefix = selectowl.ontology.prefixes.getByUri(base);
  if (prefix == null) {
    prefix = this.prefixes.guessPrefix(uri);
  }
  return prefix + ':' + name;
};

selectowl.ontology.urify = function ( id ) {
  //TODO error handling
  var arr = id.split(':');
  var uri = this.prefixes.getByPrefix(arr[0]);
  return uri + arr[1];
};


/************************************************************
 *                                                          *
 ************************************************************/

selectowl.ontology.prefixes._byIdx = [];
selectowl.ontology.prefixes._byPfx = {};
selectowl.ontology.prefixes._byUri = {};

selectowl.ontology.prefixes.add = function ( prefix, uri ) {
  var o = {};
  o.prefix = prefix;
  o.uri = uri;
  this._byIdx.push(o);
  this._byUri[uri] = o;
  this._byPfx[prefix] = o;
}

selectowl.ontology.prefixes.get = function ( idx ) {
  return this._byIdx[idx];
}

selectowl.ontology.prefixes.getByPrefix = function ( prefix ) {
  return this._byPfx[prefix];
}

selectowl.ontology.prefixes.getByUri = function ( uri ) {
  return this._byUri[uri];
}

selectowl.ontology.prefixes.prefix2uri = function ( prefix ) {
  return this._byPfx[prefix].uri;
}

selectowl.ontology.prefixes.uri2prefix = function ( uri ) {
  return this._byUri[uri].prefix;
}

selectowl.ontology.prefixes.findIndex = function ( str ) {
  var i, o;
  for (i = 0; i <  this._byIdx.length; i++) {
    o = this._byIdx[i];
    if (o.prefix == str || o.uri == str) return i;
  }
  return -1;
}

selectowl.ontology.prefixes.contains = function ( str ) {
  return (this._byUri[str] != null || this._byPfx[str] != null);
}

selectowl.ontology.prefixes.guessPrefix = function ( uri ) {
  var rg_last_word = /[a-zA-Z-_]+(?=[^a-zA-Z-_]*$)/;
  var prefix = uri.match(rg_last_word);
  if(prefix) {
    this.add(prefix, uri);
    return prefix;
  }
  throw 'Can not guess prefix of URI: ' + uri;
}

selectowl.ontology.prefixes.getLength = function () {
  return this._byIdx.length;
}

selectowl.ontology.prefixes.delete = function ( prefix ) {
  uri = this.prefix2uri(prefix);
  idx = this.findIndex(prefix);
  delete this._byIdx[idx]; 
  delete this._byUri[uri];
  delete this._byPfx[prefix];
}


/************************************************************
 *                                                          *
 ************************************************************/

selectowl.ontology.classes._byIdx = [];
selectowl.ontology.classes._byUri = {};

selectowl.ontology.classes.add = function ( obj ) {
  this._byIdx.push(obj);
  this._byUri[obj.uri] = obj;
}

selectowl.ontology.classes.getLength = function () {
  return this._byIdx.length;
}

selectowl.ontology.classes.get = function ( idx ) {
  return this._byIdx[idx];
}

selectowl.ontology.classes.getByUri = function( uri ) {
  return this._byUri[uri];
}

/************************************************************
 *                                                          *
 ************************************************************/

selectowl.ontology.properties._byIdx = [];
selectowl.ontology.properties._byUri = {};

selectowl.ontology.properties.add = function ( obj ) {
  this._byIdx.push(obj);
  this._byUri[obj.uri] = obj;
}

selectowl.ontology.properties.getLength = function () {
  return this._byIdx.length;
}

selectowl.ontology.properties.get = function ( idx ) {
  return this._byIdx[idx];
}

selectowl.ontology.properties.getByUri = function( uri ) {
  return this._byUri[uri];
}

selectowl.ontology.properties.getShortened = function() {
  var res = [];
  for (var i in this._byIdx) {
    var p = this._byIdx[i];
    res.push(p.prefix + ':' + p.name);
  }
  return res;
};

selectowl.ontology.properties.getByShortened = function( shortened ) {
  var ar = shortened.split(':');
  var baseURI = selectowl.ontology.prefixes.prefix2uri(ar[0]);
  return this.getByUri(baseURI + ar[1]);
};
