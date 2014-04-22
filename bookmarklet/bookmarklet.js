Selectowl = {};

Selectowl.load = function () {
  //alert('loading 2');
  if($('#selectowl-container').length == 0) {
    $('body').append('<div id="selectowl-container" style="position: fixed; background: rgba(255,255,255,0.5); top: 0; left: 0; width: 100%; height: 100%;" onclick="$(this).remove();"></div>')
  }
  debugger;
  $.ajax({ 
    url: 'http://localhost:8888/bookmarklet.html',
    type: 'GET', 
    dataType: 'html', 
//    complete: function( data, status, err ) {
//      $('#selectowl-container').html(data);
//    }
//    success: function( data, status, err ) {
//      $('#selectowl-container').html(data);
//    }
//  });
  }).done(function( data, status, err ) {
    $('#selectowl-container').html(data);
  }).fail(function( jqXHR, textStatus ) {
    alert( "Request failed: " + textStatus );
  });
}


//(function(){
  if(!window.jQuery) {
    //alert('loading 1a');
    var jq = document.createElement('script');
    jq.type = 'text/javascript';
    jq.src = '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js';
    jq.onload = Selectowl.load;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(jq);
  } else {
    //alert('loading 1b');
    Selectowl.load();
  }
//}());

