define(['ember', 'animator/mouse-state-manager/mouse-state', 'animator/mouse-state-manager/state.tool.select.dragging'], function(Ember, MouseState, StateToolSelectDragging) {
    var set = Ember.set;
    var get = Ember.get;

    return MouseState.extend({
        down: MouseState.extend({
            setup: function(manager, event) {
                var canvasView = event.context;

                var offsets = manager.getOffsets(event);
				var shapes = canvasView.shapesAtPoint(offsets.cx, offsets.cy).mapProperty('shape');

                if (shapes.length > 0) {
                    manager.transitionTo('dragging', { event: event, shapes: shapes, x: offsets.cx, y: offsets.cy });
                }
            },

            mouseUp: function(manager, event) {
                manager.transitionTo('idle');
            }
        }),

        dragging: StateToolSelectDragging
    });
});
