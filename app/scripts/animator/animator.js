define(['easeljs', 'ember', 
        'animator/application-controller', 'animator/application-view', 
        'animator/timeline-view', 'animator/workspace-controller', 
        'animator/workspace-view', 'animator/canvas-view', 
        'animator/shape-view', 'animator/comparison-view', 
        'animator/route.root.index', 'zombie/tweenjs-ember-plugin'], function(
    createjs, Ember, ApplicationController, ApplicationView,
    TimelineView, WorkspaceController, WorkspaceView, CanvasView, 
    ShapeView, ComparisonView, RouteRootIndex, TweenEmberPlugin) { 

    TweenEmberPlugin.install();

    Animator = Ember.Application.create({
	    autoinit: false,
        toString: function() { return "Animator"; }
    });

    Animator.ApplicationController = ApplicationController;
    Animator.ApplicationView = ApplicationView;
    Animator.TimelineView = TimelineView;
    Animator.WorkspaceController = WorkspaceController;
    Animator.WorkspaceView = WorkspaceView;
    Animator.CanvasView = CanvasView;
    Animator.ShapeView = ShapeView;
    Animator.ComparisonView = ComparisonView;

    Animator.initialize(Ember.Router.create({
        //      enableLogging: true,
        location: 'hash',
        root: Ember.Route.extend({
            index: RouteRootIndex
        })
    }));

    return Animator;
});
