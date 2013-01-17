define(['ember', 'animator/mouse-state'], function(Ember, MouseState) {
    var set = Ember.set;
    var get = Ember.get;

    var Z = Zombie.Z;
    var P = Zombie.P;

    return MouseState.extend({
        context: null,

        setup: function(manager, context) {
            var event = context.event;
            set(this, 'context', context);

            var rectangle = Zombie.Rectangle.create({
                properties: P({
                    rectangle: P({
                        width: 0,
                        height: 0
                    }),
                    shape: P({
                        x: context.cx,
                        y: context.cy
                    })
                })
            });

            set(this, 'context.rectangle', rectangle);

            var canvasView = event.context;
            canvasView.addShapeToStage(rectangle);
        },

        setCorners: function(event) {
            var offsets = this.getOffsets(event);

            var context = get(this, 'context');

            var dx = offsets.cx - context.cx;
            var dy = offsets.cy - context.cy;

            var x = context.cx;
            var y = context.cy;

            if (dx < 0) {
                x = context.cx + dx;
            }

            if (dy < 0) {
                y = context.cy + dy;
            }

            set(this, 'context.rectangle.x', x);
            set(this, 'context.rectangle.y', y);
            set(this, 'context.rectangle.width', Math.abs(dx));
            set(this, 'context.rectangle.height', Math.abs(dy));
        },

        mouseMove: function(manager, event) {
            this.setCorners(event);

            manager.send('highlightShapesAndPoints', event);
        },

        mouseUp: function(manager, event) {
            this.setCorners(event);

            var canvasView = event.context;
            var rectangle = get(this, 'context.rectangle');
            
            var x = get(this, 'context.rectangle.x');
            var y = get(this, 'context.rectangle.y');
            var width = get(this, 'context.rectangle.width');
            var height = get(this, 'context.rectangle.height');
            var shapesPoints = canvasView.getContainedShapesPoints(x,y,width,height);

            rectangle.removeFromStage();
           
            manager.transitionTo('idle');
        }
    });
});
