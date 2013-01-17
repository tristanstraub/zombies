define(['ember', 'animator/mouse-state'], function(Ember, MouseState) {
    var set = Ember.set;
    var get = Ember.get;

    return MouseState.extend({
        down: MouseState.extend({
            mouseUp: function(manager, event) {
                var canvasView = event.context;

                var offset = canvasView.$().offset();
                var shapes = canvasView.shapesAtPoint(event.pageX - offset.left, event.pageY - offset.top).mapProperty('shape');
                
                manager.transitionTo('up');

                this.canvasClicked(event, shapes, event.pageX - offset.left, event.pageY - offset.top);
            },

            canvasClicked: function(event, shapesAtPoint, x, y) {
                var canvas = event.context;
                var brush = get(this, 'context.selectedBrush');

                if (brush) {
                    var canvasDelegate = brush.createDelegate(true);
                    var shapeDelegate = brush.createDelegate(true);
                    
                    set(canvasDelegate, 'brush', shapeDelegate);

                    set(canvasDelegate, 'properties.shape.x', x);
                    set(canvasDelegate, 'properties.shape.y', y);

                    canvas.addShape(canvasDelegate);
                    get(this, 'context.shapes').addObject(shapeDelegate);
                }
            }
        })
    });
});
