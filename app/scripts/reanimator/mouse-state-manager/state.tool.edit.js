define(['ember', 'reanimator/mouse-state-manager/mouse-state'], function(Ember, MouseState) {
    var set = Ember.set, get = Ember.get;

    return MouseState.extend({
        down: MouseState.extend({
            setup: function(manager, event) {
                var canvasView = event.context;

                var offset = canvasView.$().offset();
                var cx = event.pageX - offset.left;
                var cy = event.pageY - offset.top;
                var shapesPoints = manager.shapesAtPoint(cx, cy);
                
                if (shapes.length > 0) {
                    manager.transitionTo('dragging', { event: event, shapesPoints: shapesPoints, x: cx, y: cy });
                }
            },

            mouseUp: function(manager, event) {
                manager.transitionTo('idle');
            }
        }),
        dragging: MouseState.extend({
            shapesPoints: null,
            startx: null,
            starty: null,

            coords: null,

            setup: function(manager, context) {
                set(this, 'shapesPoints', context.shapesPoints);
                set(this, 'startx', context.x);
                set(this, 'starty', context.y);

                var coords = context.shapes.map(function(shape) {
                    return { x:get(shape, 'x'), y: get(shape, 'y') };
                });
                set(this, 'coords', coords);
            },

            mouseMove: function(manager, event) {
                var canvasView = event.context;
                var offset = canvasView.$().offset();

                var dx = (event.pageX - offset.left) - get(this, 'startx');
                var dy = (event.pageY - offset.top) - get(this, 'starty');

                var coords = get(this, 'coords');
                get(this, 'shapes').forEach(function(shape, index) {
                    var newX = coords[index].x + dx;
                    var newY = coords[index].y + dy;

                    set(shape, 'x', newX);
                    set(shape, 'y', newY);
                });

                //var router = event.targetObject;
            },

            mouseUp: function(manager, event) {
                //var router = event.targetObject;
                var canvasView = event.context;

                manager.transitionTo('idle');
            }
        }),
    });
});
