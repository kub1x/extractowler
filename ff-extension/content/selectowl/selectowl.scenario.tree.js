
selectowl.scenario.tree.TreeStep = function (step, context) {
  this.level = 0;
  this.step = step;
  this.children = [];

  this.parent = context;

  if(context) {
    this.level = context.level + 1;
    context.children.push(this);
  }
};

selectowl.scenario.tree.TreeStep.prototype = {
  deleteChild : function (ts) {
    for (ch in this.children) {
      if (this.children[ch] == ts) {
        delete this.children[ch];
        return;
      }
    }
  },
  deleteSelf : function () {
    for (ch in this.children) {
      this.children[ch].deleteSelf();
    }
    if (this.parent) {
      this.parent.deleteChild(this);
    }
  },
}


/************************************************************
 *                                                          *
 ************************************************************/

selectowl.scenario.tree._byIdx = [];

// Last selected index (handled by gui)
selectowl.scenario.tree.lastIndex = -1;

// Note: scenario.tree itself acts like a TreeStep
//            scenario itself acts like a Step
selectowl.scenario.tree.step = selectowl.scenario;
selectowl.scenario.tree.level = -1;
//selectowl.scenario.tree.children = selectowl.scenario.tree._byIdx;


selectowl.scenario.tree.createNewStep = function( resource, selector ) {
  // obtain context TreeStep
  var ts_context = this.getSelected();

  // Grab scenario.step outa ts_context
  var ss_context = null;
  if (ts_context) ss_context = ts_context.step;

  // Create selectowl.scenario.step for given ss_context
  var ss = selectowl.scenario.createStep(resource, selector, ss_context);  

  // Create TreeStep
  var ts = new this.TreeStep(ss, ts_context);

  // Add TreeStep into tree
  var idx = this.currentIndex; // of the context
  if (idx == -1) { 
    // Just add to the floor
    this._byIdx.push(ts);
    // And (don't) select it
    //this.select(this.rowCount-1);
  } else {
    if (ts_context.isOpen) {
      // If it is open, we gotta add the new to the end of children manually
      
      // Find the place where to insert (just before next "same or smaller
      // level" row after context). 
      var i = this.findLastSubtreeRow(idx) + 1;

      // The variable i is pointing AT the index on which we'll insert 
      this._byIdx.splice(i, 0, ts);

      // Select the newly inserted row. Best not, it's confusing. 
      //this.select(i);

      if (this.treeBox) this.treeBox.rowCountChanged(i, 1);

    } else {
      // If the context isn't open, we should open it. The toggleOpenState will
      // fill the children in for us. 
      this.toggleOpenState(idx);
      // Note, since context is selected, all the parents of context have to be
      // open no matther what ;)

      //We don't select it as it only confuses the scenario creation, let's
      //keep it as it is. 
      //this.select(this.findLastSubtreeRow(idx));
    }
  }
  //if (this.treeBox) this.treeBox.invalidateRow(idx);

  // Refresh view
  selectowl.gui.refreshScenarionTree();
  if (this.treeBox) this.treeBox.invalidate();

  return ts;
}


/************************************************************
 * DOM and Selection                                        *
 ************************************************************/

selectowl.scenario.tree.get = function(idx) {
  return this._byIdx[idx];
}

selectowl.scenario.tree.getLength = function( ) {
  return this._byIdx.length;
}

selectowl.scenario.tree.getSelected = function( ) {
  return this._byIdx[this.currentIndex];
}

//TODO DELME - DEPRECATED
//selectowl.scenario.tree.getCurrentIndex = function( ) {
//  var tree = this.getTreeElement();
//  return tree.currentIndex;
//}

selectowl.scenario.tree.getTreeElement = function () {
  return $('#selectowl-scenario-tree').get(0);
}

selectowl.scenario.tree.select = function(row) {
  this.getTreeElement().view.selection.select(row);
}

selectowl.scenario.tree.clearSelection = function() {
  this.getTreeElement().view.selection.clearSelection();
}

selectowl.scenario.tree.findLastSubtreeRow = function(idx) {
  var level = this.getLevel(idx), l, i;
  for ( i = idx + 1; i < this.rowCount; i++ ) {
    l = this.getLevel(i);
    if ( l <= level ) { break; }
  }
  return i - 1;
} 

selectowl.scenario.tree.deleteCurrent = function() {
  var idx = this.currentIndex;

  // Nothing to delete
  if (idx == -1) return;

  this.deleteWithChildren(idx); 
};

