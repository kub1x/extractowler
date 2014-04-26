
selectowl.gui.init = function () {
  selectowl.gui.populateWorkflow();
}

selectowl.gui.populateWorkflow = function () {
  // Create following structure: 
  //<hbox id="workflow">
  //  <label id="step-link-load-ontology"  value="Load Ontology" onclick="onStepLinkClick(event);" />
  //  <splitter />
  //  <label id="step-link-select-action"  value="Select Action" onclick="onStepLinkClick(event);" />
  //  <splitter />
  //  <vbox>
  //    <label id="step-link-select-object"  value="Select Object"          onclick="onStepLinkClick(event);" />
  //    <label id="step-link-select-objprop" value="Select Object Property" onclick="onStepLinkClick(event);" />
  //  </vbox>
  //</hbox>

  var onStepLinkClick = function( event ) {
    // Get group_id
    var $l = $(event.target);
    var id = $l.attr('id');
    var group_id = id.replace(selectowl.gui.WORKFLOW_LINK_PREFIX, '');
    // Select it
    selectowl.gui.showStep(group_id);
  }

  var $wf = $('hbox#workflow');
  var $groups = $('#main').children('groupbox');

  // Clear worflow menu
  $wf.empty();

  $groups.each( function(index, element) {
    debugger;
    var $grp = $(this);
    var $lab = $('<label />');
    // set label id
    $lab.attr('id', selectowl.gui.WORKFLOW_LINK_PREFIX + $grp.attr('id'));
    // set label text
    $lab.attr('value', $grp.children('caption').attr('label'));
    // show the active one
    if ( $grp.hasClass(selectowl.gui.CURRENT_STEP_CLASS) ) {
      $lab.addClass(selectowl.gui.CURRENT_STEP_CLASS);
    }
    // change active group on click
    $lab.click(onStepLinkClick);
    // actually add it
    $wf.append($lab);
  });


}

selectowl.gui.showStep = function (step_id ) {
  var $currgrp = $('groupbox' + '.' + selectowl.gui.CURRENT_STEP_CLASS);
  var $nextgrp = $('groupbox' + '#' + step_id);

  var $currlab = $('label' + '.' + selectowl.gui.CURRENT_STEP_CLASS);
  var $nextlab = $('label' + '#' + step_id);

  // Apply imediately for labels...
  $currlab.removeClass(selectowl.gui.CURRENT_STEP_CLASS);
  $nextlab.addClass(selectowl.gui.CURRENT_STEP_CLASS);

  // Apply imediately for groups
  $currgrp.removeClass(selectowl.gui.CURRENT_STEP_CLASS);
  $nextgrp.addClass(selectowl.gui.CURRENT_STEP_CLASS);

  // Start animation - hide current
  $currgrp.hide({ effect: "slide", "direction": "left" }, 500, function() {
    // Followed by - show next
    $nextgrp.show({ effect: "fade" }, 500);
  });

  //// hide current
  //$curr.effect("slide", { "direction": "left", "mode": "hide" }, 500, function() {
  //  // then show next
  //  $next.effect("slide", { "direction": "right", "mode": "show" }, 500);
  //});

}
