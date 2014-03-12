const SELECTOWL_ID = "selectowl@kub1x.org";
 
function initializeSelectowlObserver() {
    selectowlObserver.register();
}
 
var selectowlObserver = {
    _uninstall : false,
    observe : function(subject, topic, data) {
        if (topic == "em-action-requested") {
            subject.QueryInterface(Components.interfaces.nsIUpdateItem);
            if (subject.id == SELECTOWL_ID) {
                if (data == "item-uninstalled") {
                    this._uninstall = true;
                } else if (data == "item-disabled") {
                    this._uninstall = true;
                } else if (data == "item-cancel-action") {
                    this._uninstall = false;
                }
            }
        } else if (topic == "quit-application-granted") {
            if (this._uninstall) {
              // your uninstall stuff goes here
 
              // this section removes the extension we added
              var branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.selenium-ide.");
              var current_ppue = branch.getCharPref("pluginProvidedUserExtensions");
              if (typeof current_ppue != "undefined") {
                // need one 'if' block like below for each one you added
                  if (current_ppue.search("chrome://selectowl/content/extensions/extension-random.js") != -1) {
                      branch.setCharPref("pluginProvidedUserExtensions", current_ppue.replace("chrome://selectowl/content/extensions/extension-random.js", ""));
                  }
              }

              // Remove formater
              var current_ppf = branch.getCharPref("pluginProvidedFormatters");
              if (typeof current_ppf != "undefined") {
                  var split_ppf = current_ppf.split(",");
                  for (var ppf = 0; ppf < split_ppf.length; ppf++) {
                      if (split_ppf[ppf].search("chrome://selectowl/content/formats/selectowl-formatter.js") != -1) {
                          branch.setCharPref("pluginProvidedFormatters", current_ppf.replace(split_ppf[ppf], ""));
                      }
                  }
              }

            }
            this.unregister();
        }
    },
    register : function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"].     getService(Components.interfaces.nsIObserverService);
        observerService.addObserver(this, "em-action-requested", false);
        observerService.addObserver(this, "quit-application-granted", false);
    },
    unregister : function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"].      getService(Components.interfaces.nsIObserverService);
        observerService.removeObserver(this,"em-action-requested");
        observerService.removeObserver(this, "quit-application-granted");
    }
}
 
window.addEventListener("load", initializeSelectowlObserver, false);