selectowl.scenario.tree.deleteWithChildren = function(row) {
  var n = this.get(row);

  // Close it, so we don't have to delete the rows from view. 
  if (n.isOpen) {
    this.toggleOpenState(row);
  }

  // Recursive delete for all children.
  // Also calls parent.deleteChild(me);
  n.deleteSelf();

  // Delete the line...
  this._byIdx.splice(row, 1);

  selectowl.gui.refreshScenarionTree();

  delete n;
};

selectowl.scenario.tree.getColById = function(col_id){
  return $(this.getTreeElement).find('#scenario-' + col_id + '-col').get(0);
};

/************************************************************
 * nsITreeView implementation                               *
 ************************************************************/

selectowl.scenario.tree.__defineGetter__("rowCount", function() {
  return this.getLength();
});

selectowl.scenario.tree.__defineGetter__("view", function() {
  return this.getTreeElement().view;
});

selectowl.scenario.tree.__defineGetter__("columns", function() {
  return this.getTreeElement().columns;
});

selectowl.scenario.tree.__defineGetter__("currentIndex", function() {
  var tree = this.getTreeElement();
  return tree.currentIndex;
});

selectowl.scenario.tree.getLevel = function(row) {
  //console.log('returnign level for: ' + row + ' with value: ' + (row < 0 || row > this.rowCount) ? NaN : this._byIdx[row].level);
  if (row < 0 || row > this.rowCount) return NaN;
  return this.get(row).level;
};

selectowl.scenario.tree.hasNextSibling = function(row, afterIndex) {
  var lvl = this.getLevel(row);
  var i, l;
  for ( i = afterIndex + 1; i < this.rowCount ; i++ ) {
    l = this.getLevel(i);
    if ( l == NaN ) { return false; }
    if ( l == lvl ) { return true;  }
    if ( l <  lvl ) { return false; }
  }
  return false;
};

selectowl.scenario.tree.getParentIndex = function(row) {
  var lvl = this.getLevel(row);
  var i;
  for ( i = row - 1; i >= 0; i-- ) {
    if( this.getLevel(i) == lvl-1  ) { return i; }
  }
  throw 'no parent found for row: ' + row;
};

selectowl.scenario.tree.isContainer = function(row) {
  //return this.get(row).children.length; // 0 as false
  return true;
};

selectowl.scenario.tree.isContainerEmpty = function(row) {
  return !this.get(row).children.length; // 0 as false
};

selectowl.scenario.tree.isContainerOpen = function(row) {
  return this.get(row).isOpen;
};

selectowl.scenario.tree.toggleOpenState = function(row) {
  if (!this.isContainer(row)) return;

  var item = this.get(row);

  if (item.isOpen) {
    item.isOpen = false;

    if (!this.isContainerEmpty(row)) {
      var thisLevel = this.getLevel(row);
      var deletecount = 0;
      for (var t = row + 1; t < this.rowCount; t++) {
        if (this.getLevel(t) > thisLevel) deletecount++;
        else break;
      }

      if (deletecount) {
        this._byIdx.splice(row + 1, deletecount);
        if (this.treeBox) this.treeBox.rowCountChanged(row + 1, -deletecount);
      }
    }

  } else {
    item.isOpen = true;

    if (!this.isContainerEmpty(row)) {
      var toinsert = item.children;
      for (var i = 0; i < toinsert.length; i++) {
        this._byIdx.splice(row + i + 1, 0, toinsert[i]);
        toinsert[i].isOpen = false;
        //TODO fix this ^^^ ! If it was previously open, keep it open. 
        // something like this:
        // if(toinsert[i].isOpen) toinsert.splice(i+1, 0, toinsert[i].children);
      }

      if (this.treeBox) this.treeBox.rowCountChanged(row + 1, toinsert.length);
    }
  }

  if (this.treeBox) this.treeBox.invalidateRow(row);
};

selectowl.scenario.tree.getCellText = function(row, col){
  if (col.id == 'scenario-resource-col' ) { return this.get(row).step.resource; } 
  if (col.id == 'scenario-selector-col' ) { return this.get(row).step.selector; } 
};

selectowl.scenario.tree.setCellText = function(row, col, value) {
  if (col.id == 'scenario-resource-col' ) { this.get(row).step.resource = value; } 
  if (col.id == 'scenario-selector-col' ) { this.get(row).step.selector = value; } 
}; 

