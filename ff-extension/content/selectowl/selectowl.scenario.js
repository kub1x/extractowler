
/************************************************************
 *                                                          *
 ************************************************************/

// The root of all evil ;)
selectowl.scenario._steps = [];

selectowl.scenario.createStep = function( resource, selector, parent ) {
  var s = new this.Step( resource, selector, parent );
  return s;
}

selectowl.scenario.addStep = function( step ) {
  this._steps.push(step);
}


/************************************************************
 *                                                          *
 ************************************************************/

selectowl.scenario.Step = function( resource, selector, parent ) {
  this.resource = resource; // URI of the class or property the step represents
  this.selector = selector; // CSS selector
  this.parent = parent; //can be null
};

selectowl.scenario.Step.prototype = {
  parent : null, 

  resource : null, 

  selector : null, 

  children : [], 

  addStep : function( step ) {
    this.children.push(step);
  }, 

};



