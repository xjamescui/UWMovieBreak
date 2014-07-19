function uw_MB(userid, htmlId) {
  "use strict";
  var templates = {};

  var model = {
    views: [],
    movies: {},
    genres: [],
    api_key: 'd0efc3a192023191b83b6e59746f3399',

    /**
     *  Add a new view to be notified when the model changes.
     */
    addView: function(view) {
      this.views.push(view);
      view("");
    },

    /**
     *  Update all of the views that are observing us.
     */
    updateViews: function(msg) {
      var i = 0;
      for (i = 0; i < this.views.length; i++) {
        this.views[i](msg);
      }
    },

    /**
     * genres data format: array of objects in the form of { id:int, name:string }
     *
     */
    loadGenreData: function() {
      var that = this;
      $.getJSON("http://private-af6af-themoviedb.apiary-proxy.com/3/genre/movie/list?api_key=" + that.api_key,
        function() {})
        .fail(function() {
          console.log("error trying to get genres");
        })
        .done(function(data) {
          that.genres = data.genres;
          //update View
          that.updateViews("search");
        });
    },

    /**
     *  movies data format: array of objects with fields: title:string, vote_average:number, vote_count:int, release_date:date, poster_path:string
     *
     */
    loadMoviesData: function(genre_id, min_score, release_date_min) {
      var that = this;

      // params setup
      var params = {
        'api_key': that.api_key,
        'vote_count.gte': 1000,
        'vote_average.gte': min_score,
        'with_genres': genre_id,
        'language': 'en',
        'sort_by': 'vote_average.desc',
        'release_date.gte': release_date_min //YYYY-MM-DD
      }
      var url = "http://private-af6af-themoviedb.apiary-proxy.com/3/discover/movie?" + $.param(params);
      console.log('url: ' + url);

      $.getJSON(url, function() {})
        .fail(function() {
          console.log("error trying to get movies");
        })
        .done(function(data) {
          that.movies = data.results;
          console.log('array size: ' + that.movies.length);
        });
    },

    /**
     *   movie detail data format:
     *  //TODO
     */
    loadMovieDetailData: function(movie_id) {
      var that = this;
      $.getJSON("",
        function() {})
        .fail(function() {
          console.log("error trying to fetch movie detail for movie_id: " + movie + id)
        })
        .done(function(data) {

        });
    }
  };

  // View for search
  var searchView = {
    // Update our view
    updateView: function(msg){
      var t = "";
      if (msg === "error") {
        t = templates.error;
      } else if (msg === "search"){
        var t = Mustache.render(templates.search, model);
        $("#uw_MB_content").html(t);
      }
    },

    initView: function () {
      console.log("Initializing uw_MB_searchView");

      /*
       *  We want to initialize our search view here to begin with.
       */
      var t = Mustache.render(templates.search, model.genres);
      $("#uw_MB_content").html(t);

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

        model.addView(searchView.updateView);
        model.loadGenreData();
      });
}
