define(['ember', 'animator/animator'], function(ember, Animator) {
  var set = Ember.set;
  var get = Ember.get;

  Animator.ComparisonView = Ember.View.extend({
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

  return Animator.ComparisonView;
});
