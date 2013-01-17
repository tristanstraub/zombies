define(['ember', 'animator/animator'], function(ember, Animator) {
  Animator.ApplicationView = Ember.View.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),
    templateName: 'application'
  });

  return Animator.ApplicationView;
});

