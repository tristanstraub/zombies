define(['ember'], function(Ember) {
  var set = Ember.set, get = Ember.get;

  return Ember.View.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),

    left: null,
    right: null,

    equal: function() {
      return get(this, 'left') === get(this, 'right');
    }.property('left','right'),

    contains: function() {
      var right = get(this, 'right');
      return right.indexOf(get(this, 'left')) >= 0;
    }.property('left','right'),
  });
});

