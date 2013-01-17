define(['zombie', 
        'animator/animator', 
        'animator/application-controller',
        'animator/application-view',
        'animator/timeline-view',
        'animator/workspace-controller',
        'animator/workspace-view',
        'animator/canvas-view', 
        'animator/shape-view', 
        'animator/comparison-view', 
        'routes/root.index'], function(
          zombie, 
          Animator, 
          ApplicationController, 
          ApplicationView, 
          TimelineView, 
          WorkspaceController, 
          WorkspaceView,
          CanvasView, 
          ShapeView,
          ComparisonView,
          RootIndex) { 
  var set = Ember.set;
  var get = Ember.get;

  createjs.TweenEmberPlugin.install();

  Animator.initialize(Ember.Router.create({
    //      enableLogging: true,
    location: 'hash',
    root: Ember.Route.extend({
      index: RootIndex
    })
  }));
});
