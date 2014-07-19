function uw_MB(userid, htmlId) {
  "use strict";
  var templates = {};


  // View for search
  var searchView = {
    // Update our view
    updateView: function(msg){
      var t = "";
      if (msg === "error") {
        t = templates.error;
      } else if (msg === "search"){
        $("#uw_MB_content").html(templates.search);
      }
    },

    initView: function () {
      console.log("Initializing uw_MB_searchView");

      /*
       *  We want to initialize our search view here to begin with.
       */
      $("#uw_MB_content").html(templates.search);

      /*
       * Now we want to set the controller for the search button
       * Get the input fields for searching and tell the model
       * to get the corresponding movie results.
       */
      $("#uw_MB_searchButton").click(function (){
        // Gather our variables
        var genre = $("#uw_MB_genre").val();
        var releaseDate = $("#uw_MB_releaseDate").val();
        console.log("Genre: " + genre + " Release: " + releaseDate);
      });
    }
  };

  // Initialize our widget
  console.log("Initializing uw_MB(" + userid + ", " + htmlId + ")");
  portal.loadTemplates("widgets/uw_MB/templates.json",
      function (t) {
        templates = t;
        $(htmlId).html(templates.baseHtml);
        searchView.initView();
      });
}
