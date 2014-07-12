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
      if (this.hasOwnProperty(p) &&
          p != 'children' &&
          p != 'nodeName' &&
          typeof(this[p]) != 'function') {
        ret.push(p);
      }
    }
    return ret;
  },

  getLabel: function() {
    var tmp = [ ];
    var fields = this.getOwnFields();
    for (i in fields) {
      var field = fields[i];
      if(this[field] != '') {
        tmp.push(field + ': ' + this[field]);
      }
    }
    return this.nodeName.toUpperCase() + ' [' + tmp.join(', ') + ']';
  },

};

//--------------------------------------------------------------

selectowl.scenario.TemplateStep = function( ) {
  selectowl.scenario.Step.call(this);
  this.nodeName = 'template';
  this.name = '';
  this.mime = 'text/html';
};

selectowl.scenario.TemplateStep.prototype = $.extend(new selectowl.scenario.Step(), {
  allowedChildNodes: ['onto-elem', 'value-of', 'call-template'], 
});

//--------------------------------------------------------------

selectowl.scenario.CallTemplateStep = function( ) {
  selectowl.scenario.Step.call(this);
  this.nodeName = 'call-template';
  this.name = '';
  this.type = 'http/GET';
};

selectowl.scenario.CallTemplateStep.prototype = $.extend(new selectowl.scenario.Step(), {
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
  allowedChildNodes: [],
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
  allowedChildNodes: ['value-of', 'call-template'],
});

