/**
 * Update the Date prototype for easier methods
 */
(function() {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  Date.prototype.getMonthName = function() {
    return months[this.getMonth()];
  };
  Date.prototype.getDayName = function() {
    return days[this.getDay()];
  };
})();


/**
 * BACKBONE FOR SHOWS PAGE
 */



var Show = Backbone.Model.extend({
  defaults: {
    title       : '',
    date        : '',
    time        : '',
    location    : '',
    address     : '',
    cost        : '',
    description : '' 
  },
  serialize: function() {
    j = this.toJSON();
    var parts = j.date.split('/');
    var date  = new Date(parts[2], parts[0]-1, parts[1]);
    j.dayName = date.getDayName();
    j.month   = date.getMonthName();
    j.dateNum = date.getDate();
    return j;
  }
});

var ShowView = Backbone.View.extend({
  tagName: 'article',
  className: 'upcoming-show',
  template: _.template($("#show-template").html() || ""),
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.serialize()));
    return this;
  }
});

var UpcomingShowsView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html("");
    this.collection.forEach(function(data) {
      var model = new Show(data);
      var view  = new ShowView({model: model});
      this.$el.append(view.el);
    }, this);
    return this;
  },
  el: $("#upcoming-shows")
});


/**
 * BACKBONE FOR VIDEOS
 */

var Video = Backbone.Model.extend({
  defaults: {
    link: '',
    title: ''
  },
  serialize: function() {
    var j = this.toJSON();
    j.youtube_id = j.link.split('watch?v=')[1];
    return j;
  }
});

var VideoView = Backbone.View.extend({
  tagName: 'article',
  className: 'video-card',
  template: _.template($('#video-template').html() || ''),
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.serialize()));
    return this;
  }
});

var VideosView = Backbone.View.extend({
  el: $("#videos"),
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.empty();
    this.collection.forEach(function(video) {
      var model = new Video(video);
      var view  = new VideoView({model: model});
      this.$el.append(view.el);
    },this);
    return this;
  }
})


/**
 * Shows Application Specific Code
 */

var App = {
  googleSheetsId: "1893GwMuuJSm0fAEfuMYuY3o0SjUypswuRMkhy7Cdt58"
};

App.onPage = function(name) {
  return $('main.'+name).length === 1;
}

App.listen = function() {
  $('.menu-icon').on('click', function() {
    $('.nav-bar').addClass('open');
  });
  $('.close-icon').on('click', function() {
    $('.nav-bar').removeClass('open');
  });
}

App.initialize = function() {
  App.listen();
  if (App.onPage('shows')){
    Shows.initialize();
  }
  else if (App.onPage('videos')){
    Videos.initialize();
  }

}

App.getSpreadsheetData = function(callback) {
  Tabletop.init({
    key:      App.googleSheetsId,
    callback: callback
  });
}

var Shows = {};

Shows.initialize = function() {
  App.getSpreadsheetData(function(data) {
    new UpcomingShowsView({ collection: data.shows.elements });
  })
};

var Videos = {};

Videos.initialize = function() {
  App.getSpreadsheetData(function(data) {
    new VideosView({ collection: data.videos.elements });
  })
};

/**
 * Main Execution
 */

App.initialize();

