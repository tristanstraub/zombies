define(['ember', 'animator/mouse-state', 'animator/mouse-state-manager/state.tool.select.dragging'], function(Ember, MouseState, StateToolSelectDragging) {
    var set = Ember.set;
    var get = Ember.get;

    return MouseState.extend({
        down: MouseState.extend({
            setup: function(manager, event) {
                var canvasView = event.context;

                var offset = canvasView.$().offset();

                var cx = event.pageX - offset.left;
                var cy = event.pageY - offset.top;

					      var shapes = canvasView.shapesAtPoint(cx, cy).mapProperty('shape');
                
                if (shapes.length > 0) {
                    manager.transitionTo('dragging', { event: event, shapes: shapes, x: cx, y: cy });
                }
            },
            mouseUp: function(manager, event) {
                manager.transitionTo('idle');
            }
        }),
        dragging: StateToolSelectDragging
    });
});
