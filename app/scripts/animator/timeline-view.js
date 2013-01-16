define(['ember','animator'], function(ember, Animator) {
  Animator.TimelineView = Ember.View.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),
	  templateName: 'timeline'
  });
  return Animator.TimelineView;
});
