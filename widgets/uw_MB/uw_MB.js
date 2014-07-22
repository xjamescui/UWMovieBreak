function uw_MB(userid, htmlId) {
  "use strict";
  var templates = {};

  var model = {
    views: [],
    movies: {},
    movie: {},
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
          that.updateViews("search");
        });
    },

    /*
       movies data format: array of objects with fields:
       id: int,
       title:string,
       vote_average:number,
       vote_count:int,
       release_date:date,
       poster_path:string
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
      var url = "https://api.themoviedb.org/3/discover/movie?" + $.param(params);
      console.log('url: ' + url);

      $.getJSON(url, function() {})
        .fail(function() {
          console.log("error trying to get movies");
        })
        .done(function(data) {
          that.movies = data.results;
          that.updateViews("results");
        });
    },

    /*
       movie detail data format:
       runtime: int,
       release_date: date
       tagline: string
       vote_average: number
       vote_count: int
       original_title: string

     */
    loadMovieDetailData: function(movie_id) {
      var that = this;
      var params = {
        'api_key': that.api_key
      }
      var url = "https://api.themoviedb.org/3/movie/"+movie_id+'?'+ $.param(params) + "&append_to_response=trailers";
      $.getJSON(url,
        function() {})
        .fail(function() {
          console.log("error trying to fetch movie detail for movie_id: " + movie_id)
        })
        .done(function(data) {
          that.movie = data;
          console.log(that.movie);
          console.log(that.movie.trailers.youtube[0].source);
          that.updateViews("details")
        });
    }
  };

  // View for search
  var searchView = {

    registerController: function(){
      $("#uw_MB_searchButton").click(function(){
        // Gather our variables
        var genre_id = $("#uw_MB_genre").val();
        var min_release_date = $("#uw_MB_releaseDate #datepicker").val();
        var min_score = 5;

        //get results
        model.loadMoviesData(genre_id, min_score, min_release_date);
      });

      // Attach the datepicker
      $(function() {
        $( "#uw_MB_search #datepicker" ).datepicker({
          dateFormat: 'yy-mm-dd'
        });
      });
    },
    // Update our view
    updateView: function(msg){
      var t = "";
      if (msg === "error") {
        t = templates.error;
      } else if (msg === "search"){
        t = Mustache.render(templates.search, model);
      }

      $("#uw_MB_search").html(t);

      if (msg === "search"){
        searchView.registerController();
      }
    },

    initView: function() {
      console.log("Initializing uw_MB: searchView");
      model.addView(searchView.updateView);
    }
  };

  var resultsView = {

    registerController: function(){
      $(".uw_MB_result_item").each(function(){
          $(this).click(function(){
          console.log("item clicked: value is "+ $(this).data('value'));
          var movie_id = $(this).data('value');
          model.loadMovieDetailData(movie_id);
        });
      });

      $("#uw_MB_backToSearch").click(function(){
          model.updateViews("search");
      });
    },

    updateView: function(msg){
      var t = "";
      if (msg === "error") {
        t = templates.error;
      } else if (msg === "results"){
        t = Mustache.render(templates.results, model);
      }
      $("#uw_MB_results").html(t);

      if (msg === "results"){
        resultsView.registerController();
      }
    },

    initView: function(){
      console.log("Initialziating uw_MB: resultsView");
      model.addView(resultsView.updateView);
    }
  };

  var detailsView = {
    registerController: function(){
      $("#uw_MB_backToResults").click(function(){
          //get results again
          model.updateViews("results");
      });

      // Set the trailer url
      var trailerSource = model.movie.trailers.youtube[0].source;
      var trailerUrl = "https://www.youtube.com/watch?v=" + trailerSource;
      document.getElementById("uw_MB_trailer").href = trailerUrl;
    },

    updateView: function(msg) {
      var t = "";
      if (msg === "error") {
        t = templates.error;
      } else if (msg === "details"){
        t = Mustache.render(templates.details, model.movie);
      }
      $("#uw_MB_details").html(t);

      if (msg === "details"){
        detailsView.registerController();
      }
    },

    initView: function(){
      model.addView(detailsView.updateView);
    }
  };

  // Initialize our widget
  console.log("Initializing uw_MB(" + userid + ", " + htmlId + ")");
  portal.loadTemplates("widgets/uw_MB/templates.json",
      function (t) {
        templates = t;
        $(htmlId).html(templates.baseHtml);

        searchView.initView();
        resultsView.initView();
        detailsView.initView();

        model.loadGenreData();
      });
}
