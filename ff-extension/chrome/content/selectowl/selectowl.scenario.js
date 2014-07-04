/************************************************************
 *                                                          *
 ************************************************************/

// The root of all evil ;)
selectowl.scenario._steps = [];

selectowl.scenario.createStep = function( stepType, parent ) {
  var s = new this[stepType]();
  if (parent) parent.addStep(s);
  else this.addStep(s);
  return s;
};

selectowl.scenario.addStep = function( step ) {
  this._steps.push(step);
};

selectowl.scenario.toJSON = function() {
  // add scenario settings
  // add steps
  
  //NOTE the returned value will be serialized
  //return JSON.stringify(this._steps, null, 2);
  
  return this._steps
};

/************************************************************
 *                                                          *
 ************************************************************/

selectowl.scenario.Step = function() {
  this.children = []; 
};

selectowl.scenario.Step.prototype = {

  addStep : function( step ) {
    this.children.push(step);
  }, 

  /* return name of everything that is not 'children' or function */
  getOwnFields: function() {
    var ret = [];
    for (var p in this) {
      if (this.hasOwnProperty(p) && p != 'children' && typeof(this[p]) != 'function') {
        ret.push(p);
      }
    }
    return ret;
  },

  //toJson: function() {
  //  var ret = "";
  //  var tmp = "";

  //  for (f in this.getOwnFields()) {
  //    ret +=
  //  }

  //  for (i in this.children) {
  //    tmp += this.children[i].toJson();
  //  }
  //  tmp.replace(/^(?=.+)/mg, '\t');

  //  return ret;
  //}

};

//--------------------------------------------------------------

selectowl.scenario.TemplateStep = function( ) {
  selectowl.scenario.Step.call(this);
  this.nodeName = 'template';
  this.mime = 'text/html';
};

selectowl.scenario.TemplateStep.prototype = $.extend(new selectowl.scenario.Step(), {
  getLabel: function() { return 'template '+'['+'name:'+this.name+', '+'mime: '+this.mime+']'; }, 
  allowedChildNodes: ['onto-elem', 'value-of', 'call-template'], 
});

//--------------------------------------------------------------

selectowl.scenario.CallTemplateStep = function( ) {
  selectowl.scenario.Step.call(this);
  this.nodeName = 'call-template';
  this.type = 'http/GET';
};

selectowl.scenario.CallTemplateStep.prototype = $.extend(new selectowl.scenario.Step(), {
  getLabel: function() { return 'call-template'+'['+'name:'+this.name+', '+'type: '+this.type+']'; }, 
  allowedChildNodes: ['value-of'], 
});

//--------------------------------------------------------------

selectowl.scenario.ValueOfStep = function( ) {
  selectowl.scenario.Step.call(this);
  this.nodeName = 'value-of';
  this.text = '';
  this.select = '';
  this.regexp = '';
  this.replace = '';
  this.property = '';
};

selectowl.scenario.ValueOfStep.prototype = $.extend(new selectowl.scenario.Step(), {
  getLabel: function() {
    return 'value-of [' + 
      (this.text ? 'text: ' + this.text : '') +
      (this.select ? 'select: ' + this.select : '') +
      (this.regexp ? 'regexp: ' + this.regexp : '') +
      (this.replace ? 'replace: ' + this.replace : '') +
      (this.property ? 'property: ' + this.property : '') + ']';
  }, 
  allowedChildNodes: [], // TODO: function 
});

//--------------------------------------------------------------

selectowl.scenario.OntoElemStep = function( ) {
  selectowl.scenario.Step.call(this);
  this.nodeName = 'onto-elem';
  this.rel = '';
  this.type = '';
  this.about = '';
};

selectowl.scenario.OntoElemStep.prototype = $.extend(new selectowl.scenario.Step(), {
  getLabel: function() {
    return 'onto-elem [' + 
      (this.rel ? 'rel: ' + this.rel : '') +
      (this.type ? 'type: ' + this.type : '') +
      (this.about ? 'about: ' + this.about : '') + ']';
  }, 
  allowedChildNodes: ['value-of', 'call-template'], // TODO: function, call-dom-template
});

