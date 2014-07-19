function uw_MB(userid, htmlId) {

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
          that.course = data.genres;
          console.log(that.course);
          //updateView?
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
        'vote_average.gte' min_score,
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

  model.loadGenreData();
  model.loadMoviesData(12, 0);
}
