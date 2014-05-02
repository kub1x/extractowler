
selectowl.scenario.tree.TreeStep = function (step, context) {
  this.step = step;
  if(context) {
    this.level = context.level + 1;
    //this.parent = context;
  }

};

selectowl.scenario.tree.TreeStep.prototype = {
  step : null, 
  level : 0, 
  //parent : null, ! nope !
  //children : [], ! nope !

  getLevel: function() { return this.level; }, 
};

// See: scenario.tree itself acts like a TreeStep
//           scenario itself acts like a Step
selectowl.scenario.tree.step = selectowl.scenario;
selectowl.scenario.tree.level = -1;


/************************************************************
 *                                                          *
 ************************************************************/

selectowl.scenario.tree._byIdx = [];

selectowl.scenario.tree.get = function(idx) {
  return this._byIdx[idx];
}


selectowl.scenario.tree.createNewStep = function( resource, selector ) {
  // obtain context
  var context = this.getSelected();

  // Grab scenario.step outa context
  var ss_context = null;
  if (context) ss_context = context.step;

  // Create selectowl.scenario.step for given context
  var ss = selectowl.scenario.createStep(resource, selector, ss_context);  

  //XXX done by scenario.createStep already
  // Add scenario.step into scenario
  //selectowl.scenario.addStep(ss, context);

  // Create TreeStep
  var ts = new this.TreeStep(ss, context);

  // Add TreeStep into tree
  var idx = this.getCurrentIndex();
  if (idx == -1) this._byIdx.push(ts);
  else { this._byIdx.splice(idx, 0, ts); }

  // Update tree length etc
  this.rowCount = this.getLength();

  // Mark the newly created step as current
  //TODO

  // Refresh view
  selectowl.gui.refreshScenarionTree();

  return ts;
}

//DEPRECATED - we'll use createNewStep as the tree itself keeps track of context (selected item)
//selectowl.scenario.tree.appendChild = function( step, context ) {
//  // Create a child step
//  if (!context) {
//    
//  } else {
//  }
//}

selectowl.scenario.tree.refreshTree = function( steps ) {
  // Recursively rebuild _byIdx array
}

selectowl.scenario.tree.getLength = function( ) {
  return this._byIdx.length;
}



/************************************************************
 * Selection                                                *
 ************************************************************/

selectowl.scenario.tree.getSelected = function( ) {
  return this._byIdx[this.getCurrentIndex()] || this;
}

selectowl.scenario.tree.getCurrentIndex = function( ) {
  var tree = this.getTreeElement();
  return tree.currentIndex;
}



/************************************************************
 * Tree                                                     *
 ************************************************************/

selectowl.scenario.tree.getTreeElement = function () {
  return $('#selectowl-scenario-tree').get(0);
}

/************************************************************
 * nsITreeView implementation                               *
 ************************************************************/

selectowl.scenario.tree.getLevel = function(row) {
  if (row < 0 || row > this.rowCount) return NaN;
  return this._byIdx[row].getLevel();
};

selectowl.scenario.tree.hasNextSibling = function(row, afterIndex) {
  var lvl = this.getLevel(row);
  var i, l;
  for ( i = row + 1; i < this.rowCount ; i++ ) {
    l = this.getLevel(i);
    if ( l == lvl ) { return true;  }
    if ( l <  lvl ) { return false; }
  }
  return false;
};

selectowl.scenario.tree.getParentIndex = function(row) {
  var lvl = this.getLevel(row);
  var i;
  for ( i = row - 1; i >= 0 ; i-- ) {
    if( this.getLevel(i) == lvl-1  ) { return i; }
  }
  throw 'no parent found for row: ' + row;
};

selectowl.scenario.tree.isContainer = function(row) {
  return true;
};

selectowl.scenario.tree.isContainerEmpty = function(row) {
  return ( this.getLevel(row)+1 == this.getLevel(row+1) );
};

selectowl.scenario.tree.isContainerOpen = function(row) {
  return true;
};

selectowl.scenario.tree.toggleOpenState = function(row) {
  // We don't support collapsing just now...
  return;
};

selectowl.scenario.tree.getCellText = function(row, column){
  if (column.id == 'scenario-resource-col' ) { return this.get(row).step.resource; } 
  if (column.id == 'scenario-selector-col' ) { return this.get(row).step.selector; } 
};

//selectowl.scenario.tree.setCellText = function(row, col, value) {
//  if (column.id == 'scenario-resource-col' ) { this.get(row).name   = value; } 
//  if (column.id == 'scenario-selector-col' ) { this.get(row).type   = value; } 
//}; 

