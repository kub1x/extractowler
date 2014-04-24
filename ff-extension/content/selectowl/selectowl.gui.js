
selectowl.gui.showStep = function (step_id ) {
  var $curr = $('.' + this.CURRENT_STEP_CLASS);
  var $next = $('#' + step_id);

  // hide current
  $curr.hide({ effect: "slide", "direction": "left" }, 500, function() {
    // then show next
    $next.show({ effect: "slide", "direction": "right" }, 500);
  });

  //// hide current
  //$curr.effect("slide", { "direction": "left", "mode": "hide" }, 500, function() {
  //  // then show next
  //  $next.effect("slide", { "direction": "right", "mode": "show" }, 500);
  //});

  $curr.removeClass(this.CURRENT_STEP_CLASS);
  $next.addClass(this.CURRENT_STEP_CLASS);
}
