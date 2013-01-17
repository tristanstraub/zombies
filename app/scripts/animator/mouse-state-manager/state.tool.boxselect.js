define(['ember', 'animator/mouse-state', 'animator/mouse-state-manager/state.tool.select.selecting'], function(Ember, MouseState, StateToolSelectSelecting) {
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
                
                manager.transitionTo('selecting', { event: event, cx: cx, cy: cy});
            },
            mouseUp: function(manager, event) {
                manager.transitionTo('idle');
            }
        }),
        selecting: StateToolSelectSelecting
    });
});
