define(['ember','animator/animator'], function(ember, Animator) {
  Animator.WorkspaceView = Ember.View.extend({
    layout: Ember.Handlebars.compile('{{yield}}'),
	  templateName: 'workspace'
  });
  return Animator.WorkspaceView;
});
