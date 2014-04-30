
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
          !this.prefixes.contains(p.uri) &&
          !this.prefixes.contains(p.prefix)) {
      this.prefixes.add(p.prefix, p.URI);
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
    my.prefix = this.prefixes.uri2prefix(el.baseURI) || this.prefixes.guessPrefix(el.baseURI);

    if ( el.isProperty ) {
      my.domain = el.domain;
      my.range = el.range;
      this.properties.add(my);
    } else {
      this.classes.add(my);
    }
  } 
}



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
  rg_last_word = /[a-zA-Z-_]+(?=[^a-zA-Z-_]*$)/;
  prefix = uri.match(rg_last_word);
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
  this._byUri[obj.baseURI] = obj;
}

selectowl.ontology.classes.getLength = function () {
  return this._byIdx.length;
}

selectowl.ontology.classes.get = function ( idx ) {
  return this._byIdx[idx];
}

/************************************************************
 *                                                          *
 ************************************************************/

selectowl.ontology.properties._byIdx = [];
selectowl.ontology.properties._byUri = {};
selectowl.ontology.properties.add = function ( obj ) {
  this._byIdx.push(obj);
  this._byUri[obj.baseURI] = obj;
}

selectowl.ontology.properties.getLength = function () {
  return this._byIdx.length;
}

selectowl.ontology.properties.get = function ( idx ) {
  return this._byIdx[idx];
}



