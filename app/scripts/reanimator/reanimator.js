define(['easeljs', 'ember', 
        'reanimator/application-controller', 'reanimator/application-view', 
        'reanimator/timeline-view', 'reanimator/workspace-controller', 
        'reanimator/workspace-view', 'reanimator/canvas-view', 
        'reanimator/shape-view', 'reanimator/comparison-view', 
        'reanimator/route.root.index', 'livingdead/tweenjs-ember-plugin'], function(
    createjs, Ember, ApplicationController, ApplicationView,
    TimelineView, WorkspaceController, WorkspaceView, CanvasView, 
    ShapeView, ComparisonView, RouteRootIndex, TweenEmberPlugin) { 

    TweenEmberPlugin.install();

    Reanimator = Ember.Application.create({
	    autoinit: false,
        toString: function() { return "Reanimator"; }
    });

    Reanimator.ApplicationController = ApplicationController;
    Reanimator.ApplicationView = ApplicationView;
    Reanimator.TimelineView = TimelineView;
    Reanimator.WorkspaceController = WorkspaceController;
    Reanimator.WorkspaceView = WorkspaceView;
    Reanimator.CanvasView = CanvasView;
    Reanimator.ShapeView = ShapeView;
    Reanimator.ComparisonView = ComparisonView;

    Reanimator.initialize(Ember.Router.create({
        //      enableLogging: true,
        location: 'hash',
        root: Ember.Route.extend({
            index: RouteRootIndex
        })
    }));

    return Reanimator;
});
