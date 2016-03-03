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
  template: _.template($("#show-template").html()),
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
 * Shows Application Specific Code
 */

var ShowsApp = {
  googleSheetsId: "1893GwMuuJSm0fAEfuMYuY3o0SjUypswuRMkhy7Cdt58",
  container:      "#upcoming-shows"
};

ShowsApp.initialize = function() {
  Tabletop.init({
    key:         this.googleSheetsId,
    callback:    this.receiveData,
    simpleSheet: true 
  });
};

ShowsApp.receiveData = function(data, tabletop) {
  new UpcomingShowsView({
    collection: data
  });
};


/**
 * Main Execution
 */

ShowsApp.initialize();

